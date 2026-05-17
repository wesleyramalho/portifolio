"use client";

import dynamic from "next/dynamic";

// Heavy WebGL + OGL + 12 GLSL shaders — defer until after hydration
const FluidCanvas = dynamic(() => import("./FluidCanvas"), { ssr: false });

export default FluidCanvas;
