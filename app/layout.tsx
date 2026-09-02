import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOD+A CHALLENGE",
  description:
    "A Design Challenge in collaboration with Fab Lab Barcelona and OCAD University",
  metadataBase: new URL("https://sodachallenge.org"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
