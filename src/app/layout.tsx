import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const sora = Sora({ 
  subsets: ["latin"], 
  variable: "--font-sora",
  weight: ["400", "600", "700", "800"]
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-jakarta" 
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"], 
  variable: "--font-geist-mono" 
});

export const metadata: Metadata = {
  title: "BINI Digital Flagship",
  description: "Official BINI Concept Experience | Developed by Eloisa Jane Talingting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${jakarta.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="antialiased font-jakarta">
        {/* Fixed Header */}
        <Header />
        
        {/* Main Content Area */}
        <div className="relative pt-20 min-h-screen">
          {children}
        </div>

        {/* Minimal Editorial Footer */}
        <footer className="py-12 px-8 border-t border-black/5">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-slate-400">
              BINI Concept Archive // 2026
            </p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-slate-400">
              Designed & Built by <span className="text-slate-900 font-bold">Eloisa Jane</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}