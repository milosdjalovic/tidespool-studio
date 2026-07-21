type AdminFieldProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

export function AdminField({ label, hint, children }: AdminFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {hint ? <span className="mb-2 block text-xs text-muted">{hint}</span> : null}
      {children}
    </label>
  );
}

export function AdminInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      className="input-minimal"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  );
}

export function AdminTextarea({
  value,
  onChange,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      className="textarea-minimal"
      style={{ minHeight: `${rows * 1.5}rem` }}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function AdminSection({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="rounded-xl border border-line bg-surface"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none px-5 py-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-muted">Edit</span>
        </div>
      </summary>
      <div className="space-y-5 border-t border-line px-5 py-5 md:px-6">{children}</div>
    </details>
  );
}

export function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <AdminField label={label} hint={hint}>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-14 cursor-pointer rounded-lg border border-line bg-surface p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-minimal max-w-[8rem] font-mono text-sm uppercase"
        />
      </div>
    </AdminField>
  );
}
