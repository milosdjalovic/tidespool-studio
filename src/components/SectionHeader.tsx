type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
};

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="eyebrow">{label}</p>
      <h2 className={`section-title ${dark ? "text-foreground-light" : ""}`}>{title}</h2>
      {description ? (
        <p className={`section-lead ${align === "center" ? "mx-auto" : ""}`}>{description}</p>
      ) : null}
    </div>
  );
}
