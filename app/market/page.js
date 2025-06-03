"use client";
import { useEffect, useState } from "react";

export default function Market() {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    city: "",
    description: "",
    image: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("usta_market_ads");
    if (saved) setAds(JSON.parse(saved));
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const addAd = () => {
    if (!form.title || !form.price) return;
    const updated = [...ads, form];
    setAds(updated);
    localStorage.setItem("usta_market_ads", JSON.stringify(updated));
    setForm({ title: "", price: "", category: "", city: "", description: "", image: "" });
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>🛒 Купля / Продажа</h2>
      <p>Добавьте товар или услугу</p>

      <div style={{ marginBottom: 30 }}>
        <input type="text" name="title" placeholder="Название" value={form.title} onChange={handleInput} style={{ padding: 8, width: 300 }} /><br /><br />
        <input type="text" name="price" placeholder="Цена (сум)" value={form.price} onChange={handleInput} style={{ padding: 8, width: 300 }} /><br /><br />
        <input type="text" name="category" placeholder="Категория (инструмент, запчасть...)" value={form.category} onChange={handleInput} style={{ padding: 8, width: 300 }} /><br /><br />
        <input type="text" name="city" placeholder="Город" value={form.city} onChange={handleInput} style={{ padding: 8, width: 300 }} /><br /><br />
        <textarea name="description" placeholder="Описание" value={form.description} onChange={handleInput} style={{ padding: 8, width: 300, height: 60 }} /><br /><br />
        <input type="file" accept="image/*" onChange={handleImage} /><br /><br />
        <button onClick={addAd} style={{ padding: "8px 16px" }}>➕ Добавить объявление</button>
      </div>

      <h3>📋 Объявления:</h3>
      {ads.map((ad, idx) => (
        <div key={idx} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
          {ad.image && <img src={ad.image} alt="img" style={{ width: 100, height: 100, objectFit: "cover" }} />}
          <h4>{ad.title} — {ad.price} сум</h4>
          <p><strong>Категория:</strong> {ad.category} | <strong>Город:</strong> {ad.city}</p>
          <p>{ad.description}</p>
        </div>
      ))}
    </div>
  );
                                                                        }
