/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// app/contact/page.tsx
"use client";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <main className="max-w-5xl mx-auto py-12 px-4 grid gap-10">
      {/* Header */}
      <section className="flex flex-col gap-2 items-center text-center mb-4">
        <h1 className="text-4xl font-bold text-[var(--cake-brown)] drop-shadow mb-2">
          Contact Cake Haven
        </h1>
        <p className="text-lg text-[var(--cake-brown)]/80 max-w-2xl">
          We'd love to hear from you—use the form, call, email, or drop by our
          bakery!
        </p>
      </section>

      {/* Info + Map + Form grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[90vw] grid-">
        {/* Contact Info & Social */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--cake-brown)] mb-1">
              Get In Touch
            </h2>
            <div className="flex items-center gap-2 text-[var(--cake-brown)]/80">
              <Mail className="w-5 h-5" />
              <a
                href="mailto:hello@cakehaven.com"
                className="underline hover:text-[var(--cake-pink)]"
              >
                hello@cakehaven.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-[var(--cake-brown)]/80">
              <Phone className="w-5 h-5" />
              <a
                href="tel:+1234567890"
                className="underline hover:text-[var(--cake-pink)]"
              >
                (123) 456-7890
              </a>
            </div>
            <div className="flex items-center gap-2 text-[var(--cake-brown)]/80">
              <MapPin className="w-5 h-5" />
              <span>123 Cake Lane, Sweetville, CA 90001</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              className="hover:text-[var(--cake-pink)]"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              className="hover:text-[var(--cake-pink)]"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener"
              aria-label="Twitter"
              className="hover:text-[var(--cake-pink)]"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>

          {/* Business Hours */}
          <div className="mt-8">
            <h3 className="flex items-center gap-2 text-[var(--cake-brown)] text-lg font-semibold mb-2">
              <Clock className="w-5 h-5" /> Business Hours
            </h3>
            <ul className="text-[var(--cake-brown)]/80 text-sm">
              <li>Mon–Fri: 9:00am – 7:00pm</li>
              <li>Saturday: 10:00am – 6:00pm</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
          {/* FAQ Link */}
          <div className="mt-8">
            {/* <Link href="/faq">
              <Button
                variant="outline"
                className="w-full rounded-xl bg-[var(--cake-yellow)]/30 hover:bg-[var(--cake-mint)]/20 text-[var(--cake-brown)] font-semibold"
              >
                View FAQs
              </Button>
            </Link> */}
          </div>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-[var(--cake-yellow)] bg-[var(--cake-yellow)]/20 min-h-[260px] md:col-span-2">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.922209858219!2d-118.2436842847821!3d34.05223408060915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c7c4e9c82b7f%3A0x4c9d5e8c2bb5e492!2s123%20Cake%20Lane%2C%20Sweetville%2C%20CA%2090001!5e0!3m2!1sen!2sus!4v1624567890123!5m2!1sen!2sus"
            width="100%"
            height="260"
            loading="lazy"
            style={{ border: 0 }}
            allowFullScreen={true}
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[260px] md:h-full"
          />
        </div>
      </section>

      {/* Contact Form (separate section, max width) */}
      <section className="max-w-xl mx-auto bg-white/80 rounded-2xl shadow-lg p-8 mt-8 border border-[var(--cake-mint)]/30">
        <h2 className="text-2xl font-bold text-[var(--cake-brown)] mb-4">
          Send Us a Message
        </h2>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            // Show a toast, snackbar, or message (not implemented here)
          }}
          aria-label="Contact form"
        >
          <div>
            <label
              className="block mb-1 font-semibold text-[var(--cake-brown)]"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)] bg-white"
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
          <div>
            <label
              className="block mb-1 font-semibold text-[var(--cake-brown)]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)] bg-white"
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label
              className="block mb-1 font-semibold text-[var(--cake-brown)]"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)] bg-white"
              placeholder="How can we help you?"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[var(--cake-pink)] text-[var(--cake-brown)] font-bold py-3 rounded-xl shadow-lg hover:bg-[var(--cake-mint)] transition"
            disabled
            aria-disabled="true"
            tabIndex={-1}
          >
            Send (Disabled)
          </Button>
        </form>
        <div className="mt-4 text-xs text-[var(--cake-brown)]/70 text-center">
          *This form is not connected yet. Email or call us for urgent
          inquiries!
        </div>
      </section>
    </main>
  );
}
