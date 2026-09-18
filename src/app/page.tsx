import { Nav } from "@/components/hud/Nav";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { FeatureGallery } from "@/components/anime/FeatureGallery";
import { StackModules } from "@/components/anime/StackModules";
import { EasingPlayground } from "@/components/anime/EasingPlayground";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Resume } from "@/components/sections/Resume";
import { Achievements } from "@/components/sections/Achievements";
import { About } from "@/components/sections/About";
import { Tracks } from "@/components/sections/Tracks";
import { Interests } from "@/components/sections/Interests";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      {/* The fixed WebGL board is choreographed over this range:
          assembled in the hero, exploded behind the gallery, rebuilt
          in its last chapter, then dropped away. */}
      <div id="engine-range" className="relative">
        <Hero />
        <Marquee />
        <FeatureGallery />
      </div>
      <Skills />
      <StackModules />
      <Projects />
      <Experience />
      <Achievements />
      <Resume />
      <About />
      <Interests />
      <Tracks />
      <EasingPlayground />
      <Contact />
      <Footer />
    </main>
  );
}
