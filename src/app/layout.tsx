import type { Metadata } from "next";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import DevSWKiller from "@/components/DevSWKiller";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
    title: "AntotoPedia_12",
    description: "Neon-styled publishing",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    return (
        <html lang={locale} data-scroll-behavior="smooth">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        </head>
        <body className="no-glow">
        <DevSWKiller />
        <NavbarWrapper />
        <main className="flex-1 w-full mx-auto py-4 sm:py-6 lg:py-8">{children}</main>
        <Footer />
        </body>
        </html>
    );
}
