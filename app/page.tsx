import { BentoPortfolio } from "@/components/bento-portfolio";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";

export default function Home() {
  const staticLinks: Record<string, string> = {
    linkedIn: "https://linkedin.com/in/mrsan/?locale=en-US",
  };
  return (
    <main className="min-h-screen bg-background">
      <Navbar staticLinks={staticLinks} />
      <Hero staticLinks={staticLinks} />
      <BentoPortfolio />
      <Footer />
    </main>
  );
}
