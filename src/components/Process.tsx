import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import type { SiteContent } from "@/lib/types";

type ProcessProps = {
  content: SiteContent["process"];
};

export function Process({ content }: ProcessProps) {
  return (
    <section id="process" className="section-warm section-block">
      <div className="section-pad">
        <Reveal>
          <SectionHeader
            label={content.label}
            title={content.title}
            description={content.description}
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {content.steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.06}>
              <article className="h-full rounded-xl border border-line bg-surface p-6">
                <p className="text-sm font-semibold text-accent-warm">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="body-text mt-3">{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
