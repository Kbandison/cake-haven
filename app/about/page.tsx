// app/about/page.tsx
"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // shadcn/ui
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      {/* Hero/Intro */}
      <section className="flex flex-col items-center text-center mb-12">
        <Image
          src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Decorated cake"
          width={180}
          height={180}
          className="rounded-full shadow-lg mb-6"
          priority
        />
        <h1 className="text-4xl font-bold text-[var(--cake-brown)] mb-2">
          About Cake Haven
        </h1>
        <p className="text-lg text-[var(--cake-brown)] opacity-80 max-w-xl">
          Cake Haven is your local, family-owned online bakery—serving joy by
          the slice! We handcraft every cake with love, premium ingredients, and
          an obsession for detail.
        </p>
      </section>

      {/* Brand/Story Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="font-semibold text-[var(--cake-pink)] text-xl mb-2">
            Our Story
          </h2>
          <p className="text-[var(--cake-brown)] opacity-90">
            Founded in 2024, Cake Haven started with a simple goal: to make
            special days even sweeter. From birthdays to weddings (or just a
            treat-yourself Tuesday), we believe every cake should be an
            experience.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-[var(--cake-pink)] text-xl mb-2">
            Our Promise
          </h2>
          <p className="text-[var(--cake-brown)] opacity-90">
            We focus on freshness, creativity, and a customer-first mindset. Got
            a wild cake idea? We love a challenge—just ask! Your satisfaction is
            our secret ingredient.
          </p>
        </div>
      </section>

      {/* Values Callout */}
      <section className="bg-[var(--cake-yellow)]/40 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 mb-10">
        <Image
          src="https://plus.unsplash.com/premium_photo-1670692695578-319f28b97ac1?q=80&w=986&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Cake decorating"
          width={120}
          height={120}
          className="rounded-2xl shadow"
        />
        <div>
          <h3 className="font-bold text-[var(--cake-brown)] mb-1">
            What Sets Us Apart
          </h3>
          <ul className="list-disc pl-6 text-[var(--cake-brown)] opacity-90">
            <li>Locally sourced, premium ingredients</li>
            <li>Small batch, never frozen</li>
            <li>Personalized cakes for every event</li>
            <li>Easy online ordering & fast delivery</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <div className="flex flex-col items-center mt-8">
        <Link href="/#products">
          <Button
            className="bg-[var(--cake-pink)] hover:bg-[var(--cake-mint)] text-[var(--cake-brown)] font-bold rounded-2xl px-6 py-3 shadow"
            size="lg"
          >
            Browse Our Cakes
          </Button>
        </Link>
      </div>
    </main>
  );
}
