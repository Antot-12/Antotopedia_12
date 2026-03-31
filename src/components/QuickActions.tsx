"use client";

import Link from "next/link";

function NeonIconWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-14 w-14 grid place-items-center rounded-xl border border-white/15 hover:border-accent hover:text-accent transition shadow-[0_0_0_0_rgba(46,231,216,0)] hover:shadow-[0_0_24px_0_rgba(46,231,216,.35)]">
            {children}
        </div>
    );
}

function IconGithub() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.41-1.34-1.79-1.34-1.79-1.09-.75.08-.73.08-.73 1.2.08 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 .5z" />
        </svg>
    );
}

function IconYoutube() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.5 6.2a3.06 3.06 0 0 0-2.15-2.17C19.47 3.5 12 3.5 12 3.5s-7.47 0-9.35.53A3.06 3.06 0 0 0 .5 6.2 32.34 32.34 0 0 0 0 12a32.34 32.34 0 0 0 .5 5.8 3.06 3.06 0 0 0 2.15 2.17C4.53 20.5 12 20.5 12 20.5s7.47 0 9.35-.53a3.06 3.06 0 0 0 2.15-2.17A32.34 32.34 0 0 0 24 12a32.34 32.34 0 0 0-.5-5.8zM9.75 15.5v-7l6 3.5-6 3.5z" />
        </svg>
    );
}

function IconLinkedIn() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5.001 2.5 2.5 0 0 0 0-5zM3.5 9h3v12h-3zM14.5 9c-2.07 0-3 1.13-3 1.13V9h-3v12h3v-6.5c0-1.73.86-2.5 2.25-2.5s1.75.9 1.75 2.5V21h3v-6.98C19.5 10.95 17.77 9 14.5 9z" />
        </svg>
    );
}

export default function QuickActions({
                                         github = "https://github.com/Antot-12",
                                         youtube = "https://www.youtube.com/c/BOMBAProductionA",
                                         linkedin = "https://www.linkedin.com/in/anton-shyrko/",
                                         heading,
                                     }: {
    github?: string;
    youtube?: string;
    linkedin?: string;
    heading?: string;
}) {
    return (
        <div className="card p-4">
            <h3 className="text-sm font-semibold mb-3 text-center">{heading || "Quick actions"}</h3>
            <div className="flex items-center justify-center gap-4">
                <Link href={youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                    <NeonIconWrapper><IconYoutube /></NeonIconWrapper>
                </Link>
                <Link href={github} target="_blank" rel="noreferrer" aria-label="GitHub">
                    <NeonIconWrapper><IconGithub /></NeonIconWrapper>
                </Link>
                <Link href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <NeonIconWrapper><IconLinkedIn /></NeonIconWrapper>
                </Link>
            </div>
        </div>
    );
}
