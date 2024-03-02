/**
 * @fileoverview Este archivo contiene funciones para realizar peticiones a la API de World of Warships.
 * @version 1.0.0
 */

const id = "96b472d7bdc2aad0591a995d4ac74b08";
const baseUrl = "https://api.worldofwarships.com/wows/encyclopedia/ships/";
const url = baseUrl + `?application_id=${id}&language=es`;

const panel_search = document.getElementById("panel_search");
const subpanel_search = document.getElementById("subpanel_search");
const categorySelect = document.getElementById("categorySelect");
const ratingsOption = document.getElementById("ratingsOption");
const accountOption = document.getElementById("accountOption");
const shipsOption = document.getElementById("shipsOption");
const encyclopediaOption = document.getElementById("encyclopediaOption");
const seasonsOption = document.getElementById("seasonsOption");
const clansOption = document.getElementById("clansOption");
const visor_images = document.querySelector(".visor_images");
const secondSelectEncyclopedia = document.getElementById(
  "secondSelectEncyclopedia"
);

/**
 * Realiza una petición a la API de World of Warships para obtener la información de los barcos.
 * @returns {Promise<Object>} Un objeto JSON con la información de los barcos.
 */
export const fetchShips = async () => {
  const ships = await fetch(url);
  const json = await ships.json();
  console.log("pedido info de barcos");
  return json;
};

/**
 * Realiza una petición a la API de World of Warships para obtener la información de los comandantes.
 * @returns {Promise<Object>} Un objeto JSON con la información de los comandantes.
 */
export const fetchComanders = async () => {
  const commanders = await fetch(
    "https://api.worldofwarships.com/wows/encyclopedia/crews/?application_id=96b472d7bdc2aad0591a995d4ac74b08"
  );
  const json = await commanders.json();
  console.log("pedido info de comandantes");
  return json;
};

// peticion a la wikipedia con la palabra clave
export const fetchWiki = async (keyword) => {
  const wiki = await fetch(
    `https://es.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${keyword}`
  );
  const json = await wiki.json();
  console.log("pedido info de wikipedia");
  return json;
};
