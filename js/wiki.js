// wiki.js
import * as wikiApi from "./peticiones.js";
import * as Cards from "./cards.js";

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

      // Realiza la búsqueda en Wikipedia usando el nombre del barco
      const wikiData = await wikiApi.fetchWiki(shipName);
      const wikiResults = wikiData.query.search;

      // Imprime los resultados en la consola (puedes ajustar esto según tus necesidades)
      console.log("Wiki results: ", wikiResults);

      const asideTitle = document.querySelector(".wikiContainer_title");
      asideTitle.innerText = `Resultados de Wikipedia para ${shipName}`;

      const wikiContent = Cards.createWikiContent(wikiResults);
      wikiContainer.innerHTML = wikiContent;
    } else {
      console.error("No se encontró el nombre del barco en el localStorage.");
    }
  } catch (error) {
    console.error("Error al buscar en Wikipedia: ", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const wikiButton = document.getElementById("wikiButton");
  const wikiContainer = document.getElementById("wikiContainer");
  if (wikiButton) {
    wikiButton.addEventListener("click", () => {
      const shipName = localStorage.getItem("shipsWiki");
      handleWikiButtonClick(shipName, wikiContainer);
    });
  }
  const wikiContainer_title = document.querySelector(".wikiContainer_title");
  if (wikiContainer_title) {
    // Establece el texto interior solo si el elemento existe
    wikiContainer_title.innerText = "Resultados de Wikipedia";
  }
});
