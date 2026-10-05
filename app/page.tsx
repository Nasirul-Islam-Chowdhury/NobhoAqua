import { Footer } from "@/components/Footer";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { MissionVisionAbout } from "@/components/MissionVisionAbout";
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
        <Team />
      </main>
      <Footer />
    </>
  );
}
