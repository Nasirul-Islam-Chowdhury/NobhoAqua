import { Footer } from "@/components/Footer";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { MissionVisionAbout } from "@/components/MissionVisionAbout";
import { SdgSection } from "@/components/SdgSection";
import { Timeline } from "@/components/Timeline";
import { Team } from "@/components/Team";
import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <MissionVisionAbout />
        <SdgSection />
        <Timeline />
        <Team />
      </main>
      <Footer />
    </>
  );
}
