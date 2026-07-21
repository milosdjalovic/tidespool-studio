"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
};

export function CustomSelect({
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {name ? <input type="hidden" name={name} value={value} required={required} /> : null}

      <button
        type="button"
        className="select-trigger flex w-full cursor-pointer items-center justify-between text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selected ? "text-foreground" : "text-dim"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            id={listboxId}
            role="listbox"
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-lg"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    className={`w-full px-4 py-2.5 text-left text-sm transition ${
                      isSelected
                        ? "bg-surface-warm font-medium text-foreground"
                        : "text-muted hover:bg-surface-warm hover:text-foreground"
                    }`}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
