import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

const steps = [
  {
    step: "01",
    title: "Discovery",
    description: "We learn your goals, audience, and creative direction to define the story we need to tell.",
  },
  {
    step: "02",
    title: "Pre-Production",
    description: "Shot lists, locations, styling, and timelines are mapped out for a smooth production day.",
  },
  {
    step: "03",
    title: "Production",
    description: "Our team captures video and photography with cinematic quality and attention to detail.",
  },
  {
    step: "04",
    title: "Delivery",
    description: "Final edits, color, and exports optimized for web, social, presentations, and campaigns.",
  },
];

export function Process() {
  return (
    <section id="process" className="section-warm section-block">
      <div className="section-pad">
        <Reveal>
          <SectionHeader
            label="Process"
            title="How we work together"
            description="A clear, collaborative path from first conversation to final delivery."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.step} delay={index * 0.06}>
              <article className="h-full rounded-xl border border-line bg-surface p-6">
                <p className="text-sm font-semibold text-accent-warm">{step.step}</p>
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
