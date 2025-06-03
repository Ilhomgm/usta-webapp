"use client";

export default function Services() {
  const categories = [
    "Сантехник",
    "Электрик",
    "Холодильщик",
    "Мебельщик",
    "Маляр",
    "Ремонт техники",
    "Кровельщик",
    "Плиточник",
    "Отделочник",
    "Монтаж кондиционеров",
  ];

  return (
    <div style={{ padding: 40 }}>
      <h2>Категории услуг мастеров</h2>
      <ul style={{ fontSize: "18px", lineHeight: "1.8" }}>
        {categories.map((cat, idx) => (
          <li key={idx}>🔧 {cat}</li>
        ))}
      </ul>
    </div>
  );
  }
