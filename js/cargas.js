import { fetchShips, fetchComanders } from "./peticiones.js";
import { Barco, Comandante } from "./modelos.js";
let comandantesArray = [];
const comandantesPorPagina = 16;

const section = document.querySelector("section");
function cargarPanel() {
  if (categorySelect.value === "encyclopedia") {
    console.log("Seleccionado: encyclopedia");
    secondSelectEncyclopedia.style.display = "block";
    aside.style.display = "none";
  }
}

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
    mostrarPagina(1);
    return comandantesArray;
  } catch (error) {
    console.error("Error fetching comanders data: ", error);
  }
};

function mostrarPagina(pagina) {
  const inicio = (pagina - 1) * comandantesPorPagina;
  const fin = inicio + comandantesPorPagina;
  const comandantesPagina = comandantesArray.slice(inicio, fin);
  createCommanderCards(comandantesPagina);
}

function createCommanderCards(comandantes) {
  section.innerHTML = "";

  comandantes.forEach((comandante) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <img src="${comandante.iconImage}" alt="Avatar" style="width:100%">
    <div class="container-card">
      <h4><b>${comandante.first_names}</b></h4>
      <p>${comandante.nation}</p>
    </div>`;
    section.appendChild(div);
  });
}

// Eventos

categorySelect.addEventListener("change", cargarPanel);
secondSelectEncyclopedia.addEventListener("change", async () => {
  const selectedValue = secondSelectEncyclopedia.value;
  if (selectedValue === "barcos") {
    const ships = await getShips();
    console.log(ships);
  } else if (selectedValue === "comandantes") {
    const comandantes = await getComanders();
    console.log(comandantes);
    createCommanderCards(comandantes);
  }
});
