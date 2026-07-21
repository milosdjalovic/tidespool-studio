import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Portfolio } from "@/components/Portfolio";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { SiteThemeStyles } from "@/components/SiteThemeStyles";
import { getPortfolioItems, getSiteContent, getSiteTheme } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home() {
  const [portfolioItems, content, theme] = await Promise.all([
    getPortfolioItems(),
    getSiteContent(),
    getSiteTheme(),
  ]);

  return (
    <>
      <SiteThemeStyles theme={theme} />
      <Header siteName={content.general.siteName} />
      <main>
        <Hero content={content.hero} />
        <About content={content.about} />
        <Services content={content.services} />
        <Portfolio items={portfolioItems} content={content.portfolio} />
        <Process content={content.process} />
        <Contact content={content.contact} />
      </main>
      <Footer siteName={content.general.siteName} content={content.footer} />
    </>
  );
}
