import Hero from "@/components/hero/Hero";
import Brief from "@/components/Brief";
import ScrollHue from "@/components/ScrollHue";
import SiteActions from "@/components/SiteActions";
import { listBubbleImages, shuffleBubbleImages } from "@/lib/bubbleImages";

export default function HomePage() {
  const bubbleImages = shuffleBubbleImages(listBubbleImages());

  return (
    <main>
      <ScrollHue />
      <SiteActions placement="nav" />
      <Hero />
      <Brief images={bubbleImages} />
    </main>
  );
}
