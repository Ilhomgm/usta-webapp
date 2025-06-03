"use client";
import { useEffect, useState } from "react";

export default function Services() {
  const [categories, setCategories] = useState(["Сантехник", "Электрик"]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("usta_categories");
    if (saved) setCategories(JSON.parse(saved));
  }, []);

  const addCategory = () => {
    if (!newCategory.trim()) return;
    if (!categories.includes(newCategory.trim())) {
      const updated = [...categories, newCategory.trim()];
      setCategories(updated);
      localStorage.setItem("usta_categories", JSON.stringify(updated));
      setNewCategory("");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Категории услуг мастеров</h2>
      <ul style={{ fontSize: "18px", lineHeight: "1.8" }}>
        {categories.map((cat, idx) => (
          <li key={idx}>🔧 {cat}</li>
        ))}
      </ul>

      <div style={{ marginTop: 30 }}>
        <input
          type="text"
          placeholder="Новая категория"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{ padding: "8px", width: "200px" }}
        />
        <button onClick={addCategory} style={{ marginLeft: "10px", padding: "8px" }}>
          ➕ Добавить
        </button>
      </div>
    </div>
  );
}
