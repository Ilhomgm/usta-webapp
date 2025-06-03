import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold mb-4">USTA SuperWebApp 🌍</h1>
        <p className="text-lg mb-6">Добро пожаловать в глобальную платформу мастеров, услуг и технологий.</p>
        <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-xl shadow hover:bg-gray-100 transition">
          Перейти в каталог →
        </button>
      </div>
    </div>
  );
}
