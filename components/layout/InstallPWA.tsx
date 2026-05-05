"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPWA() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isIOS =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window.navigator as Navigator & { standalone?: boolean }).standalone;

    if (isIOS) {
      setShowIOSHint(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (dismissed) return null;

  if (showIOSHint) {
    return (
      <div className="flex items-center gap-2 text-xs bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-blue-700">
        <span>Partager → &quot;Sur l&apos;écran d&apos;accueil&quot;</span>
        <button onClick={() => setDismissed(true)} aria-label="Fermer">
          <X size={14} />
        </button>
      </div>
    );
  }

  if (!installEvent) return null;

  const handleInstall = async () => {
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") setInstallEvent(null);
  };

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-1.5 text-xs bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-3 py-1.5 transition-colors"
    >
      <Download size={14} />
      <span>Installer</span>
    </button>
  );
}
