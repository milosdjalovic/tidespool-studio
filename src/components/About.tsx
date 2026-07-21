import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import type { SiteContent } from "@/lib/types";

type AboutProps = {
  content: SiteContent["about"];
};

export function About({ content }: AboutProps) {
  const isExternalImage = content.imageUrl.startsWith("http");

  return (
    <section id="about" className="section-light section-block">
      <div className="section-pad">
        <Reveal>
          <SectionHeader
            label={content.label}
            title={content.title}
            description={content.description}
          />
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal delay={0.1}>
            <div className="media-frame aspect-[4/5]">
              {isExternalImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={content.imageUrl}
                  alt="About TideSpool Studios"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={content.imageUrl}
                  alt="Creative behind the camera capturing a moment"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover"
                  priority
                />
              )}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid gap-8 sm:grid-cols-2">
              {content.highlights.map((item) => (
                <div key={item.label} className="border-t border-line pt-5">
                  <p className="eyebrow">{item.label}</p>
                  <p className="mt-2 text-base font-medium leading-relaxed text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
