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
  let color = "blue";
  for (let bike of place.bike_list) {
    if (bike.state != "ok") {
      console.log(bike);
      color = "red";
    }
  }
  var circle = L.circle([place.lat, place.lng], {
    color: color,
    fillColor: color,
    fillOpacity: 1,
    radius: 5,
  }).addTo(map);
}

const read_csv_from_server = async (addr) => {
  let shapes = await (await fetch(addr)).text();
  let entries = shapes.split("\n");
  entries = entries.map((v) => v.split(","));
  return entries;
};

let entries = await read_csv_from_server("shapes.txt");

let shapes = {};
for (let entry of entries) {
  if (!shapes[entry[0]]) shapes[entry[0]] = [];
  shapes[entry[0]].push([Number(entry[1]), Number(entry[2])]);
}

let trips = await read_csv_from_server("trips.txt");
let routes = await read_csv_from_server("routes.txt");

routes = routes.filter((v) => v[2][0] == "6" && v[2].length == 3);
routes = routes.map((v) => {
  let c;
  trips.forEach((r) => {
    if (r[0] == v[0]) {
      c = r[6];
    }
  });
  return c;
});

for (let shape_name in shapes) {
  if (!routes.includes(shape_name)) continue;
  let shape = shapes[shape_name];
  var firstpolyline = new L.polyline(shape, {
    color: "red",
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1,
  }).addTo(map);
}
