"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Smartphone, CheckCircle2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if app is already launched in standalone PWA mode
    if (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async (e: React.MouseEvent) => {
    if (deferredPrompt) {
      e.preventDefault();
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ok)]">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden md:inline">Installed</span>
      </span>
    );
  }

  // If beforeinstallprompt is ready, clicking triggers browser native prompt
  if (deferredPrompt) {
    return (
      <button
        onClick={handleInstallClick}
        className="px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--color-paper-2)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-rule)] text-[var(--color-ink)] flex items-center gap-1.5 cursor-pointer active:scale-98 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
        title="Install PressZero on your device"
      >
        <Smartphone className="w-3.5 h-3.5 text-[var(--color-ink)] shrink-0" />
        <span>Install app</span>
      </button>
    );
  }

  // Fallback: links to download center for device install instructions
  return (
    <Link
      href="/download"
      className="px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--color-paper-2)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-rule)] text-[var(--color-ink)] flex items-center gap-1.5 cursor-pointer active:scale-98 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
      title="Install or download PressZero"
    >
      <Smartphone className="w-3.5 h-3.5 text-[var(--color-ink)] shrink-0" />
      <span>Install app</span>
    </Link>
  );
}
