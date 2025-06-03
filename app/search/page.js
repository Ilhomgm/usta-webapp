"use client";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const masters = JSON.parse(localStorage.getItem("usta_specialists") || "[]");
    const market = JSON.parse(localStorage.getItem("usta_market_ads") || "[]");
    const services = JSON.parse(localStorage.getItem("usta_categories") || "[]").map((name) => ({
      name,
      profession: name,
      city: "Не указано",
      rating: 5,
      description: "",
      type: "service"
    }));

    setResults([...masters, ...services, ...market]);
  }, []);

  const filtered = results.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.profession?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q) ||
      item.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ padding: 40 }}>
      <h2>🔍 Поиск по платформе USTA</h2>
      <input
        type="text"
        placeholder="Поиск по имени, профессии, городу"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 8, width: 300 }}
      />

      <div style={{ marginTop: 30 }}>
        {filtered.length === 0 && <p>Ничего не найдено</p>}
        {filtered.map((item, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", marginBottom: 20, padding: 10 }}>
            {item.image && <img src={item.image} alt="img" style={{ width: 80, height: 80, objectFit: "cover" }} />}
            <h4>{item.name || item.title}</h4>
            <p><strong>Профессия:</strong> {item.profession || "—"} | <strong>Город:</strong> {item.city || "—"}</p>
            <p>{item.description || "Без описания"}</p>
            {item.price && <p><strong>Цена:</strong> {item.price} сум</p>}
            {item.rating && <p>⭐ Рейтинг: {item.rating}/5</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
