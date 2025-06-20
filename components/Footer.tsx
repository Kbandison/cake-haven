"use client";
import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--cake-brown)] text-white pt-10 pb-6 px-4 mt-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
        {/* Logo & Tagline */}
        <div>
          <Link
            href="/"
            className="font-pacifico text-2xl font-bold tracking-tight mb-2 inline-block"
          >
            Cake Haven
          </Link>
          <div className="mt-1 text-[var(--cake-mint)] font-medium text-base opacity-80">
            Sweet moments, delivered.
          </div>
        </div>
        {/* Navigation */}
        <nav aria-label="Footer links" className="mt-6 sm:mt-0">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="hover:underline hover:text-[var(--cake-yellow)] transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:underline hover:text-[var(--cake-yellow)] transition"
              >
                Shop Cakes
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:underline hover:text-[var(--cake-yellow)] transition"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:underline hover:text-[var(--cake-yellow)] transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        {/* Contact / Social */}
        <div className="flex flex-col gap-3 mt-6 sm:mt-0">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" aria-hidden="true" />
            <a href="mailto:hello@cakehaven.com" className="hover:underline">
              hello@cakehaven.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" aria-hidden="true" />
            <a href="tel:+11234567890" className="hover:underline">
              (123) 456-7890
            </a>
          </div>
          <div className="flex gap-4 mt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-[var(--cake-yellow)]"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-[var(--cake-yellow)]"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 mt-8 pt-6 text-center text-sm text-white/70">
        &copy; {new Date().getFullYear()} Cake Haven. All rights reserved.
      </div>
    </footer>
  );
}
