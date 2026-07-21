"use client";

import {
  AdminField,
  AdminInput,
  AdminSection,
  AdminTextarea,
  ColorField,
} from "@/components/admin/AdminFields";
import { defaultTheme } from "@/lib/default-content";
import type { SiteContent, SiteTheme } from "@/lib/types";

type AdminContentEditorProps = {
  content: SiteContent;
  onChange: (content: SiteContent) => void;
};

export function AdminContentEditor({ content, onChange }: AdminContentEditorProps) {
  function updateSection<K extends keyof SiteContent>(section: K, value: SiteContent[K]) {
    onChange({ ...content, [section]: value });
  }

  return (
    <div className="space-y-4">
      <AdminSection title="General" description="Site name in header and footer." defaultOpen>
        <AdminField label="Site name">
          <AdminInput
            value={content.general.siteName}
            onChange={(value) =>
              updateSection("general", { ...content.general, siteName: value })
            }
          />
        </AdminField>
      </AdminSection>

      <AdminSection title="Hero" description="Top banner visitors see first.">
        <div className="grid gap-5 md:grid-cols-2">
          <AdminField label="Small label">
            <AdminInput
              value={content.hero.eyebrow}
              onChange={(value) => updateSection("hero", { ...content.hero, eyebrow: value })}
            />
          </AdminField>
          <AdminField label="Background image URL" hint="Direct link to a photo.">
            <AdminInput
              value={content.hero.backgroundImage}
              onChange={(value) =>
                updateSection("hero", { ...content.hero, backgroundImage: value })
              }
            />
          </AdminField>
        </div>
        <AdminField label="Main headline">
          <AdminInput
            value={content.hero.title}
            onChange={(value) => updateSection("hero", { ...content.hero, title: value })}
          />
        </AdminField>
        <AdminField label="Description">
          <AdminTextarea
            value={content.hero.description}
            onChange={(value) => updateSection("hero", { ...content.hero, description: value })}
          />
        </AdminField>
        <div className="grid gap-5 md:grid-cols-2">
          <AdminField label="Primary button">
            <AdminInput
              value={content.hero.primaryButton}
              onChange={(value) =>
                updateSection("hero", { ...content.hero, primaryButton: value })
              }
            />
          </AdminField>
          <AdminField label="Secondary button">
            <AdminInput
              value={content.hero.secondaryButton}
              onChange={(value) =>
                updateSection("hero", { ...content.hero, secondaryButton: value })
              }
            />
          </AdminField>
        </div>
      </AdminSection>

      <AdminSection title="About" description="Your story and photo.">
        <div className="grid gap-5 md:grid-cols-2">
          <AdminField label="Section label">
            <AdminInput
              value={content.about.label}
              onChange={(value) => updateSection("about", { ...content.about, label: value })}
            />
          </AdminField>
          <AdminField label="Photo URL" hint="/images/about-camera.jpg or online link.">
            <AdminInput
              value={content.about.imageUrl}
              onChange={(value) => updateSection("about", { ...content.about, imageUrl: value })}
            />
          </AdminField>
        </div>
        <AdminField label="Title">
          <AdminInput
            value={content.about.title}
            onChange={(value) => updateSection("about", { ...content.about, title: value })}
          />
        </AdminField>
        <AdminField label="Description">
          <AdminTextarea
            value={content.about.description}
            onChange={(value) => updateSection("about", { ...content.about, description: value })}
            rows={5}
          />
        </AdminField>
        <div className="grid gap-4 md:grid-cols-2">
          {content.about.highlights.map((item, index) => (
            <div key={index} className="rounded-lg border border-line p-4">
              <AdminField label={`Highlight ${index + 1}`}>
                <AdminInput
                  value={item.label}
                  onChange={(value) => {
                    const highlights = [...content.about.highlights];
                    highlights[index] = { ...highlights[index], label: value };
                    updateSection("about", { ...content.about, highlights });
                  }}
                />
              </AdminField>
              <AdminField label="Text">
                <AdminInput
                  value={item.value}
                  onChange={(value) => {
                    const highlights = [...content.about.highlights];
                    highlights[index] = { ...highlights[index], value: value };
                    updateSection("about", { ...content.about, highlights });
                  }}
                />
              </AdminField>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Services" description="Three offerings on the site.">
        <AdminField label="Title">
          <AdminInput
            value={content.services.title}
            onChange={(value) => updateSection("services", { ...content.services, title: value })}
          />
        </AdminField>
        <AdminField label="Intro text">
          <AdminTextarea
            value={content.services.description}
            onChange={(value) =>
              updateSection("services", { ...content.services, description: value })
            }
          />
        </AdminField>
        {content.services.items.map((item, index) => (
          <div key={index} className="rounded-lg border border-line p-4">
            <p className="mb-3 text-sm font-medium">Service {index + 1}</p>
            <AdminField label="Title">
              <AdminInput
                value={item.title}
                onChange={(value) => {
                  const items = [...content.services.items];
                  items[index] = { ...items[index], title: value };
                  updateSection("services", { ...content.services, items });
                }}
              />
            </AdminField>
            <AdminField label="Description">
              <AdminTextarea
                value={item.description}
                onChange={(value) => {
                  const items = [...content.services.items];
                  items[index] = { ...items[index], description: value };
                  updateSection("services", { ...content.services, items });
                }}
              />
            </AdminField>
          </div>
        ))}
      </AdminSection>

      <AdminSection title="Portfolio headings" description="Text above the work gallery.">
        <AdminField label="Title">
          <AdminInput
            value={content.portfolio.title}
            onChange={(value) => updateSection("portfolio", { ...content.portfolio, title: value })}
          />
        </AdminField>
        <AdminField label="Description">
          <AdminTextarea
            value={content.portfolio.description}
            onChange={(value) =>
              updateSection("portfolio", { ...content.portfolio, description: value })
            }
          />
        </AdminField>
      </AdminSection>

      <AdminSection title="Process" description="Your workflow steps.">
        <AdminField label="Title">
          <AdminInput
            value={content.process.title}
            onChange={(value) => updateSection("process", { ...content.process, title: value })}
          />
        </AdminField>
        {content.process.steps.map((step, index) => (
          <div key={index} className="rounded-lg border border-line p-4">
            <p className="mb-3 text-sm font-medium">Step {index + 1}</p>
            <AdminField label="Title">
              <AdminInput
                value={step.title}
                onChange={(value) => {
                  const steps = [...content.process.steps];
                  steps[index] = { ...steps[index], title: value };
                  updateSection("process", { ...content.process, steps });
                }}
              />
            </AdminField>
            <AdminField label="Description">
              <AdminTextarea
                value={step.description}
                onChange={(value) => {
                  const steps = [...content.process.steps];
                  steps[index] = { ...steps[index], description: value };
                  updateSection("process", { ...content.process, steps });
                }}
              />
            </AdminField>
          </div>
        ))}
      </AdminSection>

      <AdminSection title="Contact" description="Contact info shown on the site.">
        <AdminField label="Title">
          <AdminInput
            value={content.contact.title}
            onChange={(value) => updateSection("contact", { ...content.contact, title: value })}
          />
        </AdminField>
        <div className="grid gap-5 md:grid-cols-3">
          <AdminField label="Email">
            <AdminInput
              value={content.contact.email}
              onChange={(value) => updateSection("contact", { ...content.contact, email: value })}
            />
          </AdminField>
          <AdminField label="Phone">
            <AdminInput
              value={content.contact.phone}
              onChange={(value) => updateSection("contact", { ...content.contact, phone: value })}
            />
          </AdminField>
          <AdminField label="Location">
            <AdminInput
              value={content.contact.location}
              onChange={(value) =>
                updateSection("contact", { ...content.contact, location: value })
              }
            />
          </AdminField>
        </div>
      </AdminSection>

      <AdminSection title="Footer" description="Bottom of every page.">
        <AdminField label="Description">
          <AdminTextarea
            value={content.footer.description}
            onChange={(value) => updateSection("footer", { ...content.footer, description: value })}
          />
        </AdminField>
      </AdminSection>
    </div>
  );
}

type AdminThemeEditorProps = {
  theme: SiteTheme;
  onChange: (theme: SiteTheme) => void;
};

export function AdminThemeEditor({ theme, onChange }: AdminThemeEditorProps) {
  function update(key: keyof SiteTheme, value: string) {
    onChange({ ...theme, [key]: value });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-line bg-surface-warm p-5 text-sm text-muted">
        <p className="font-medium text-foreground">How this works</p>
        <p className="mt-2">
          Pick colors below to change the site look. Light colors work best for page backgrounds;
          dark colors for the hero and footer.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ColorField label="Page background" value={theme.background} onChange={(v) => update("background", v)} />
        <ColorField label="White sections" value={theme.surface} onChange={(v) => update("surface", v)} />
        <ColorField label="Warm sections" value={theme.surfaceWarm} onChange={(v) => update("surfaceWarm", v)} />
        <ColorField label="Dark sections" value={theme.backgroundDark} onChange={(v) => update("backgroundDark", v)} />
        <ColorField label="Main text" value={theme.foreground} onChange={(v) => update("foreground", v)} />
        <ColorField label="Light text" value={theme.foregroundLight} onChange={(v) => update("foregroundLight", v)} />
        <ColorField label="Muted text" value={theme.muted} onChange={(v) => update("muted", v)} />
        <ColorField label="Accent" value={theme.accentWarm} onChange={(v) => update("accentWarm", v)} />
      </div>

      <button type="button" className="btn-secondary" onClick={() => onChange(structuredClone(defaultTheme))}>
        Reset to default colors
      </button>
    </div>
  );
}
