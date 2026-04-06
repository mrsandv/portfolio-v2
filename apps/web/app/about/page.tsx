import type { Metadata } from "next";
import { getProfile } from "@/lib/api/profile";
import { AboutPageContent } from "@/components/about/about-page-content";

export const metadata: Metadata = {
  title: "Sobre mí | Spacehole Tech",
  description:
    "Conoce a Marco — ingeniero de software con 7+ años de experiencia en Go, React/Next.js y arquitectura de sistemas escalables.",
};

export default async function AboutPage() {
  const profile = await getProfile();
  return <AboutPageContent profile={profile} />;
}
