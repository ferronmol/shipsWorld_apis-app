import { fetchShips, fetchComanders } from "./peticiones.js";
import { Barco, Comandante } from "./modelos/modelos.js";
import {
  createCommanderCards,
  createShipCards,
  createCard,
  createTable,
  createOption,
  createPlaceholderOption,
} from "./cards.js";
let comandantesArray = [];
let barcosArray = [];
const comandantesPorPagina = 21;
let paginaActual = 1;

const userContainer = document.getElementById("user-container");
const section = document.querySelector("section");
const pagination = document.getElementById("pagination");
const categorySelect = document.querySelector("#categorySelect");
const secondSelectEncyclopedia = document.querySelector(
  "#secondSelectEncyclopedia"
);
const nationalitySelect = document.getElementById("nationalitySelect");
const shipTypeSelect = document.getElementById("shipTypeSelect");
const shipNationSelect = document.getElementById("shipNationSelect");
const tableContainer = document.getElementById("tableContainer");
const aside = document.querySelector("aside");

//recupero del localstorage el usuario logueado ques un json y lo muestro en su contenedor
const userdata = localStorage.getItem("username");
//console.log("Usuario logueado: ", userdata);
const username = JSON.parse(userdata); //parseo el json a objeto
userContainer.innerHTML = `<p>Welcome: ${username.name}</p>`;

/**********************GETTERS *************/
/**
 * función que pide los barcos a la API
 * @returns array de barcos
 * */
const getShips = async () => {
  try {
    const shipsData = await fetchShips();
    console.log("Ships data charged: ", shipsData);
    const ships = shipsData.data;
    barcosArray = Object.values(shipsData.data).map(
      (shipsData) => new Barco(shipsData)
    );
    console.log("Barcos: ", barcosArray);
    return barcosArray;
  } catch (error) {
    console.error("Error fetching ships data: ", error);
  }
};
/**
 * función que pide los comandantes a la API
 * @returns array de comandantes
 * */
const getComanders = async () => {
  try {
    if (comandantesArray.length === 0) {
      const comandersData = await fetchComanders();
      console.log("Comanders data charged: ", comandersData);
      //itero con un map todos los comandantes
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
const loadNationalities = () => {
  const uniqueNationalities = [
    ...new Set(comandantesArray.map((comandante) => comandante.nation)),
  ];
  nationalitySelect.innerHTML = "";
  //creo un no seleccionable de header
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
};
categorySelect.addEventListener("change", async () => {
  //si selecciona playeer ratings abro la pagina de players.html
  if (categorySelect.value === "ratings") {
    console.log("Seleccionado: Player ratings");
    window.location.href = "../pages/players.html";
  }

  //si selecciona encyclopedia muestro el segundo select y pido los comandantes y barcos
  if (categorySelect.value === "encyclopedia") {
    console.log("Seleccionado: encyclopedia");
    //no mostrar el segundo selct hasta que no esten los datos
    secondSelectEncyclopedia.style.display = "none";
    nationalitySelect.style.display = "none";
    aside.style.display = "none";
    const comandantes = await getComanders();
    const barcos = await getShips();
    secondSelectEncyclopedia.style.display = "block";
  }
});

secondSelectEncyclopedia.addEventListener("change", (e) => {
  console.log("Seleccionado: ", e.target.value);

  const selectedValue = secondSelectEncyclopedia.value;

  if (selectedValue === "comandantes") {
    console.log("Seleccionado: comandantes");
    loadComandersAndNationalities();
    shipTypeSelect.style.display = "none";
    shipNationSelect.style.display = "none";
    tableContainer.style.display = "none";
  } else {
    nationalitySelect.style.display = "none";
  }
  if (selectedValue === "barcos") {
    console.log("Seleccionado: barcos");
    // clean the section
    section.innerHTML = "";
    showShipsSelects(); //metodo para mostrar los selects de barcos
  }
});
/*** Charge ships selects and filter resolts */
const showShipsSelects = () => {
  //show select ship type
  shipTypeSelect.style.display = "block";
  shipTypeSelect.innerHTML = "";
  shipTypeSelect.addEventListener("change", filterShips);

  //show select ship nation
  shipNationSelect.style.display = "block";
  shipNationSelect.innerHTML = "";
  shipNationSelect.addEventListener("change", filterShips);
  filterShips();
};
/* ********************FILTER********************************* */
/*
 * Filtra los barcos por tipo y nación
 *
 * */
function filterShips() {
  const selectedType = shipTypeSelect.value;
  const selectedNation = shipNationSelect.value;
  //guardar el tipo de barco seleccionado en el localstorage para usarlo en el segundo select
  localStorage.setItem("selectedType", selectedType);

  // Filtrar los barcos
  const filteredShips = barcosArray.filter(
    (barco) =>
      (selectedType === "" || barco.tipo === selectedType) &&
      (selectedNation === "" || barco.nacion === selectedNation)
  );
  // cargo lel select para filtar
  shipTypeSelect.innerHTML = "";
  createOption(shipTypeSelect, "", "Select type");
  const uniqueTypes = [...new Set(barcosArray.map((barco) => barco.tipo))];
  uniqueTypes.forEach((type) => createOption(shipTypeSelect, type, type));
  //filtrar por nacion sin perder los tipos
  shipNationSelect.innerHTML = "";
  createOption(shipNationSelect, "", "Select nation");
  const uniqueNations = [
    ...new Set(filteredShips.map((barco) => barco.nacion)),
  ];
  uniqueNations.forEach((nation) =>
    createOption(shipNationSelect, nation, nation)
  );

  //recupero el tipo
  const selectedTypeFromLocalStorage = localStorage.getItem("selectedType");
  // Si el tipo de barco seleccionado está en los tipos únicos, seleccionarlo
  if (uniqueTypes.includes(selectedTypeFromLocalStorage)) {
    shipTypeSelect.value = selectedTypeFromLocalStorage;
  }

  // Llamar a createTable con los barcos filtrados
  createTable(filteredShips);
}

/* ********************SHOW********************************* */
/*
 * Muestra la paginación de los comandantes
 *
 * */
function showCommanderPagination() {
  const pageNumbers = Math.ceil(comandantesArray.length / comandantesPorPagina);
  pagination.innerHTML = "";
  console.log("Número de páginas: ", pageNumbers);
  for (let i = 1; i <= pageNumbers; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.addEventListener("click", () => {
      section.innerHTML = "";
      paginaActual = i;
      createCommanderCards(
        comandantesArray,
        paginaActual,
        comandantesPorPagina
      );
    });
    pagination.appendChild(button);
  }
  createCommanderCards(comandantesArray, paginaActual, comandantesPorPagina);
  populateNationalitiesSelect();
}

function populateNationalitiesSelect() {
  const nationalitySelect = document.getElementById("nationalitySelect");
  nationalitySelect.innerHTML = ""; // Limpia las opciones actuales

  // Obtén todas las nacionalidades únicas de los comandantes
  const uniqueNationalities = [
    ...new Set(comandantesArray.map((comandante) => comandante.nation)),
  ];

  // Agrega las opciones al tercer select
  uniqueNationalities.forEach((nationality) => {
    const option = document.createElement("option");
    option.value = nationality;
    option.text = nationality;
    nationalitySelect.appendChild(option);
  });
}
// Función para cargar comandantes y nacionalidades
const loadComandersAndNationalities = async () => {
  console.log("Seleccionado: comandantes");
  await getComanders(); // Espera a que los comandantes estén cargados
  const comandantes = comandantesArray;
  loadNationalities();
  nationalitySelect.style.display = "block";
  nationalitySelect.addEventListener("change", () => {
    const selectedNationality = nationalitySelect.value;
    const commandersOfNationality = comandantesArray.filter(
      (comandante) => comandante.nation === selectedNationality
    );
    createCommanderCards(commandersOfNationality, 1, comandantesPorPagina);
  });
};
