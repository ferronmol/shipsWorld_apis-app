import { fetchShips, fetchComanders } from "./peticiones.js";
import { Barco, Comandante } from "./modelos.js";
let comandantesArray = [];
const comandantesPorPagina = 20;
let paginaActual = 1;
const userContainer = document.getElementById("user-container");
const section = document.querySelector("section");
const pagination = document.getElementById("pagination");
const categorySelect = document.querySelector("#categorySelect");
const secondSelectEncyclopedia = document.querySelector(
  "#secondSelectEncyclopedia"
);
const aside = document.querySelector("aside");

//recupero del localstorage el usuario logueado ques un json y lo muestro en su contenedor
const userdata = localStorage.getItem("username");

console.log("Usuario logueado: ", userdata);
const username = JSON.parse(userdata); //parseo el json a objeto
userContainer.innerHTML = `<p>Bienvenido: ${username.name}</p>`;

//funciones de peticiones de carga de datos
const getShips = async () => {
  try {
    const shipsData = await fetchShips();
    console.log("Ships data charged: ", shipsData);
  } catch (error) {
    console.error("Error fetching ships data: ", error);
  }
};
const getComanders = async () => {
  try {
    const comandersData = await fetchComanders();
    console.log("Comanders data charged: ", comandersData);
    //itero con un map todos los comandantes
    const comanders = comandersData.data;
    comandantesArray = Object.values(comandersData.data).map(
      (comandersData) => new Comandante(comandersData)
    );
    return comandantesArray;
  } catch (error) {
    console.error("Error fetching comanders data: ", error);
  }
};
categorySelect.addEventListener("change", async () => {
  //si selecciona encyclopedia muestro el segundo select y pido los comandantes y barcos
  if (categorySelect.value === "encyclopedia") {
    console.log("Seleccionado: encyclopedia");
    //no mostrar el segundo selct hasta que no esten los datos
    secondSelectEncyclopedia.style.display = "none";
    aside.style.display = "none";
    const comandantes = await getComanders();
    const barcos = await getShips();
    secondSelectEncyclopedia.style.display = "block";
  }
});

/* ***************************************************** */
function createCommanderCards(comandantes, page, comandantesPorPagina) {
  const startIndex = (page - 1) * comandantesPorPagina;
  const endIndex = page * comandantesPorPagina;
  const comandantesPagina = comandantes.slice(startIndex, endIndex);

  comandantesPagina.forEach((comandante) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <div class="container-card">
    <img src="${comandante.iconImage}" alt="Avatar">
    <div class="text-card">
      <h4><b>${comandante.first_names}</b></h4>
      <p>${comandante.nation}</p>
    </div>
    </div>`;
    section.appendChild(div);
  });
}
function showCommanderPagination() {
  createCommanderCards(comandantesArray, paginaActual, comandantesPorPagina);
  const pageNumbers = Math.ceil(comandantesArray.length / comandantesPorPagina);
  console.log("pageNumbers: ", pageNumbers);
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";
  const previousButton = document.createElement("button");
  previousButton.innerText = "Anterior";
  previousButton.classList.add("pagination_button");
  previousButton.id = "previous";
  previousButton.disabled = true;
  previousButton.addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      createCommanderCards(
        comandantesArray,
        paginaActual,
        comandantesPorPagina
      );
    }
  });
  pagination.appendChild(previousButton);

  for (let i = 1; i <= pageNumbers; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.classList.add("pagination_button");
    button.addEventListener("click", () => {
      paginaActual = i;
      createCommanderCards(
        comandantesArray,
        paginaActual,
        comandantesPorPagina
      );
    });
    pagination.appendChild(button);
  }

  const nextButton = document.createElement("button");
  nextButton.innerText = "Siguiente";
  nextButton.classList.add("pagination_button");
  nextButton.id = "next";
  nextButton.disabled = true; // Ajusta esto según tu lógica de paginación
  nextButton.addEventListener("click", () => {
    if (paginaActual < pageNumbers) {
      paginaActual++;
      createCommanderCards(
        comandantesArray,
        paginaActual,
        comandantesPorPagina
      );
    }
  });
  pagination.appendChild(nextButton);
}

secondSelectEncyclopedia.addEventListener("change", (e) => {
  console.log("Seleccionado: ", e.target.value);
  if (e.target.value === "comandantes") {
    console.log("Seleccionado: comandantes");
    showCommanderPagination();
  }
});
