import NavBar from "@/components/NavBar";
import "./globals.css";
import { Quicksand, Pacifico } from "next/font/google";
import ClientLayout from "./client-layout";
import Footer from "@/components/Footer";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["400", "700"] });
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

// app/layout.tsx
export const metadata = {
  title: "Cake Haven – Modern Bakery & Cakes",
  description:
    "Order custom cakes, cupcakes, and treats online. Fast local delivery and the best bakery experience in town. Built with AI and Next.js!",
  // Optional: Open Graph / Twitter for rich social previews
  openGraph: {
    title: "Cake Haven – Modern Bakery & Cakes",
    description:
      "Order custom cakes, cupcakes, and treats online. Fast local delivery and the best bakery experience in town.",
    url: "https://yourdomain.com",
    siteName: "Cake Haven",
    images: [
      {
        url: "https://yourdomain.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Delicious cakes from Cake Haven",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cake Haven – Modern Bakery & Cakes",
    description:
      "Order custom cakes, cupcakes, and treats online. Fast local delivery and the best bakery experience in town.",
    images: ["https://yourdomain.com/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} ${pacifico.variable}`}>
        <ClientLayout>
          <NavBar />
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
