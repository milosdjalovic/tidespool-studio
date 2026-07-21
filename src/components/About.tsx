import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

export function About() {
  return (
    <section id="about" className="section-light section-block">
      <div className="section-pad">
        <Reveal>
          <SectionHeader
            label="About Us"
            title="A studio built on storytelling"
            description="TideSpool Studios is more than just a video and photography business; we are a team of passionate creatives dedicated to bringing your vision to life. With a focus on storytelling, we work closely with clients to create impactful visual content that resonates with their audience."
          />
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal delay={0.1}>
            <div className="media-frame aspect-[4/5]">
              <Image
                src="/images/about-camera.jpg"
                alt="Creative behind the camera capturing a moment"
                width={800}
                height={1000}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid gap-8 sm:grid-cols-2">
              {[
                { label: "Approach", value: "Collaborative, client-first direction" },
                { label: "Craft", value: "Cinematic quality in every deliverable" },
                { label: "Services", value: "Film, photography, and event coverage" },
                { label: "Availability", value: "Local projects and destination shoots" },
              ].map((item) => (
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
