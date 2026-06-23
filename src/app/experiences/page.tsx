import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Home from "../page";
import { experiencesEnabled } from "@/lib/featureFlags";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Professional experience of Wesley Ramalho — Senior Software Engineer at Tecla (CredoAI), Zappos via Truelogic, OnChain Studios, X-Team, Popstand, iCarros (Itaú), and SENAI.",
  alternates: { canonical: "https://wesleyramalho.com/experiences" },
};

export default function ExperiencesPage() {
  if (!experiencesEnabled) notFound();
  return <Home />;
}
