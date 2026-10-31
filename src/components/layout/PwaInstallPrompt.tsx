"use client";

import React, { useState, useEffect } from "react";
import { Download, Smartphone, CheckCircle2, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check if app is launched in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ok)]">
        <CheckCircle2 className="w-3 h-3" />
        <span>Desktop app active</span>
      </span>
    );
  }

  if (!isVisible && !deferredPrompt) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleInstallClick}
        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] border border-[var(--color-rule-2)] text-[var(--color-ink)] flex items-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
        title="Install PressZero as a standalone desktop or mobile application"
      >
        <Smartphone className="w-3 h-3 text-[var(--color-ink)]" />
        <span>Install app</span>
      </button>
    </div>
  );
}