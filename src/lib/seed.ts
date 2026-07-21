import portfolioSeed from "../../data/portfolio.json";
import { defaultContent, defaultTheme, mergeContent, mergeTheme } from "./default-content";
import type { PortfolioItem, SiteContent, SiteData, SiteTheme } from "./types";

export function getSeedPortfolio(): PortfolioItem[] {
  return portfolioSeed as PortfolioItem[];
}

export function getEmptySiteData(): SiteData {
  return {
    portfolio: getSeedPortfolio(),
    messages: [],
    content: structuredClone(defaultContent),
    theme: structuredClone(defaultTheme),
  };
}

export function getDefaultContent(): SiteContent {
  return structuredClone(defaultContent);
}

export function getDefaultTheme(): SiteTheme {
  return structuredClone(defaultTheme);
}

export { mergeContent, mergeTheme };
