import Hero from "@/components/hero/Hero";
import Brief from "@/components/Brief";
import ScrollHue from "@/components/ScrollHue";
import SiteActions from "@/components/SiteActions";
import { BubbleDeckProvider } from "@/components/Bubbles";
import { listBubbleImages } from "@/lib/bubbleImages";

export default function HomePage() {
  const bubbleImages = listBubbleImages();

  return (
    <main>
      <ScrollHue />
      <SiteActions placement="nav" />
      <Hero />
      <BubbleDeckProvider images={bubbleImages}>
        <Brief />
      </BubbleDeckProvider>
    </main>
  );
}
