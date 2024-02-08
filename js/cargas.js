import { fetchShips, fetchComanders } from "./peticiones.js";
import { Barco, Comandante } from "./modelos.js";
let comandantesArray = [];
let barcosArray = [];
const comandantesPorPagina = 20;
let paginaActual = 1;
let previousButton = document.getElementById("previous");
let nextButton = document.getElementById("next");
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
//console.log("Usuario logueado: ", userdata);
const username = JSON.parse(userdata); //parseo el json a objeto
userContainer.innerHTML = `<p>Bienvenido: ${username.name}</p>`;

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

/* ********************CREATE********************************* */
/**
 *  Crea las cartas de los comandantes
 * @param {*} comandantes
 * @param {*} page
 * @param {*} comandantesPorPagina
 */
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
/**
 * Crea las cartas de los barcos
 * @param {*} barcos
 * @param {*} page
 * @param {*} barcosPorPagina
 */
function createShipCards(barcos, page, barcosPorPagina) {
  const startIndex = (page - 1) * barcosPorPagina;
  const endIndex = page * barcosPorPagina;
  const barcosPagina = barcos.slice(startIndex, endIndex);
  const article = document.createElement("article");
  article.classList.add("cardArticle");
  barcosPagina.forEach((barco) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <div class="container-card">
    <img src="${barco.imagenes}" alt="Avatar">
    <div class="text-card">
      <h4><b>${barco.id}${barco.nombre}</b></h4>
      <p>${barco.nacion}</p>
      <p>${barco.tipo}</p>
      <p>${barco.descripcion}</p>
    </div>
    </div>`;
    article.appendChild(div);
  });
  section.appendChild(article);
}
/* ********************SHOW********************************* */
/*
 * Muestra la paginación de los comandantes
 *
 * */
function showCommanderPagination() {
  //createCommanderCards(comandantesArray, paginaActual, comandantesPorPagina);
  const pageNumbers = Math.ceil(comandantesArray.length / comandantesPorPagina);
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
}

/**
 * Muestra la paginación de los barcos
 *
 * */

function showShipsPagination() {
  const barcosPorPagina = 10;
  const pageNumbers = Math.ceil(barcosArray.length / barcosPorPagina);
  console.log("Número de páginas: ", pageNumbers);
  for (let i = 1; i <= pageNumbers; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.addEventListener("click", () => {
      //elimino el contenido del section
      section;
      section.innerHTML = "";
      paginaActual = i;
      createShipCards(barcosArray, paginaActual, barcosPorPagina);
    });
    pagination.appendChild(button);
  }
  createShipCards(barcosArray, paginaActual, barcosPorPagina);
}
/*****************  EVENTOS ***********************************************/
secondSelectEncyclopedia.addEventListener("change", (e) => {
  console.log("Seleccionado: ", e.target.value);
  if (e.target.value === "comandantes") {
    console.log("Seleccionado: comandantes");
    showCommanderPagination();
  }
  if (e.target.value === "barcos") {
    console.log("Seleccionado: barcos");
    showShipsPagination();
  }
});
