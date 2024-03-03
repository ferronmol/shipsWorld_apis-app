// wiki.js
import * as wikiApi from "./peticiones.js";
import * as Cards from "./cards.js";
const wikiButton = document.getElementById("wikiButton");
const wikiContainer = document.getElementById("wikiContainer");

// Función para manejar la búsqueda en Wikipedia
export const searchInWiki = async () => {
  try {
    // Obtén el nombre del barco desde el localStorage
    const shipName = localStorage.getItem("shipsWiki");
    console.log("Nombre del barco: ", shipName);

    // Verifica si se encontró un nombre de barco
    if (shipName) {
      //oculto la tabla de barcos
      const tableContainer = document.getElementById("tableContainer");
      tableContainer.style.display = "none";

      //muestro el aside
      const wikiContainer = document.getElementById("wikiContainer");
      wikiContainer.style.display = "block";
      //borra el contenido anterior
      wikiContainer.innerHTML = "";

      // Realiza la búsqueda en Wikipedia usando el nombre del barco
      const wikiData = await wikiApi.fetchWiki(shipName);
      const wikiResults = wikiData.query.search;

      console.log("Wiki results: ", wikiResults);
      const wikiContainer_title = document.querySelector(
        ".wikiContainer_title"
      );

      const wikiContent = Cards.createWikiContent(wikiResults);
      wikiContainer.innerHTML = wikiContent;
      //añado un boton de retorno
      const backButton = document.createElement("button");
      backButton.classList.add("backButton");
      backButton.innerText = "Back";
      backButton.addEventListener("click", () => {
        wikiContainer.style.display = "none";
        tableContainer.style.display = "block";
      });
      wikiContainer.appendChild(backButton);
    } else {
      console.error("No se encontró el nombre del barco en el localStorage.");
    }
  } catch (error) {
    console.error("Error al buscar en Wikipedia: ", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (wikiButton) {
    wikiButton.addEventListener("click", async () => {
      const shipName = localStorage.getItem("shipsWiki");
      await handleWikiButtonClick(shipName, wikiContainer);
      const wikiContainer_title = document.querySelector(
        ".wikiContainer_title"
      );

      if (wikiContainer_title) {
        wikiContainer_title.innerText =
          "Resultados de Wikipedia para " + shipName;
      } else {
        console.error(
          "No se encontró el elemento con la clase 'wikiContainer_title'."
        );
      }
    });
  }
});
