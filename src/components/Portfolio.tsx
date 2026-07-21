"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import type { PortfolioItem } from "@/lib/types";

const filters = [
  { id: "all", label: "All work" },
  { id: "promotional", label: "Promotional" },
  { id: "event", label: "Events" },
  { id: "photography", label: "Photography" },
] as const;

type FilterId = (typeof filters)[number]["id"];

function getEmbedUrl(url: string): string {
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  return url;
}

export function Portfolio({ items }: { items: PortfolioItem[] }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const filteredItems = useMemo(() => {
    if (filter === "all") {
      return items;
    }
    return items.filter((item) => item.category === filter);
  }, [filter, items]);

  return (
    <section id="work" className="section-light section-block">
      <div className="section-pad">
        <Reveal>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              label="Portfolio"
              title="Selected work"
              description="Browse recent video and photography projects. Click any piece to view it in full."
            />
            <div className="flex flex-wrap gap-2">
              {filters.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setFilter(entry.id)}
                  className={`filter-pill ${
                    filter === entry.id ? "filter-pill-active" : "filter-pill-inactive"
                  }`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {filteredItems.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <button
                type="button"
                onClick={() => setActiveItem(item)}
                className="group w-full text-left"
              >
                <div className="media-frame relative aspect-[16/10]">
                  <Image
                    src={item.thumbnailUrl || item.mediaUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-background-dark/0 transition duration-300 group-hover:bg-background-dark/20" />
                  {item.type === "video" ? (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-surface/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                      <Play size={12} fill="currentColor" />
                      Video
                    </span>
                  ) : (
                    <span className="absolute right-4 top-4 rounded-full bg-surface/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                      Photo
                    </span>
                  )}
                </div>
                <div className="mt-5">
                  <p className="eyebrow">{item.category}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-foreground transition group-hover:text-accent-warm">
                    {item.title}
                  </h3>
                  <p className="body-text mt-3">{item.description}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeItem ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/95 p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-lg bg-surface/10 px-4 py-2 text-sm text-foreground-light transition hover:bg-surface/20 md:right-8 md:top-8"
              onClick={() => setActiveItem(null)}
              aria-label="Close project"
            >
              Close
              <X size={16} />
            </button>

            <motion.div
              className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-y-auto rounded-xl bg-surface"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
            >
              {activeItem.type === "video" ? (
                <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-background-dark">
                  <iframe
                    src={getEmbedUrl(activeItem.mediaUrl)}
                    title={activeItem.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl">
                  <Image
                    src={activeItem.mediaUrl}
                    alt={activeItem.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              )}
              <div className="p-6 md:p-8">
                <p className="eyebrow">{activeItem.category}</p>
                <h3 className="mt-2 text-2xl font-semibold text-foreground md:text-3xl">
                  {activeItem.title}
                </h3>
                <p className="body-text mt-4">{activeItem.description}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
