import NavBar from "@/components/NavBar";
import "./globals.css";
import { Quicksand, Pacifico } from "next/font/google";
import ClientLayout from "./client-layout";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["400", "700"] });
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

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
        </ClientLayout>
      </body>
    </html>
  );
}
