"use client";

import { useEffect } from "react";

// ✅ Объявляем интерфейс для window.Telegram — ОБЯЗАТЕЛЬНО!
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
      console.log("✅ Telegram WebApp готов");
    } else {
      console.log("❌ Telegram WebApp не найден");
    }
  }, []);

  return (
    <div style={{ padding: "50px", textAlign: "center", fontSize: "18px" }}>
      🗺️ Это страница карты мастеров (MapPage)
    </div>
  );
}
