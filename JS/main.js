import haversine from "./module/utils/math.js";

const apiUrl =
  "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records";

const list = document.getElementById("list");

function getGeolocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const userLocation = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };

    fetch(apiUrl)
      .then((response) => {
        return response.json();
      })
      .then((cinemas) => {
        cinemas.results.forEach((cinema) => {
          const cinemaLocation = {
            lat: cinema.geolocalisation.lat,
            lon: cinema.geolocalisation.lon,
          };

          const distance = haversine(
            [userLocation.lat, userLocation.lon],
            [cinemaLocation.lat, cinemaLocation.lon]
          );

          cinema.distance = distance;
        });

        cinemas.results.sort((a, b) => {
          return a.fauteuils - b.fauteuils;
        });

        cinemas.results.forEach((cinema) => {
          const li = document.createElement("li");
          li.textContent = `${cinema.nom} ${cinema.adresse} ${
            cinema.commune
          } - Fauteuils: ${
            cinema.fauteuils
          } - Distance: ${cinema.distance.toFixed(2)} km`;
          list.appendChild(li);
        });
      });
  });
}

getGeolocation();
