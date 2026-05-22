"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import TopNav from "@/components/TopNav";
import { buildGraph, genreColor, type GraphNode, type GraphEdge } from "@/lib/graph";
import { relatedFor } from "@/lib/related";
import { tagsFor, GENRE_LABEL, LINEAGE_LABEL } from "@/lib/album-tags";
import { albumBySlug } from "@/lib/albums";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// ---------------------------------------------------------------------------
// Force simulation (no external library)
// ---------------------------------------------------------------------------
type Vec2 = { x: number; y: number };

function runSimulation(
  nodes: GraphNode[],
  edges: GraphEdge[],
  width: number,
  height: number,
  onTick: (positions: Vec2[]) => void,
  onDone: (positions: Vec2[]) => void
) {
  const n = nodes.length;
  const pos: Vec2[] = nodes.map(() => ({
    x: width / 2 + (Math.random() - 0.5) * Math.min(width, height) * 0.5,
    y: height / 2 + (Math.random() - 0.5) * Math.min(width, height) * 0.5,
  }));
  const vel: Vec2[] = nodes.map(() => ({ x: 0, y: 0 }));

  const adjMap = new Map<string, { target: number; score: number }[]>();
  const idToIdx = new Map(nodes.map((nd, i) => [nd.id, i]));
  for (const e of edges) {
    const si = idToIdx.get(e.source);
    const ti = idToIdx.get(e.target);
    if (si == null || ti == null) continue;
    if (!adjMap.has(e.source)) adjMap.set(e.source, []);
    if (!adjMap.has(e.target)) adjMap.set(e.target, []);
    adjMap.get(e.source)!.push({ target: ti, score: e.score });
    adjMap.get(e.target)!.push({ target: si, score: e.score });
  }

  const REPEL    = 3200;
  const SPRING_K = 0.04;
  const REST_LEN = 120;
  const CENTER_G = 0.01;
  const DAMP     = 0.82;

  let alpha = 1.0;
  let frame = 0;
  let rafId: number;

  function tick() {
    alpha *= 0.992;
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < n; i++) {
      let fx = 0;
      let fy = 0;

      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const dist2 = dx * dx + dy * dy + 1;
        const dist  = Math.sqrt(dist2);
        const str   = REPEL / dist2;
        fx += (dx / dist) * str;
        fy += (dy / dist) * str;
      }

      const nbrs = adjMap.get(nodes[i].id) ?? [];
      for (const { target: j, score } of nbrs) {
        const dx = pos[j].x - pos[i].x;
        const dy = pos[j].y - pos[i].y;
        const dist    = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const stretch = dist - REST_LEN * (1 - score * 0.3);
        fx += (dx / dist) * SPRING_K * stretch;
        fy += (dy / dist) * SPRING_K * stretch;
      }

      fx += (cx - pos[i].x) * CENTER_G;
      fy += (cy - pos[i].y) * CENTER_G;

      vel[i].x = (vel[i].x + fx * alpha) * DAMP;
      vel[i].y = (vel[i].y + fy * alpha) * DAMP;
      pos[i].x = Math.max(20, Math.min(width  - 20, pos[i].x + vel[i].x));
      pos[i].y = Math.max(20, Math.min(height - 20, pos[i].y + vel[i].y));
    }

    frame++;
    if (frame % 4 === 0) onTick([...pos.map((p) => ({ ...p }))]);

    if (alpha > 0.01 && frame < 600) {
      rafId = requestAnimationFrame(tick);
    } else {
      onDone([...pos.map((p) => ({ ...p }))]);
    }
  }

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

// ---------------------------------------------------------------------------
// Canvas renderer
// ---------------------------------------------------------------------------
const NODE_R     = 7;
const NODE_R_SEL = 13;
const NODE_R_HOV = 10;

function drawGraph(
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  edges: GraphEdge[],
  positions: Vec2[],
  idToIdx: Map<string, number>,
  selectedId: string | null,
  hoveredId: string | null,
  coverImgs: Map<string, HTMLImageElement>
) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = "#0d1a10";
  ctx.fillRect(0, 0, W, H);

  // Edges
  for (const e of edges) {
    const si = idToIdx.get(e.source);
    const ti = idToIdx.get(e.target);
    if (si == null || ti == null) continue;
    const sp = positions[si];
    const tp = positions[ti];
    if (!sp || !tp) continue;

    const isHighlighted =
      e.source === selectedId || e.target === selectedId ||
      e.source === hoveredId  || e.target === hoveredId;

    ctx.beginPath();
    ctx.moveTo(sp.x, sp.y);
    ctx.lineTo(tp.x, tp.y);
    if (isHighlighted) {
      ctx.strokeStyle = `rgba(230,184,0,${0.25 + e.score * 0.45})`;
      ctx.lineWidth   = 1 + e.score * 1.5;
    } else {
      ctx.strokeStyle = `rgba(244,236,214,${0.02 + e.score * 0.07})`;
      ctx.lineWidth   = 0.4 + e.score * 0.7;
    }
    ctx.stroke();
  }

  const specialIds = new Set([selectedId, hoveredId].filter(Boolean));

  const drawNode = (node: GraphNode, i: number) => {
    const p = positions[i];
    if (!p) return;

    const isSel = node.id === selectedId;
    const isHov = node.id === hoveredId;
    const r     = isSel ? NODE_R_SEL : isHov ? NODE_R_HOV : NODE_R;
    const color = genreColor(node.primaryGenre);

    if (isSel) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r + 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(230,184,0,0.18)";
      ctx.fill();
    }

    const img = coverImgs.get(node.id);
    if (img && img.complete) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, p.x - r, p.y - r, r * 2, r * 2);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = isSel
      ? "#e6b800"
      : isHov
      ? "rgba(244,236,214,0.75)"
      : "rgba(244,236,214,0.18)";
    ctx.lineWidth = isSel ? 2 : 1;
    ctx.stroke();

    if (isSel || isHov) {
      const label = node.title.length > 28 ? node.title.slice(0, 26) + "…" : node.title;
      ctx.font      = `600 11px 'JetBrains Mono', monospace`;
      ctx.fillStyle = isSel ? "#e6b800" : "#f4ecd6";
      ctx.textAlign = "center";
      ctx.fillText(label, p.x, p.y + r + 14);
      ctx.font      = `10px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "rgba(244,236,214,0.5)";
      ctx.fillText(node.artistDisplay.slice(0, 28), p.x, p.y + r + 26);
    }
  };

  nodes.forEach((node, i) => {
    if (!specialIds.has(node.id)) drawNode(node, i);
  });
  nodes.forEach((node, i) => {
    if (specialIds.has(node.id)) drawNode(node, i);
  });
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
export default function RelatedConstellationPage() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const posRef      = useRef<Vec2[]>([]);
  const [positions, setPositions] = useState<Vec2[]>([]);
  const [simDone,   setSimDone]   = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId,  setHoveredId]  = useState<string | null>(null);
  const [transform,  setTransform]  = useState({ x: 0, y: 0, scale: 1 });
  const dragging  = useRef<{ startX: number; startY: number; tx: number; ty: number } | null>(null);
  const coverImgs = useRef<Map<string, HTMLImageElement>>(new Map());
  const rafRef    = useRef<number>(0);

  const { nodes, edges } = useMemo(() => buildGraph(), []);
  const idToIdx = useMemo(() => new Map(nodes.map((n, i) => [n.id, i])), [nodes]);

  const [size, setSize] = useState({ w: 900, h: 660 });
  useEffect(() => {
    function measure() {
      const el = canvasRef.current?.parentElement;
      if (el) setSize({ w: el.clientWidth, h: Math.min(el.clientWidth * 0.72, 660) });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    for (const node of nodes) {
      if (!coverImgs.current.has(node.id)) {
        const src = `${BASE_PATH}/covers/${node.id}.jpg`;
        const img = new Image();
        img.src = src;
        coverImgs.current.set(node.id, img);
      }
    }
  }, [nodes]);

  useEffect(() => {
    if (size.w < 100) return;
    setSimDone(false);
    const cleanup = runSimulation(
      nodes, edges, size.w, size.h,
      (pos) => { posRef.current = pos; setPositions([...pos]); },
      (pos) => { posRef.current = pos; setPositions([...pos]); setSimDone(true); }
    );
    return cleanup;
  }, [nodes, edges, size.w, size.h]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || posRef.current.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    canvas.width        = size.w * dpr;
    canvas.height       = size.h * dpr;
    canvas.style.width  = `${size.w}px`;
    canvas.style.height = `${size.h}px`;

    cancelAnimationFrame(rafRef.current);

    function frame() {
      if (!ctx || !canvas) return;
      const logW = canvas.width / dpr;
      const logH = canvas.height / dpr;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0d1a10";
      ctx.fillRect(0, 0, logW, logH);

      ctx.translate(transform.x + logW / 2, transform.y + logH / 2);
      ctx.scale(transform.scale, transform.scale);
      ctx.translate(-logW / 2, -logH / 2);

      drawGraph(ctx, nodes, edges, posRef.current, idToIdx,
        selectedId, hoveredId, coverImgs.current);

      ctx.restore();
      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [positions, selectedId, hoveredId, transform, size, nodes, edges, idToIdx]);

  function toCanvas(clientX: number, clientY: number, canvas: HTMLCanvasElement): Vec2 {
    const rect = canvas.getBoundingClientRect();
    const lx = clientX - rect.left;
    const ly = clientY - rect.top;
    const cx = size.w / 2;
    const cy = size.h / 2;
    return {
      x: (lx - cx - transform.x) / transform.scale + cx,
      y: (ly - cy - transform.y) / transform.scale + cy,
    };
  }

  function nearestNode(cx: number, cy: number): GraphNode | null {
    let best: GraphNode | null = null;
    let bestDist = 22;
    posRef.current.forEach((p, i) => {
      if (!p) return;
      const d = Math.hypot(p.x - cx, p.y - cy);
      if (d < bestDist) { bestDist = d; best = nodes[i]; }
    });
    return best;
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (dragging.current) {
      const dx = e.clientX - dragging.current.startX;
      const dy = e.clientY - dragging.current.startY;
      setTransform((t) => ({ ...t, x: dragging.current!.tx + dx, y: dragging.current!.ty + dy }));
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = toCanvas(e.clientX, e.clientY, canvas);
    const node = nearestNode(x, y);
    setHoveredId(node?.id ?? null);
    canvas.style.cursor = node ? "pointer" : "grab";
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    dragging.current = { startX: e.clientX, startY: e.clientY, tx: transform.x, ty: transform.y };
  }

  function onMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    const moved = dragging.current
      ? Math.hypot(e.clientX - dragging.current.startX, e.clientY - dragging.current.startY) > 4
      : false;
    dragging.current = null;
    if (!moved) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { x, y } = toCanvas(e.clientX, e.clientY, canvas);
      const node = nearestNode(x, y);
      setSelectedId(node?.id ?? null);
    }
  }

  function onWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform((t) => ({
      ...t,
      scale: Math.max(0.3, Math.min(4, t.scale * factor)),
    }));
  }

  const selectedAlbum     = selectedId ? albumBySlug(selectedId) : null;
  const selectedNeighbors = selectedId ? relatedFor(selectedId) : [];
  const selectedTags      = selectedAlbum ? tagsFor(selectedAlbum) : null;

  return (
    <>
      <TopNav />

      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-10 pb-6">
        <p className="ornament mb-3">Similarity Map</p>
        <h1 className="display text-bark text-5xl sm:text-6xl md:text-7xl tracking-tight leading-none">
          Related Albums
        </h1>
        <p className="serif italic text-bark_2 text-lg sm:text-xl mt-5 max-w-3xl leading-relaxed">
          Every Marley record as a node. Edges connect albums linked by genre,
          production lineage, and era — computed via tag-vector Jaccard similarity.
          Drag to pan, scroll to zoom, click any album to explore its neighbors.
        </p>
        <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-3">
          {nodes.length} albums &middot; {edges.length} similarity edges &middot;{" "}
          {simDone ? "settled" : "settling…"}
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto" />

      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto">
        {/* Canvas */}
        <div
          className="flex-1 min-w-0 relative bg-bark"
          style={{ minHeight: `${size.h}px` }}
        >
          <canvas
            ref={canvasRef}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={() => { setHoveredId(null); dragging.current = null; }}
            onWheel={onWheel}
            style={{ display: "block", cursor: "grab", userSelect: "none" }}
          />
          {!simDone && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="mono text-[10px] uppercase tracking-widest text-gold animate-pulse">
                Calculating similarity graph&hellip;
              </p>
            </div>
          )}

          {/* Genre legend */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-x-3 gap-y-1 max-w-xs">
            {([
              ["rr",     "Roots reggae"],
              ["du",     "Dub"],
              ["sk",     "Ska"],
              ["co_reg", "Conscious"],
              ["dh",     "Dancehall"],
              ["rg_pop", "Reggae pop"],
              ["hh",     "Hip-hop"],
              ["rb",     "R&B"],
              ["af",     "Afrobeat"],
            ] as [string, string][]).map(([g, label]) => (
              <span key={g} className="flex items-center gap-1">
                <span
                  className="inline-block rounded-full"
                  style={{ width: 8, height: 8, background: genreColor(g) }}
                />
                <span className="mono text-[9px] uppercase tracking-widest text-sand/50">
                  {label}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <aside
          className="w-full lg:w-80 border-t border-bark/20 lg:border-t-0 lg:border-l lg:border-bark/20 flex-none overflow-y-auto bg-sand_2/30"
          style={{ maxHeight: `${size.h + 80}px` }}
        >
          {selectedAlbum ? (
            <div className="p-5">
              <div className="flex gap-4 items-start mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${BASE_PATH}/covers/${selectedAlbum.slug}.jpg`}
                  alt=""
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  className="h-16 w-16 flex-none object-cover border border-bark/20"
                />
                <div className="min-w-0">
                  <h2 className="serif text-bark text-base leading-tight">
                    {selectedAlbum.title}
                  </h2>
                  <p className="mono text-[10px] uppercase tracking-widest text-cocoa mt-1">
                    {selectedAlbum.artistDisplay} &middot; {selectedAlbum.year}
                  </p>
                </div>
              </div>

              {selectedTags && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {selectedTags.genres.map((g) => (
                    <span key={g} className="mono text-[9px] uppercase tracking-widest border border-bark/20 px-1.5 py-0.5 text-bark_2">
                      {GENRE_LABEL[g] ?? g}
                    </span>
                  ))}
                  {selectedTags.lineage.map((l) => (
                    <span key={l} className="mono text-[9px] uppercase tracking-widest border border-gold/40 px-1.5 py-0.5 text-gold">
                      {LINEAGE_LABEL[l] ?? l}
                    </span>
                  ))}
                </div>
              )}

              <Link
                href={`/discography/${selectedAlbum.slug}/`}
                className="inline-block mono text-[9px] uppercase tracking-widest text-ember border border-ember/40 px-3 py-1.5 hover:bg-ember hover:text-sand transition-colors"
              >
                View album
              </Link>

              <div className="mt-6 border-t border-bark/15 pt-4">
                <p className="mono text-[9px] uppercase tracking-widest text-cocoa mb-2">
                  Nearest neighbors
                </p>
                <ol className="space-y-1">
                  {selectedNeighbors.map((nb) => (
                    <li key={nb.slug}>
                      <button
                        onClick={() => setSelectedId(nb.slug)}
                        className="w-full text-left px-2 py-1.5 border-l-2 border-bark/15 hover:border-gold hover:bg-sand_2/60 transition-colors"
                      >
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="serif text-sm text-bark truncate">{nb.album.title}</span>
                          <span className="mono text-[9px] text-gold flex-none">
                            {Math.round(nb.score * 100)}%
                          </span>
                        </div>
                        <p className="mono text-[9px] uppercase tracking-widest text-cocoa truncate">
                          {nb.album.artistDisplay}
                        </p>
                        <p className="mono text-[9px] uppercase tracking-widest text-bark_2 truncate mt-0.5">
                          {nb.why}
                        </p>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 border-t border-bark/15 pt-4">
                <p className="text-[11px] leading-relaxed text-cocoa">
                  Graph built from tag-vector Jaccard similarity over genre,
                  production lineage, and era. Top-6 neighbors per album,
                  undirected union. {nodes.length} nodes &middot; {edges.length} edges.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 flex flex-col gap-3">
              <p className="mono text-[10px] uppercase tracking-widest text-cocoa">
                Click any node to explore
              </p>
              <p className="serif text-bark_2 text-sm leading-relaxed">
                Every album in the catalog is a node. Edges connect the most
                similar records by genre, production lineage, and era. Clusters
                form naturally — roots records in one corner, dancehall in
                another, cross-genre collaborations bridging them.
              </p>
              <p className="mono text-[9px] uppercase tracking-widest text-cocoa mt-2">
                {nodes.length} albums &middot; {edges.length} connections
              </p>
            </div>
          )}
        </aside>
      </div>

      <footer className="border-t border-bark/15 bg-sand_2/40 mt-6">
        <div className="tricolor-bar-thin" />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 text-center">
          <p className="serif italic text-cocoa text-sm">
            One love. One heart. Let&apos;s get together and feel all right.
          </p>
          <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-3">
            Tuff Gong &middot; A demo built for Kamal Soliman &middot; 2026
          </p>
        </div>
      </footer>
    </>
  );
}
