"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

export function Hero() {
  return (
    <section className="section-dark relative flex min-h-[92svh] items-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=2400&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-background-dark/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-background-dark/20" />

      <div className="section-pad relative z-10 w-full pb-16 pt-32 md:pb-24 md:pt-40">
        <motion.p
          className="eyebrow text-foreground-light/70"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          Video & Photography Studio
        </motion.p>

        <motion.h1
          className="mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground-light md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          Visual stories that move people
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground-light/80 md:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          TideSpool Studios partners with brands and creators to produce cinematic video and
          photography with clarity, emotion, and purpose.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
        >
          <a href="#work" className="btn-primary-light">
            View our work
          </a>
          <a href="#contact" className="btn-secondary-light">
            Request a quote
          </a>
        </motion.div>
      </div>
    </section>
  );
}
