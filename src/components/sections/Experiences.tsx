"use client";

import { useEffect, useState } from "react";
import ExperiencesDesktop3D from "../ui/ExperiencesDesktop3D";
import ExperiencesMobileList from "../ui/ExperiencesMobileList";

function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${breakpoint}px)`);

    const update = () => setIsDesktop(media.matches);
    update();

    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [breakpoint]);

  return isDesktop;
}

export default function Experiences() {
  const isDesktop = useIsDesktop(768);

  return isDesktop ? <ExperiencesDesktop3D /> : <ExperiencesMobileList />;
}
