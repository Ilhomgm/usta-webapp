"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">👷 Добро пожаловать в USTA!</h1>

      <div className="space-y-4">
        <Link href="/masters">
          <button className="w-full p-4 bg-blue-600 text-white rounded-xl">🔧 Мастера</button>
        </Link>

        <Link href="/map">
          <button className="w-full p-4 bg-green-600 text-white rounded-xl">🗺️ Карта мастеров</button>
        </Link>

        <Link href="/login">
          <button className="w-full p-4 bg-gray-800 text-white rounded-xl">🔐 Вход</button>
        </Link>
      </div>
    </div>
  );
}
