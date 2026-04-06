import { BentoPortfolio } from "@/components/bento-portfolio";
import { ContactCTA } from "@/components/contact-cta";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { TopSnippets } from "@/components/top-snippets";

export default function Home() {
  const staticLinks: Record<string, string> = {
    linkedIn: "https://linkedin.com/in/mrsan/?locale=en-US",
  };
  return (
    <main className="min-h-screen bg-background">
      <Navbar staticLinks={staticLinks} />
      <Hero staticLinks={staticLinks} />
      <BentoPortfolio />
      <TopSnippets />
      {/* <Testimonials /> */}
      <ContactCTA />
      <Footer />
    </main>
  );
}
