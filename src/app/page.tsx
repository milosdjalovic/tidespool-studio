import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Portfolio } from "@/components/Portfolio";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { getPortfolioItems } from "@/lib/storage";

export default async function Home() {
  const portfolioItems = await getPortfolioItems();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio items={portfolioItems} />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
