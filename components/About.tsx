import Image from "next/image";
import { values } from "@/data/index";
import Confetti from "./Confetti";

export default function About() {
  return (
    <section
      id="about"
      className="relative py-20 bg-[var(--cake-lavender)]/30 overflow-hidden my-10"
      aria-labelledby="about-header"
    >
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-none z-10"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-16 md:h-28"
        >
          <path
            d="M0 80C156.5 18.5 458-15 720 40C982 95 1276.5 50.5 1440 0V80H0Z"
            fill="#fbb1bd"
            fillOpacity="0.18"
          />
        </svg>
      </div>
      {/* Confetti */}
      <Confetti />
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row gap-10 items-center relative z-20">
        {/* Image */}
        <div className="flex-shrink-0">
          <div className="w-48 h-48 relative rounded-3xl overflow-hidden shadow-lg border-4 border-[var(--cake-pink)] bg-white mx-auto mb-6 md:mb-0">
            <Image
              src="https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=1282&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Delicious cake with fruit"
              fill
              className="object-cover"
              sizes="192px"
              priority
            />
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h2
            id="about-header"
            className="text-3xl md:text-4xl font-bold text-[var(--cake-brown)] mb-4 tracking-tight"
          >
            About Cake Haven
          </h2>
          <p className="text-[var(--cake-brown)] text-lg mb-4 text-center md:text-left max-w-xl">
            Cake Haven was born from a simple love of baking—and a passion for
            making people smile! Every cake is made fresh from scratch, using
            only the best local ingredients and a big dash of creativity.
          </p>
          <p className="text-[var(--cake-brown)] opacity-80 text-base text-center md:text-left max-w-xl">
            Whether you’re celebrating a birthday, milestone, or just want to
            treat yourself, our cakes are crafted to turn any moment into
            something memorable. Order online, pick up in-store, or get it
            delivered to your door. We can’t wait to make your day a little
            sweeter!
          </p>

          {/* Values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8 w-full max-w-xl">
            {values.map((value, i) => (
              <div
                key={i}
                className="flex gap-4 items-start rounded-xl bg-white/80 p-4 shadow hover:shadow-lg transition"
              >
                <span>{value.icon}</span>
                <div>
                  <div className="font-semibold text-[var(--cake-brown)] mb-1">
                    {value.title}
                  </div>
                  <div className="text-[var(--cake-brown)] text-sm opacity-80">
                    {value.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom divider */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none z-10"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-14"
        >
          <path
            d="M0 0C157.5 51.5 453.5 86 720 40C986.5 -6 1277.5 32.5 1440 70V0H0Z"
            fill="#b9f6ca"
            fillOpacity="0.13"
          />
        </svg>
      </div>
    </section>
  );
}
