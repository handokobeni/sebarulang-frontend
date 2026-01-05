"use client";

/**
 * PWA Install Prompt Component
 * Detects PWA installability and shows install prompt button
 * Follows .cursorrules: no inline styles, TypeScript interfaces, Tailwind CSS
 */

import { useState, useEffect, useCallback, memo } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAInstallPromptProps {
  className?: string;
  onInstall?: () => void;
  onDismiss?: () => void;
}

function PWAInstallPromptComponent({
  className,
  onInstall,
  onDismiss,
}: PWAInstallPromptProps) {
  // Compute initial state values (outside of useEffect to avoid setState in effect)
  const getInitialState = () => {
    if (typeof window === "undefined") {
      return {
        isInstalled: false,
        isVisible: false,
        dismissed: false,
      };
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ||
      document.referrer.includes("android-app://");

    const dismissed = localStorage.getItem("pwa-install-dismissed") === "true";

    return {
      isInstalled: isStandalone,
      isVisible: false, // Will be set by beforeinstallprompt event
      dismissed,
    };
  };

  const initialState = getInitialState();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled] = useState(initialState.isInstalled);
  const [isVisible, setIsVisible] = useState(
    initialState.isVisible && !initialState.dismissed && !initialState.isInstalled
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const prompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(prompt);
      // Only show if not dismissed and not installed
      if (!initialState.dismissed && !initialState.isInstalled) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    try {
      // Show install prompt
      await deferredPrompt.prompt();

      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        onInstall?.();
        setIsVisible(false);
      }

      // Clear deferred prompt
      setDeferredPrompt(null);
    } catch (error) {
      // Error logging is intentional for debugging PWA install issues
      console.error("Error showing install prompt:", error);
    }
  }, [deferredPrompt, onInstall]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setDeferredPrompt(null);
    onDismiss?.();

    // Store dismissal in localStorage to avoid showing again
    if (typeof window !== "undefined") {
      localStorage.setItem("pwa-install-dismissed", "true");
    }
  }, [onDismiss]);

  // Don't render if already installed, not visible, or no prompt available
  if (isInstalled || !isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 ${className || ""}`}
      role="banner"
      aria-label="Install app prompt"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Install Sebarulang
          </h3>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Install aplikasi untuk akses lebih cepat dan pengalaman offline
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-md p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Dismiss install prompt"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          onClick={handleInstall}
          size="sm"
          className="flex-1"
          aria-label="Install Sebarulang app"
        >
          <Download className="size-4" />
          Install
        </Button>
        <Button
          onClick={handleDismiss}
          variant="outline"
          size="sm"
          aria-label="Dismiss install prompt"
        >
          Nanti
        </Button>
      </div>
    </div>
  );
}

export const PWAInstallPrompt = memo(PWAInstallPromptComponent);

