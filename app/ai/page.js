"use client";
import { useState } from "react";

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newChat = [...chat, { from: "user", text: input }];
    setChat(newChat);
    setInput("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input })
      });

      const data = await res.json();
      setChat([...newChat, { from: "ai", text: data.reply }]);
    } catch (err) {
      setChat([...newChat, { from: "ai", text: "⚠️ Ошибка связи с AI" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>🤖 AI-помощник USTA</h2>
      <p>Спросите, кого вызвать, как выбрать мастера или любые советы</p>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Введите вопрос..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: 10, width: 300 }}
        />
        <button onClick={askAI} disabled={loading} style={{ marginLeft: 10, padding: "10px 20px" }}>
          {loading ? "⏳" : "Спросить"}
        </button>
      </div>

      <div style={{ background: "#f0f0f0", padding: 20, borderRadius: 8 }}>
        {chat.map((msg, i) => (
          <div key={i} style={{ marginBottom: 15 }}>
            <strong>{msg.from === "user" ? "Вы" : "USTA AI"}:</strong> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
          }
