import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOD+A CHALLENGE",
  description: "A design challenge co-created by OCAD University, Fab Lab BCN, and LCC Fab Lab.",
  metadataBase: new URL("https://sodachallenge.org"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
