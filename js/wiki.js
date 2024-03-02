// wiki.js
import * as wikiApi from "./peticiones.js";

// Función para manejar la búsqueda en Wikipedia
export const searchInWiki = async () => {
  try {
    // Obtén el nombre del barco desde el localStorage
    const shipName = localStorage.getItem("shipsWiki");
    console.log("Nombre del barco: ", shipName);

    // Verifica si se encontró un nombre de barco
    if (shipName) {
      // Realiza la búsqueda en Wikipedia usando el nombre del barco
      const wikiData = await wikiApi.fetchWiki(shipName);
      const wikiResults = wikiData.query.search;

      // Imprime los resultados en la consola (puedes ajustar esto según tus necesidades)
      console.log("Wiki results: ", wikiResults);
    } else {
      console.error("No se encontró el nombre del barco en el localStorage.");
    }
  } catch (error) {
    console.error("Error al buscar en Wikipedia: ", error);
  }
};

// Llama a la función de búsqueda en Wikipedia al cargar el script (opcional)
searchInWiki();
