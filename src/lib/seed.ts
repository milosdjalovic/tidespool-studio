import portfolioSeed from "../../data/portfolio.json";
import type { PortfolioItem, SiteData } from "./types";

export function getSeedPortfolio(): PortfolioItem[] {
  return portfolioSeed as PortfolioItem[];
}

export function getEmptySiteData(): SiteData {
  return {
    portfolio: getSeedPortfolio(),
    messages: [],
  };
}
