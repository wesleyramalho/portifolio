import SectionsContainer from "@/components/SectionsContainer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experiences from "@/components/sections/Experiences";
import Projects from "@/components/sections/Projects";
import Talks from "@/components/sections/Talks";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import { experiencesEnabled } from "@/lib/featureFlags";

export default function Home() {
  return (
    <SectionsContainer>
      <Hero />
      <About />
      <Projects />
      <Talks />
      {experiencesEnabled && <Experiences />}
      <Education />
      <Contact />
    </SectionsContainer>
  );
}
