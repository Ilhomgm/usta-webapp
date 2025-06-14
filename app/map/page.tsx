"use client";

import { useEffect } from "react";

// ⬇️ Вот эта часть обязательно
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      🗺️ Загрузка карты...
    </div>
  );
}
