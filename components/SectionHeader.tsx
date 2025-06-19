"use client";

import { useEffect, useState } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  id?: string;
};

export default function SectionHeader({
  title,
  subtitle,
  id,
}: SectionHeaderProps) {
  // For mount animation
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      id={id}
      className="w-full text-center mb-10 flex flex-col items-center group"
    >
      <h2
        className={[
          "text-3xl md:text-4xl font-bold text-[var(--cake-brown)] mb-2 tracking-tight transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        ].join(" ")}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={[
            "text-[var(--cake-brown)] opacity-70 text-lg max-w-xl mx-auto transition-all duration-700 delay-100",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
        >
          {subtitle}
        </p>
      )}
      <div
        className="mt-2 w-24 h-2 rounded-full bg-[var(--cake-pink)] mx-auto shadow-md 
                   transition-all duration-500 group-hover:w-36 group-focus-within:w-36"
      />
    </div>
  );
}
