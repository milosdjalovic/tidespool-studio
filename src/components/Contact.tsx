"use client";

import { LoaderCircle, Mail, MapPin, Phone } from "lucide-react";
import { FormEvent, useState } from "react";
import { CustomSelect } from "@/components/CustomSelect";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import type { SiteContent } from "@/lib/types";

const serviceOptions = [
  { value: "Promotional videos", label: "Promotional videos" },
  { value: "Event coverage", label: "Event coverage" },
  { value: "Custom photography", label: "Custom photography" },
  { value: "Not sure yet", label: "Not sure yet" },
];

type ContactProps = {
  content: SiteContent["contact"];
};

export function Contact({ content }: ContactProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [service, setService] = useState("");
  const phoneDigits = content.phone.replace(/\D/g, "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      service: String(formData.get("service") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unable to send your message.");
      }

      setStatus("success");
      setService("");
      event.currentTarget.reset();
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" className="section-light section-block border-t border-line">
      <div className="section-pad grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <SectionHeader
              label={content.label}
              title={content.title}
              description={content.description}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4 text-muted">
                <span className="rounded-lg bg-surface-warm p-3 text-accent-warm">
                  <Mail size={18} />
                </span>
                <a href={`mailto:${content.email}`} className="link-underline">
                  {content.email}
                </a>
              </div>
              <div className="flex items-center gap-4 text-muted">
                <span className="rounded-lg bg-surface-warm p-3 text-accent-warm">
                  <Phone size={18} />
                </span>
                <a href={`tel:+1${phoneDigits}`} className="link-underline">
                  {content.phone}
                </a>
              </div>
              <div className="flex items-center gap-4 text-muted">
                <span className="rounded-lg bg-surface-warm p-3 text-accent-warm">
                  <MapPin size={18} />
                </span>
                <span>{content.location}</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-line bg-surface p-6 shadow-sm md:p-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Name</span>
                <input className="input-minimal" name="name" required placeholder="Your name" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Email</span>
                <input
                  className="input-minimal"
                  type="email"
                  name="email"
                  required
                  placeholder="you@email.com"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Phone</span>
                <input className="input-minimal" name="phone" placeholder="Optional" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Service</span>
                <CustomSelect
                  name="service"
                  value={service}
                  onChange={setService}
                  options={serviceOptions}
                  placeholder="Select a service"
                />
              </label>
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-medium text-foreground">Project details</span>
              <textarea
                className="textarea-minimal"
                name="message"
                required
                placeholder="Tell us about your project, timeline, and goals."
              />
            </label>

            <button type="submit" className="btn-primary mt-8 w-full disabled:opacity-50" disabled={status === "loading"}>
              {status === "loading" ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="animate-spin" size={16} />
                  Sending...
                </span>
              ) : (
                "Send message"
              )}
            </button>

            {status === "success" ? (
              <p className="mt-4 text-sm text-accent-warm">
                Thank you. Your message has been received and we&apos;ll be in touch soon.
              </p>
            ) : null}
            {status === "error" ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
