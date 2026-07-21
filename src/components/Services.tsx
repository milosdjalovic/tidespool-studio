"use client";

import { Camera, Clapperboard, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import type { SiteContent } from "@/lib/types";

const serviceIcons = [Clapperboard, Sparkles, Camera];

type ServicesProps = {
  content: SiteContent["services"];
};

export function Services({ content }: ServicesProps) {
  return (
    <section id="services" className="section-warm section-block">
      <div className="section-pad">
        <Reveal>
          <SectionHeader
            label={content.label}
            title={content.title}
            description={content.description}
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {content.items.map((service, index) => {
            const Icon = serviceIcons[index] ?? Clapperboard;

            return (
              <Reveal key={`${service.title}-${index}`} delay={index * 0.08}>
                <article className="h-full rounded-xl border border-line bg-surface p-8">
                  <div className="inline-flex rounded-lg bg-surface-warm p-3 text-accent-warm">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">{service.title}</h3>
                  <p className="body-text mt-4">{service.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
