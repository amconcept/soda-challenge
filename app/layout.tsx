import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

/* Pixel face for the prompt words only, the same face as the Rando Calrissian title.
   See DESIGN_DECISIONS.md. */
const rando = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rando",
});

export const metadata: Metadata = {
  title: "SOD+A CHALLENGE",
  description:
    "A Design Challenge in collaboration with Fab Lab Barcelona and OCAD University",
  metadataBase: new URL("https://sodachallenge.org"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rando.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
