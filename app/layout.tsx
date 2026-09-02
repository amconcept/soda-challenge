import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOD+A CHALLENGE",
  description: "A design challenge in collaboration with OCAD University and Fab Lab BCN.",
  metadataBase: new URL("https://sodachallenge.org"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
