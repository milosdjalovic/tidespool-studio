import type { SiteTheme } from "@/lib/types";

type SiteThemeStylesProps = {
  theme: SiteTheme;
};

export function SiteThemeStyles({ theme }: SiteThemeStylesProps) {
  const css = `
    :root {
      --background: ${theme.background};
      --surface: ${theme.surface};
      --surface-warm: ${theme.surfaceWarm};
      --background-dark: ${theme.backgroundDark};
      --foreground: ${theme.foreground};
      --foreground-light: ${theme.foregroundLight};
      --muted: ${theme.muted};
      --accent-warm: ${theme.accentWarm};
      --line: color-mix(in srgb, ${theme.foreground} 12%, transparent);
      --line-strong: color-mix(in srgb, ${theme.foreground} 28%, transparent);
      --line-dark: color-mix(in srgb, ${theme.foregroundLight} 16%, transparent);
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
