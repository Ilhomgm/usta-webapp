"use client";
import { useEffect, useState } from "react";

export default function Specialists() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    profession: "",
    city: "",
    contact: "",
    description: "",
    rating: 5,
    image: ""
  });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("usta_specialists");
    if (saved) setList(JSON.parse(saved));
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

  const addSpecialist = () => {
    if (!form.name || !form.profession) return;
    const updated = [...list, form];
    setList(updated);
    localStorage.setItem("usta_specialists", JSON.stringify(updated));
    setForm({ name: "", profession: "", city: "", contact: "", description: "", rating: 5, image: "" });
  };

  const filtered = list.filter((s) =>
    s.profession.toLowerCase().includes(filter.toLowerCase()) ||
    s.city.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: 40 }}>
      <h2>👨‍⚕️ Онлайн-специалисты (врачи, юристы, IT и др.)</h2>
      <div style={{ marginBottom: 20 }}>
        🔍 <input
          type="text"
          placeholder="Поиск по профессии или городу"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: 8, width: 300 }}
        />
      </div>

      <div style={{ marginBottom: 30 }}>
        <input type="text" name="name" placeholder="Имя" value={form.name} onChange={handleInput} style={{ padding: 8, width: 300 }} /><br /><br />
        <input type="text" name="profession" placeholder="Профессия" value={form.profession} onChange={handleInput} style={{ padding: 8, width: 300 }} /><br /><br />
        <input type="text" name="city" placeholder="Город" value={form.city} onChange={handleInput} style={{ padding: 8, width: 300 }} /><br /><br />
        <input type="text" name="contact" placeholder="Контакт" value={form.contact} onChange={handleInput} style={{ padding: 8, width: 300 }} /><br /><br />
        <textarea name="description" placeholder="Описание услуг" value={form.description} onChange={handleInput} style={{ padding: 8, width: 300, height: 60 }} /><br /><br />
        <input type="file" accept="image/*" onChange={handleImage} /><br /><br />
        <button onClick={addSpecialist} style={{ padding: "8px 16px" }}>➕ Добавить специалиста</button>
      </div>

      <h3>📋 Зарегистрированные:</h3>
      {filtered.map((s, idx) => (
        <div key={idx} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
          {s.image && <img src={s.image} alt="Фото" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "50%" }} />}
          <h4>{s.name} — {s.profession}</h4>
          <p><strong>Город:</strong> {s.city} | <strong>Контакт:</strong> {s.contact}</p>
          <p>{s.description}</p>
          <p>⭐ Рейтинг: {s.rating}/5</p>
        </div>
      ))}
    </div>
  );
          }
