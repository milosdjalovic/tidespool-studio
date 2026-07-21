"use client";

import { Camera, Clapperboard, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

const services = [
  {
    icon: Clapperboard,
    title: "Promotional Videos",
    description:
      "Brand films, product launches, and campaign content designed to capture attention and drive action.",
  },
  {
    icon: Sparkles,
    title: "Event Coverage",
    description:
      "From corporate gatherings to live experiences, we document the energy and key moments that matter.",
  },
  {
    icon: Camera,
    title: "Custom Photography",
    description:
      "Portrait, editorial, and commercial photography tailored to your brand voice and visual identity.",
  },
];

export function Services() {
  return (
    <section id="services" className="section-warm section-block">
      <div className="section-pad">
        <Reveal>
          <SectionHeader
            label="Services"
            title="What we create for clients"
            description="Three core offerings, each tailored to your goals, audience, and brand."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.08}>
              <article className="h-full rounded-xl border border-line bg-surface p-8">
                <div className="inline-flex rounded-lg bg-surface-warm p-3 text-accent-warm">
                  <service.icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">{service.title}</h3>
                <p className="body-text mt-4">{service.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
