"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Props = {
    url: string;
    title: string;
    github?: string;
    youtube?: string;
    linkedin?: string;
};

// Toast Notification Component
function Toast({ message, show, type = "success" }: { message: string; show: boolean; type?: "success" | "error" }) {
    if (!show) return null;

    const bgColor = type === "success" ? "bg-green-500/90" : "bg-red-500/90";

    return (
        <div
            className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-xl backdrop-blur-sm z-50 animate-in slide-in-from-top-2 fade-in duration-300`}
        >
            <div className="flex items-center gap-2">
                <span className="text-xl">{type === "success" ? "✓" : "✕"}</span>
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
}

// QR Code Modal Component
function QRCodeModal({ url, show, onClose }: { url: string; show: boolean; onClose: () => void }) {
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    useEffect(() => {
        if (show) {
            // Generate QR code using QR Server API
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
            setQrCodeUrl(qrUrl);
        }
    }, [show, url]);

    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in zoom-in-95 fade-in duration-200">
                <div className="card p-6 max-w-sm w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Scan QR Code</h3>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                            aria-label="Close"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className="bg-white p-4 rounded-lg mb-4">
                        {qrCodeUrl && (
                            <img
                                src={qrCodeUrl}
                                alt="QR Code"
                                className="w-full h-auto"
                            />
                        )}
                    </div>

                    <p className="text-sm text-dim text-center">
                        Scan this code with your phone camera to open the page
                    </p>
                </div>
            </div>
        </>
    );
}

function NeonIconWrapper({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="h-16 w-16 grid place-items-center rounded-xl border border-white/15 hover:border-accent hover:text-accent transition-all duration-300 shadow-[0_0_0_0_rgba(46,231,216,0)] hover:shadow-[0_0_28px_0_rgba(46,231,216,.35)] hover:scale-110 active:scale-95"
        >
            {children}
        </button>
    );
}

function IconGithub() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.41-1.34-1.79-1.34-1.79-1.09-.75.08-.73.08-.73 1.2.08 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 .5z" />
        </svg>
    );
}

function IconYoutube() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.5 6.2a3.06 3.06 0 0 0-2.15-2.17C19.47 3.5 12 3.5 12 3.5s-7.47 0-9.35.53A3.06 3.06 0 0 0 .5 6.2 32.34 32.34 0 0 0 0 12a32.34 32.34 0 0 0 .5 5.8 3.06 3.06 0 0 0 2.15 2.17C4.53 20.5 12 20.5 12 20.5s7.47 0 9.35-.53a3.06 3.06 0 0 0 2.15-2.17A32.34 32.34 0 0 0 24 12a32.34 32.34 0 0 0-.5-5.8zM9.75 15.5v-7l6 3.5-6 3.5z" />
        </svg>
    );
}

function IconLinkedIn() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5.001 2.5 2.5 0 0 0 0-5zM3.5 9h3v12h-3zM14.5 9c-2.07 0-3 1.13-3 1.13V9h-3v12h3v-6.5c0-1.73.86-2.5 2.25-2.5s1.75.9 1.75 2.5V21h3v-6.98C19.5 10.95 17.77 9 14.5 9z" />
        </svg>
    );
}

function IconQRCode() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <path d="M5 5h3v3H5z" fill="currentColor" />
            <path d="M16 5h3v3h-3z" fill="currentColor" />
            <path d="M5 16h3v3H5z" fill="currentColor" />
            <path d="M16 16h3v3h-3z" fill="currentColor" />
        </svg>
    );
}

function IconShare() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
    );
}

export default function ShareBar({
    url,
    title,
    github = "https://github.com/Antot-12",
    youtube = "https://www.youtube.com/c/BOMBAProductionA",
    linkedin = "https://www.linkedin.com/in/anton-shyrko/",
}: Props) {
    const [copied, setCopied] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [showQRModal, setShowQRModal] = useState(false);
    const [canShare, setCanShare] = useState(false);

    // Check if native share is available
    useEffect(() => {
        setCanShare(typeof navigator !== "undefined" && !!navigator.share);
    }, []);

    const showNotification = (message: string, type: "success" | "error" = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            showNotification("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            showNotification("Failed to copy link", "error");
        }
    };

    const handleNativeShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: title,
                    url: url,
                });
                showNotification("Shared successfully!");
            }
        } catch (error) {
            // User cancelled or share failed
            if (error instanceof Error && error.name !== 'AbortError') {
                showNotification("Share failed", "error");
            }
        }
    };

    const handleQRCode = () => {
        setShowQRModal(true);
    };

    return (
        <>
            <Toast message={toastMessage} show={showToast} type={toastType} />
            <QRCodeModal url={url} show={showQRModal} onClose={() => setShowQRModal(false)} />

            <div className="card p-4 grid gap-4">
                <h3 className="text-sm font-semibold">Share</h3>

                {/* Social Icons */}
                <div className="flex items-center justify-center gap-5">
                    <Link href={youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                        <NeonIconWrapper>
                            <IconYoutube />
                        </NeonIconWrapper>
                    </Link>
                    <Link href={github} target="_blank" rel="noreferrer" aria-label="GitHub">
                        <NeonIconWrapper>
                            <IconGithub />
                        </NeonIconWrapper>
                    </Link>
                    <Link href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                        <NeonIconWrapper>
                            <IconLinkedIn />
                        </NeonIconWrapper>
                    </Link>
                    <NeonIconWrapper onClick={handleQRCode}>
                        <IconQRCode />
                    </NeonIconWrapper>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                    {/* Native Share Button (Mobile) */}
                    {canShare && (
                        <button
                            className="btn btn-accent h-9 px-4 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                            onClick={handleNativeShare}
                        >
                            <IconShare />
                            <span>Share</span>
                        </button>
                    )}

                    {/* Copy Link Button */}
                    <button
                        className={`btn ${copied ? "btn-success" : "btn-primary"} h-9 px-4 relative overflow-hidden group transition-all duration-300`}
                        onClick={copy}
                    >
                        <span className={`transition-all duration-300 ${copied ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}>
                            Copy link
                        </span>
                        <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${copied ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                            ✓ Copied!
                        </span>
                        {/* Ripple effect */}
                        <span className="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 rounded transition-transform duration-500" />
                    </button>

                    {/* Email Button */}
                    <a
                        className="btn btn-soft h-9 px-4 hover:scale-105 active:scale-95 transition-transform"
                        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
                    >
                        Email
                    </a>
                </div>

                {/* QR Code Info */}
                <div className="text-center">
                    <button
                        onClick={handleQRCode}
                        className="text-xs text-accent hover:text-accent/80 transition-colors underline decoration-dotted"
                    >
                        Show QR Code for mobile
                    </button>
                </div>
            </div>
        </>
    );
}
