import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const SIDEBAR_LINKS = [
  { href: "/", label: "Limit Orders" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/tplist", label: "TP List" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <div className="flex min-h-screen">
          {/* Desktop sidebar */}
          <aside className="hidden md:flex md:flex-col md:w-56 md:bg-zinc-900 md:text-zinc-100 md:py-6 md:px-4 md:gap-3 border-r border-zinc-800">
            <div className="font-semibold text-xl px-3 mb-6">Stock Tracker</div>
            <nav className="flex flex-col gap-2">
              {SIDEBAR_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded px-3 py-2 hover:bg-zinc-800 transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          {/* Mobile sidebar nav */}
          <div className="md:hidden fixed top-0 left-0 z-30">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 m-4 rounded bg-zinc-900 text-zinc-100 shadow-md"><Menu className="h-5 w-5" /></button>
              </SheetTrigger>
              <SheetContent side="left" className="w-48 bg-zinc-900 text-zinc-100 p-0">
                <span className="sr-only" id="mobile-nav-title">Sidebar Navigation</span>
                <div className="font-semibold text-lg px-4 py-3">Stock Tracker</div>
                <nav className="flex flex-col gap-1 px-2" aria-labelledby="mobile-nav-title">
                  {SIDEBAR_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded px-3 py-2 hover:bg-zinc-800 transition"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          {/* Content */}
          <main className="flex-1 bg-zinc-950 text-zinc-100 min-h-screen md:pl-0 pl-0 pt-14 md:pt-0 px-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
