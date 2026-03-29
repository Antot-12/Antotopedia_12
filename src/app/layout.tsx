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
        <html lang={locale}>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        </head>
        <body className="no-glow min-h-screen grid grid-rows-[auto_1fr_auto]">
        <DevSWKiller />
        <NavbarWrapper />
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">{children}</main>
        <Footer />
        </body>
        </html>
    );
}
