var map = L.map("map").setView([50.734098, 7.097873], 15);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let t = await (
  await fetch("https://api.nextbike.net/maps/nextbike-live.json?city=547")
).json();

let places = t.countries[0].cities[0].places;

for (let place of places) {
  var circle = L.circle([place.lat, place.lng], {
    color: "blue",
    fillColor: "blue",
    fillOpacity: 1,
    radius: 5,
  }).addTo(map);
}
