import haversine from "./module/utils/math.js";

const apiUrl =
  "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records";

const list = document.getElementById("list");
const prev = document.getElementById("btn-prev");
const next = document.getElementById("btn-next");
const page = document.getElementById("current-page");

const resultsPerPage = 20;
let offset = 0;
let currentPage = 1;

function getGeolocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const userLocation = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };

    fetch(`${apiUrl}?offset=${offset}&limit=${resultsPerPage}`)
      .then((response) => {
        return response.json();
      })
      .then((cinemas) => {
        list.innerHTML = "";
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

const updatePagination = (currentPage) => {
  page.textContent = currentPage;
};

next.addEventListener("click", () => {
  currentPage++;
  offset += resultsPerPage;
  getGeolocation();
  updatePagination(currentPage);
});

prev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    offset -= resultsPerPage;
    getGeolocation();
    updatePagination(currentPage);
  }
});

getGeolocation();
updatePagination();
