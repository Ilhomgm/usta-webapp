"use client";

export default function MapPage() {
  return (
    <div style={{ padding: 40 }}>
      <h2>🗺️ Карта мастеров</h2>
      <p>Скоро вы сможете видеть мастеров на карте Google</p>
      <div style={{
        width: "100%",
        height: "400px",
        border: "1px solid #ccc",
        marginTop: "20px",
        background: "url('https://maps.gstatic.com/mapfiles/api-3/images/google_white5.png') center center no-repeat",
        backgroundSize: "contain"
      }}>
        {/* Заглушка-карта (будет заменена на <GoogleMap />) */}
      </div>
    </div>
  );
}
