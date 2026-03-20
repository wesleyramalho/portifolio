import SectionsContainer from "@/components/SectionsContainer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experiences from "@/components/sections/Experiences";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <SectionsContainer>
      <Hero />
      <About />
      <Experiences />
      <Education />
      <Contact />
    </SectionsContainer>
  );
}
