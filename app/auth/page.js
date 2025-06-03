"use client";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Обработка данных Telegram после авторизации
    const tgData = window?.Telegram?.WebApp?.initDataUnsafe;
    if (tgData && tgData.user) {
      setUserData(tgData.user);
    }
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>🔐 Авторизация через Telegram</h2>
      {!userData ? (
        <>
          <p>Пожалуйста, авторизуйтесь через Telegram для доступа к системе</p>
          <script
            async
            src="https://telegram.org/js/telegram-widget.js?7"
            data-telegram-login="USTA_BOT_USERNAME"   // ❗ Заменить на имя твоего бота
            data-size="large"
            data-userpic="true"
            data-radius="8"
            data-request-access="write"
            data-userpic="true"
            data-onauth="onTelegramAuth(user)"
          ></script>
          <script>
            {`
              function onTelegramAuth(user) {
                localStorage.setItem("usta_user", JSON.stringify(user));
                location.reload();
              }
            `}
          </script>
        </>
      ) : (
        <div>
          <p>✅ Добро пожаловать, {userData.first_name}!</p>
          <p>ID: {userData.id}</p>
          <p>Username: @{userData.username}</p>
          <button
            onClick={() => {
              localStorage.removeItem("usta_user");
              setUserData(null);
            }}
            style={{ marginTop: 20, padding: "10px 20px" }}
          >
            🚪 Выйти
          </button>
        </div>
      )}
    </div>
  );
        }
