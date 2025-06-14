"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        expand: () => void;
        ready: () => void;
      };
    };
  }
}

export default function MapPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.ready();
    }
  }, []);

  return (
    <div style={{
      padding: "40px",
      fontSize: "20px",
      textAlign: "center"
    }}>
      🗺️ Карта мастеров будет тут (MapPage работает)
    </div>
  );
}
