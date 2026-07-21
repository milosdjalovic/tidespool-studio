import Link from "next/link";

export function Footer() {
  return (
    <footer className="section-dark border-t border-line-dark">
      <div className="section-pad flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between md:py-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-light">
            TideSpool Studios
          </p>
          <p className="mt-3 max-w-sm text-sm text-foreground-light/65">
            Cinematic video and photography for brands, events, and creators.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-foreground-light/65">
          <a href="#about" className="transition hover:text-foreground-light">
            About
          </a>
          <a href="#services" className="transition hover:text-foreground-light">
            Services
          </a>
          <a href="#work" className="transition hover:text-foreground-light">
            Work
          </a>
          <a href="#contact" className="transition hover:text-foreground-light">
            Contact
          </a>
          <Link href="/admin/login" className="transition hover:text-foreground-light">
            Admin
          </Link>
        </div>
      </div>
      <div className="section-pad border-t border-line-dark py-5 text-xs text-foreground-light/45">
        © {new Date().getFullYear()} TideSpool Studios. All rights reserved.
      </div>
    </footer>
  );
}
