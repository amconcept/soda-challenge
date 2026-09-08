import Hero from "@/components/hero/Hero";
import Brief from "@/components/Brief";
import ScrollHue from "@/components/ScrollHue";
import SiteActions from "@/components/SiteActions";
import { listBubbleImages, shuffleBubbleImages } from "@/lib/bubbleImages";

export const dynamic = "force-static";

const bubbleImages = shuffleBubbleImages(listBubbleImages());

export default function HomePage() {
  return (
    <main>
      <ScrollHue />
      <SiteActions placement="nav" />
      <Hero />
      <Brief images={bubbleImages} />
    </main>
  );
}
