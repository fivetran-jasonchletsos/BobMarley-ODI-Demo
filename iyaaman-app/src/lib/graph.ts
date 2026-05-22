// Full album similarity graph — nodes + edges for the force-directed network.
// Each album becomes a node; edges connect albums whose relatedFor() lists
// include each other (top-6 per node, undirected union).

import { albums } from "./albums";
import { allTagged } from "./album-tags";
import { relatedFor } from "./related";

export type GraphNode = {
  id: string;           // album slug
  artistDisplay: string;
  title: string;
  year: number;
  primaryGenre: string; // first genre tag, for color
  decade: number;
};

export type GraphEdge = {
  source: string; // album slug
  target: string;
  score: number;  // 0..1
};

let _nodes: GraphNode[] | null = null;
let _edges: GraphEdge[] | null = null;

export function buildGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  if (_nodes && _edges) return { nodes: _nodes, edges: _edges };

  const tagged = allTagged();

  const nodes: GraphNode[] = tagged
    .filter((t) => t.tags.genres.length > 0)
    .map((t) => ({
      id: t.album.slug,
      artistDisplay: t.album.artistDisplay,
      title: t.album.title,
      year: t.album.year,
      primaryGenre: t.tags.genres[0] ?? "rg",
      decade: t.tags.decade,
    }));

  const nodeSet = new Set(nodes.map((n) => n.id));
  const edgeMap = new Map<string, number>(); // "a|b" -> max score

  for (const node of nodes) {
    const neighbors = relatedFor(node.id).slice(0, 6);
    for (const nb of neighbors) {
      if (!nodeSet.has(nb.slug)) continue;
      const parts = [node.id, nb.slug].sort();
      const key = parts[0] + "|" + parts[1];
      const existing = edgeMap.get(key) ?? 0;
      if (nb.score > existing) edgeMap.set(key, nb.score);
    }
  }

  const edges: GraphEdge[] = Array.from(edgeMap.entries()).map(([key, score]) => {
    const sep = key.indexOf("|");
    const source = key.slice(0, sep);
    const target = key.slice(sep + 1);
    return { source, target, score };
  });

  _nodes = nodes;
  _edges = edges;
  return { nodes, edges };
}

// Genre code -> HSL hue for node coloring
const GENRE_HUE: Record<string, number> = {
  rg:     130,  // reggae — green
  rr:     140,  // roots reggae — deeper green
  du:     165,  // dub — teal
  sk:     160,  // ska — seafoam
  rs:     155,  // rocksteady
  co_reg: 120,  // conscious reggae — leaf
  dh:     90,   // dancehall — yellow-green
  ny:     175,  // nyahbinghi — aqua
  rg_pop: 80,   // reggae pop — lime
  hh:     210,  // hip-hop — blue
  rb:     240,  // R&B — purple-blue
  sl:     30,   // soul — amber
  pop:    300,  // pop — magenta
  af:     50,   // afrobeat — orange-gold
  cr2:    220,  // conscious rap — royal blue
  exp:    270,  // experimental — violet
  ak:     200,  // acoustic — sky
};

export function genreColor(genre: string, alpha = 1): string {
  const hue = GENRE_HUE[genre] ?? 130;
  return `hsla(${hue}, 65%, 60%, ${alpha})`;
}

// Confirm albums is imported (used to avoid tree-shake of unused import warning)
void albums;
