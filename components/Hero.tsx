"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const TAGLINES = [
  "Heavenly Cakes, Homemade Happiness",
  "Sweeten Every Moment",
  "Baked Fresh Daily",
  "Custom Cakes for Any Occasion",
];

export default function Hero() {
  const [taglineIdx, setTaglineIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setTaglineIdx((idx) => (idx + 1) % TAGLINES.length),
      3500
    );
    return () => clearInterval(interval);
  }, []);

  const featuredCake = "Lemon Drizzle Cake"; // Replace later with a random DB pick

  return (
    <section
      className="relative w-full min-h-[60vh] md:min-h-[75vh] flex flex-col md:flex-row items-center justify-between bg-[var(--cake-yellow)] overflow-hidden"
      id="home"
    >
      {/* Mobile: Background Image with glassmorphism */}
      <div className="absolute inset-0 z-0 md:hidden">
        <Image
          src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1350&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Chocolate cake with berries"
          fill
          className="object-cover object-center w-full h-full brightness-75 blur-[2px]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[var(--cake-yellow)]/70 backdrop-blur-[1.5px]" />
      </div>
      {/* Desktop: Right Side Hero Image */}
      <div className="hidden md:flex flex-1 justify-center items-center relative min-w-[280px] w-full md:w-auto z-10">
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative w-[360px] h-[360px] md:w-[420px] md:h-[420px] rounded-3xl shadow-lg overflow-hidden border-4 border-[var(--cake-pink)] bg-white"
        >
          <Image
            src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1350&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Chocolate cake with berries"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 80vw, 420px"
          />
        </motion.div>
      </div>
      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex-1 flex flex-col items-center md:items-start justify-center px-6 md:pl-16 py-16 md:py-0 w-full md:w-auto"
      >
        <div className="backdrop-blur-[2px] bg-white/70 md:bg-transparent rounded-2xl p-4 md:p-0 shadow-lg md:shadow-none flex flex-col items-center md:items-start w-full max-w-lg">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles
              className="text-[var(--cake-pink)] w-8 h-8 animate-spin-slow"
              aria-hidden="true"
            />
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--cake-brown)] tracking-tight [font-family:var(--font-pacifico),cursive] drop-shadow-md">
              Cake Haven
            </h1>
          </div>
          <motion.p
            key={taglineIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-3xl text-[var(--cake-brown)] my-6 md:mb-6 font-medium min-h-[2.5rem] md:min-h-[3rem] drop-shadow"
            aria-live="polite"
          >
            {TAGLINES[taglineIdx]}
          </motion.p>
          <p className="text-base md:text-lg text-[var(--cake-brown)] opacity-80 mb-5 max-w-xl">
            Freshly baked daily—order online for pickup or delivery. Every cake
            is made with love and premium ingredients!
          </p>
          <div className="mb-6 w-full flex flex-col md:flex-row items-center gap-2">
            <span className="inline-flex items-center bg-[var(--cake-mint)] px-4 py-2 rounded-full text-[var(--cake-brown)] font-semibold shadow">
              🎂 Try our cake of the week -{" "}
              <span className="ml-1 font-bold">{featuredCake} </span>!
            </span>
          </div>
          <div className="relative flex items-center">
            <motion.span
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="absolute inset-0 z-0 rounded-xl bg-[var(--cake-pink)] blur-lg opacity-40 pointer-events-none"
              style={{ filter: "blur(16px)" }}
            />
            <Link
              href="#products"
              className="relative z-10 inline-block bg-[var(--cake-pink)] text-[var(--cake-brown)] font-semibold text-lg rounded-xl px-8 py-3 shadow hover:bg-[var(--cake-mint)] transition focus:outline-none focus:ring-2 focus:ring-[var(--cake-mint)]"
            >
              Shop Cakes
            </Link>
          </div>
          {/* <div className="mt-4 flex flex-col items-center md:items-start">
            <span className="inline-flex items-center gap-2 text-sm text-[var(--cake-brown)] font-medium bg-[var(--cake-yellow)]/80 px-4 py-2 rounded-xl shadow border border-[var(--cake-shadow)]">
              <span aria-hidden="true">⭐️⭐️⭐️⭐️⭐️</span>
              Rated 5 stars by happy customers!
            </span>
          </div> */}
          <div className="mt-5 flex flex-col md:flex-row items-center gap-2">
            <button
              className="bg-[var(--cake-lavender)] hover:bg-[var(--cake-mint)] text-[var(--cake-brown)] px-5 py-2 rounded-lg font-semibold shadow transition"
              aria-label="Chat with a baker"
            >
              💬 Chat with a baker
            </button>
          </div>
        </div>
      </motion.div>
      {/* Sprinkles/icons */}
      <Sparkles className="absolute left-10 top-14 w-7 h-7 text-[var(--cake-pink)] opacity-70 pointer-events-none animate-bounce" />
      <Sparkles className="absolute right-10 top-20 w-6 h-6 text-[var(--cake-mint)] opacity-60 pointer-events-none animate-bounce" />
      <Sparkles className="absolute left-36 bottom-12 w-8 h-8 text-[var(--cake-lavender)] opacity-50 pointer-events-none animate-bounce" />
      {/* SVG divider at bottom */}
      <div
        className="absolute bottom-0 left-0 w-full z-20 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-20 md:h-28"
        >
          <path
            d="M0 0C229.553 82.1342 543.736 110.74 772.844 82.1342C1001.95 53.5287 1265.48 26.7644 1440 82.1342V100H0V0Z"
            fill="#fbb1bd"
            fillOpacity="0.20"
          />
        </svg>
      </div>
    </section>
  );
}
