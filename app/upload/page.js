"use client";
import { useState, useEffect } from "react";

export default function UploadPage() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("usta_uploaded_images");
    if (saved) setImages(JSON.parse(saved));
  }, []);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImage = {
        src: reader.result,
        caption,
        date: new Date().toLocaleString()
      };
      const updated = [newImage, ...images];
      setImages(updated);
      localStorage.setItem("usta_uploaded_images", JSON.stringify(updated));
      setCaption("");
      setFile(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>📸 Загрузка фото</h2>
      <p>Загрузите диплом, инструмент, портфолио или товар</p>

      <input type="file" accept="image/*" onChange={handleFile} /><br /><br />
      <input
        type="text"
        placeholder="Подпись / описание"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={{ padding: 8, width: 300 }}
      />
      <br /><br />
      <button onClick={uploadImage} style={{ padding: "10px 20px" }}>Загрузить</button>

      <div style={{ marginTop: 30 }}>
        <h3>📂 Загруженные:</h3>
        {images.length === 0 && <p>Нет фото</p>}
        {images.map((img, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
            <img src={img.src} alt={`img-${i}`} style={{ width: 200, borderRadius: 8 }} />
            <p><strong>{img.caption}</strong></p>
            <p style={{ fontSize: "12px", color: "#666" }}>{img.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
          }
