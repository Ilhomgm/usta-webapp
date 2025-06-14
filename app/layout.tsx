"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      console.log("✅ Telegram WebApp готов");
    } else {
      console.log("❌ Telegram WebApp не найден");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "60px", fontSize: "20px" }}>
      ✅ Добро пожаловать в USTA WebApp!
    </div>
  );
}
