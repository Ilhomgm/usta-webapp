"use client";
import { useEffect, useState } from "react";

const ADMIN_ID = 123456789; // ← замени на свой Telegram user.id

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [masters, setMasters] = useState([]);
  const [ads, setAds] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const u = localStorage.getItem("usta_user");
    if (u) setUser(JSON.parse(u));

    const m = localStorage.getItem("usta_specialists");
    if (m) setMasters(JSON.parse(m));

    const a = localStorage.getItem("usta_market_ads");
    if (a) setAds(JSON.parse(a));

    const i = localStorage.getItem("usta_uploaded_images");
    if (i) setImages(JSON.parse(i));
  }, []);

  const deleteSpecialist = (index) => {
    const updated = [...masters];
    updated.splice(index, 1);
    setMasters(updated);
    localStorage.setItem("usta_specialists", JSON.stringify(updated));
  };

  const verifySpecialist = (index) => {
    const updated = [...masters];
    updated[index].verified = true;
    setMasters(updated);
    localStorage.setItem("usta_specialists", JSON.stringify(updated));
  };

  const deleteAd = (index) => {
    const updated = [...ads];
    updated.splice(index, 1);
    setAds(updated);
    localStorage.setItem("usta_market_ads", JSON.stringify(updated));
  };

  const deleteImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
    localStorage.setItem("usta_uploaded_images", JSON.stringify(updated));
  };

  if (!user || user.id !== ADMIN_ID) {
    return <div style={{ padding: 40 }}><h2>🔒 Доступ запрещён</h2><p>Вы не администратор</p></div>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>🛠️ Админ-панель USTA</h2>
      <p>Добро пожаловать, @{user.username}</p>

      <h3>👨‍🔧 Специалисты</h3>
      {masters.length === 0 && <p>Нет зарегистрированных специалистов</p>}
      {masters.map((m, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <strong>{m.name}</strong> — {m.profession} | {m.city}<br />
          {m.verified ? <span style={{ color: "green" }}>✅ Верифицирован</span> : <button onClick={() => verifySpecialist(i)}>✅ Верифицировать</button>}
          <br />
          <button onClick={() => deleteSpecialist(i)} style={{ marginTop: 5 }}>❌ Удалить</button>
        </div>
      ))}

      <h3>📦 Объявления</h3>
      {ads.length === 0 && <p>Нет объявлений</p>}
      {ads.map((a, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <strong>{a.title}</strong> — {a.price} сум<br />
          <p>{a.description}</p>
          <button onClick={() => deleteAd(i)} style={{ marginTop: 5 }}>❌ Удалить</button>
        </div>
      ))}

      <h3>📸 Фото мастеров</h3>
      {images.length === 0 && <p>Нет загруженных фото</p>}
      {images.map((img, i) => (
        <div key={i} style={{ marginBottom: 15 }}>
          <img src={img.src} alt="img" style={{ width: 150, borderRadius: 8 }} /><br />
          <small>{img.caption}</small><br />
          <button onClick={() => deleteImage(i)}>❌ Удалить</button>
        </div>
      ))}
    </div>
  );
    }
