import { fetchShips, fetchComanders } from "./peticiones.js";
import { Barco, Comandante } from "./modelos.js";
let comandantesArray = [];
const comandantesPorPagina = 18;

const section = document.querySelector("section");
const categorySelect = document.querySelector("#categorySelect");
const secondSelectEncyclopedia = document.querySelector(
  "#secondSelectEncyclopedia"
);
const aside = document.querySelector("aside");

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

function showCommanderPagination() {
  console.log("mostrar paginacion de comandantes");
  const pagination = document.createElement("div");
  pagination.classList.add("pagination");
  const pages = Math.ceil(comandantesArray.length / comandantesPorPagina);
  for (let i = 1; i <= pages; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.addEventListener("click", () => {
      const start = (i - 1) * comandantesPorPagina;
      const end = start + comandantesPorPagina;
      createCommanderCards(comandantesArray.slice(start, end));
    });
    pagination.appendChild(button);
  }
  section.innerHTML = "";
  section.appendChild(pagination);
  console.log(comandantesArray);
  createCommanderCards(comandantesArray.slice(0, comandantesPorPagina));
}

function createCommanderCards(comandantes) {
  section.innerHTML = "";

  comandantes.forEach((comandante) => {
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

secondSelectEncyclopedia.addEventListener("change", (e) => {
  console.log("Seleccionado: ", e.target.value);
  if (e.target.value === "comandantes") {
    console.log("Seleccionado: comandantes");
    showCommanderPagination();
  }
});
