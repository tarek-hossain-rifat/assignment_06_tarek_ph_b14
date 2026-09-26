import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ToastHost from "@/app/components/ToastHost";
import { FitlogProvider } from "@/app/context/FitlogContext";

export const metadata: Metadata = {
  title: "FitLog — Workout Library",
  description: "Train with intent. Log every set.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <FitlogProvider>
          <Navbar />
          <main className="min-h-screen px-4 pb-24 pt-[96px] sm:px-6">{children}</main>
          <Footer />
          <ToastHost />
        </FitlogProvider>
      </body>
    </html>
  );
}
