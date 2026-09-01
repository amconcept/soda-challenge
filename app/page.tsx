import Hero from "@/components/hero/Hero";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section id="intro" className="intro">
        <p className="intro-kicker">The brief</p>
        <h1>A design challenge is taking shape.</h1>
        <p>
          This section is a placeholder so Discover has somewhere to land.
          Challenge copy, timeline, and how to enter come next.
        </p>
      </section>
    </main>
  );
}
