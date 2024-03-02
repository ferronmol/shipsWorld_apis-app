import { fetchShips, fetchComanders } from "./peticiones.js";
import { Barco, Comandante } from "./modelos/modelos.js";
import * as Cards from "./cards.js";
import { searchInWiki } from "./wiki.js";

let comandantesArray = [];
let barcosArray = [];
const comandantesPorPagina = 21;

const userContainer = document.getElementById("user-container");
const section = document.querySelector("section");
const categorySelect = document.querySelector("#categorySelect");
const secondSelectEncyclopedia = document.querySelector(
  "#secondSelectEncyclopedia"
);
const nationalitySelect = document.getElementById("nationalitySelect");
const shipTypeSelect = document.getElementById("shipTypeSelect");
const shipNationSelect = document.getElementById("shipNationSelect");
const tableContainer = document.getElementById("tableContainer");
const aside = document.querySelector("aside");

// Recupero del localstorage el usuario logueado que es un JSON y lo muestro en su contenedor
const userData = localStorage.getItem("username");
const username = JSON.parse(userData); // Parseo el JSON a objeto
userContainer.innerHTML = `<p>Welcome: ${username.name}</p>`;

/********************** GETTERS ***********************/

/**
 * Función que pide los barcos a la API
 * @returns Array de barcos
 */
const getShips = async () => {
  try {
    const shipsData = await fetchShips();
    console.log("Ships data charged: ", shipsData);
    const ships = shipsData.data;
    barcosArray = Object.values(shipsData.data).map(
      (shipsData) => new Barco(shipsData)
    );
    return barcosArray;
  } catch (error) {
    console.error("Error fetching ships data: ", error);
  }
};

/**
 * Función que pide los comandantes a la API
 * @returns Array de comandantes
 */
const getComanders = async () => {
  try {
    if (comandantesArray.length === 0) {
      const comandersData = await fetchComanders();
      console.log("Comanders data charged: ", comandersData);
      const comanders = comandersData.data;
      comandantesArray = Object.values(comandersData.data).map(
        (comandersData) => new Comandante(comandersData)
      );
    }
    return comandantesArray;
  } catch (error) {
    console.error("Error fetching comanders data: ", error);
  }
};

/********************** EVENT LISTENERS ***********************/

// Event listener para el cambio en el select de categoría
categorySelect.addEventListener("change", async () => {
  if (categorySelect.value === "ratings") {
    console.log("Seleccionado: Player ratings");
    window.location.href = "../pages/players.html";
  }

  if (categorySelect.value === "encyclopedia") {
    console.log("Seleccionado: encyclopedia");
    secondSelectEncyclopedia.style.display = "none";
    nationalitySelect.style.display = "none";
    aside.style.display = "none";
    const comandantes = await getComanders();
    const barcos = await getShips();
    secondSelectEncyclopedia.style.display = "block";
  }
});

// Event listener para el cambio en el segundo select de encyclopedia
secondSelectEncyclopedia.addEventListener("change", (e) => {
  const selectedValue = secondSelectEncyclopedia.value;

  if (selectedValue === "comandantes") {
    console.log("Seleccionado: comandantes");
    loadCommanderNationalities();
    shipTypeSelect.style.display = "none";
    shipNationSelect.style.display = "none";
    tableContainer.style.display = "none";
    showCommander();
  } else {
    nationalitySelect.style.display = "none";
  }

  if (selectedValue === "barcos") {
    console.log("Seleccionado: barcos");
    section.innerHTML = "";
    showShipsSelects();
    searchInWiki();
  }
});

/********************** LOADERS ***********************/

/**
 * Carga las nacionalidades de los comandantes
 */
const loadCommanderNationalities = () => {
  //muestro el select de nacionalidades con block
  nationalitySelect.style.display = "block";

  const uniqueNationalities = [
    ...new Set(comandantesArray.map((comandante) => comandante.nation)),
  ];
  nationalitySelect.innerHTML = "";
  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.text = "Select Nationality";
  placeholderOption.disabled = true;
  nationalitySelect.appendChild(placeholderOption);
  uniqueNationalities.forEach((nationality) => {
    const option = document.createElement("option");
    option.value = nationality;
    option.text = nationality;
    nationalitySelect.appendChild(option);
  });
  // Event listener para el cambio en el select de nacionalidad
  nationalitySelect.addEventListener("change", filterCommanders);
};
/********************** SHOW ***********************/

/**
 * Muestra los selects de tipo y nación de los barcos
 */
const showShipsSelects = () => {
  shipTypeSelect.style.display = "block";
  shipTypeSelect.innerHTML = "";
  shipTypeSelect.addEventListener("change", filterShips);

  shipNationSelect.style.display = "block";
  shipNationSelect.innerHTML = "";
  shipNationSelect.addEventListener("change", filterShips);
  filterShips();
};

/********************** FILTER ***********************/

/**
 * Filtra los barcos por tipo y nación
 */
function filterShips() {
  const selectedType = shipTypeSelect.value;
  const selectedNation = shipNationSelect.value;
  localStorage.setItem("selectedType", selectedType);

  const filteredShips = barcosArray.filter(
    (barco) =>
      (selectedType === "" || barco.tipo === selectedType) &&
      (selectedNation === "" || barco.nacion === selectedNation)
  );

  shipTypeSelect.innerHTML = "";
  Cards.createOption(shipTypeSelect, "", "Select type");
  const uniqueTypes = [...new Set(barcosArray.map((barco) => barco.tipo))];
  uniqueTypes.forEach((type) => Cards.createOption(shipTypeSelect, type, type));

  shipNationSelect.innerHTML = "";
  Cards.createOption(shipNationSelect, "", "Select nation");
  const uniqueNations = [
    ...new Set(filteredShips.map((barco) => barco.nacion)),
  ];
  uniqueNations.forEach((nation) =>
    Cards.createOption(shipNationSelect, nation, nation)
  );

  const selectedTypeFromLocalStorage = localStorage.getItem("selectedType");
  if (uniqueTypes.includes(selectedTypeFromLocalStorage)) {
    shipTypeSelect.value = selectedTypeFromLocalStorage;
  }

  Cards.createTable(filteredShips);
}

/********************** FILTER***********************/

function filterCommanders() {
  const selectedNationality = nationalitySelect.value;
  const commandersOfNationality = comandantesArray.filter(
    (comandante) => comandante.nation === selectedNationality
  );
  Cards.createCommanderCards(commandersOfNationality);

  if (selectedNationality === "") {
    showCommander();
  }
}

/********************** SHOW ***********************/

/**
 * Muestra los comandantes
 */
function showCommander() {
  const comandantes = comandantesArray;

  Cards.createCommanderCards(comandantes);
}
