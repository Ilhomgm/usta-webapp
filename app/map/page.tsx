"use client";

import { useEffect } from "react";

// 👇 ЭТО ОБЯЗАТЕЛЬНО — объявляем типы Telegram для TypeScript
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
      console.log("✅ Telegram WebApp активирован");
    } else {
      console.log("❌ Telegram WebApp не найден");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>
      🗺️ Здесь будет карта мастеров
    </div>
  );
}
