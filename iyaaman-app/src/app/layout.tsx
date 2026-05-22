import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tuff Gong · Bob Marley · The Complete Universe",
  description:
    "Bob Marley — his music, his family, the Wailers, Tuff Gong, Trench Town, Rastafari, and everyone he made along the way.",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-serif antialiased">{children}</body>
    </html>
  );
}
