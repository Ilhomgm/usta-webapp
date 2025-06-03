let tg = window.Telegram.WebApp;
tg.expand();

window.onload = () => {
  const user = tg.initDataUnsafe.user;

  document.getElementById("name").textContent = user.first_name || "Без имени";
  document.getElementById("city").textContent = "Не указано";
  document.getElementById("profession").textContent = "Не указана";

  document.getElementById("requestButton").addEventListener("click", () => {
    tg.sendData(JSON.stringify({ action: "request_service", user_id: user.id }));
    tg.close();
  });
};

function initMap() {
  navigator.geolocation.getCurrentPosition((position) => {
    let map = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      zoom: 14
    });

    new google.maps.Marker({
      position: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      map,
      title: "Вы здесь"
    });
  });
}
