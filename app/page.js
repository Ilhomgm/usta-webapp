"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>USTA SuperApp</h1>
      <p>Выберите нужный раздел</p>
      <div style={{ marginTop: 20, fontSize: "18px", lineHeight: "2" }}>
        <Link href="/services">📋 Услуги мастеров</Link><br />
        <Link href="/market">🛒 Купля / продажа</Link><br />
        <Link href="/specialists">👨‍🏫 Онлайн специалисты</Link><br />
        <Link href="/search">🔍 Поиск мастеров</Link><br />
        <Link href="/map">🗺️ Карта</Link><br />
        <Link href="/ai">🤖 AI-помощник</Link><br />
        <Link href="/upload">📸 Загрузка фото</Link><br />
        <Link href="/auth">🔐 Авторизация</Link><br />
        <Link href="/admin">🛠️ Админка</Link>
      </div>
    </div>
  );
  }
