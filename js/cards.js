import { searchInWiki } from "./wiki.js";

//Función para crear cartas de comandantes
export const createCommanderCards = (comandantes) => {
  section.innerHTML = "";

  //solo lo que tengan foto
  const comandantesconFoto = comandantes.filter(
    (comandante) => comandante.iconImage
  );

  comandantesconFoto.forEach((comandante) => {
    section.appendChild(createCard(comandante));
  });
};

// Función para crear cartas de barcos
export const createShipCards = (barcos) => {
  section.innerHTML = "";
  const article = document.createElement("article");
  article.classList.add("cardArticle");

  barcosPagina.forEach((barco) => {
    article.appendChild(createCard(barco));
  });

  section.appendChild(article);
};
// Función para crear elementos de carta
export const createCard = (data) => {
  if (!data.iconImage || data.iconImage === "") {
    // Si no hay imagen, no creamos la tarjeta
    return null;
  }
  const comCard = document.createElement("div");
  comCard.classList.add("container-card");

  const img = document.createElement("img");
  img.src = data.iconImage || data.imagenes;
  img.alt = `Avatar - ${data.nombre || "No name"}`;

  const textCard = document.createElement("div");
  textCard.classList.add("text-card");

  let names;
  if (Array.isArray(data.nombre)) {
    // Si es un array, tomamos el primer elemento antes de la coma (si hay una)
    names = data.nombre[0]?.split(",")[0]?.trim() || "";
    //console.log("Nombres: ", names);
  } else if (typeof data.nombre === "string") {
    // Si es una cadena, tomamos el primer elemento antes de la coma (si hay una)
    names = data.nombre.split(",")[0]?.trim() || data.nombre.trim() || "";
    console.log("Nombres: ", names);
  } else {
    // Si no es ni cadena ni array, lo dejamos vacío
    names = "";
  }

  const firstCommaIndex = names.indexOf(","); // Encuentra la primera coma

  // Verificar si hay nombres antes de crear el elemento title
  if (names.length > 0) {
    const title = document.createElement("p");
    title.innerHTML = `<p>${names}</p>`;
    textCard.appendChild(title);
  }

  comCard.appendChild(img);
  comCard.appendChild(textCard);

  return comCard;
};
/**
 * FUNCION PARA CREAR UNA TABLA DE BARCOS FILTRADOS
 */
export function createTable(filteredShips) {
  const tableContainer = document.getElementById("tableContainer");
  tableContainer.innerHTML = "";
  tableContainer.style.display = "block";

  const table = document.createElement("table");
  table.className = "table table-dark table-striped styled-table";
  table.style.marginLeft = "3rem";

  // Crear la cabecera de la tabla
  const thead = document.createElement("thead");
  thead.className = "thead-dark";
  const headerRow = document.createElement("tr");
  const headers = ["Nombre", "Descripción", "Nación", "Tipo"];

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.innerText = header;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // create the body of the table
  const tbody = document.createElement("tbody");
  tbody.className = "tbody-light";

  filteredShips.forEach((barco) => {
    // create a row for each ship
    const row = document.createElement("tr");
    const cells = [barco.nombre, barco.descripcion, barco.nacion, barco.tipo];

    cells.forEach((cell, index) => {
      const td = document.createElement("td");

      // check if the current cell is for the "Nombre" column
      if (index === 0) {
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "d-flex align-items-center";

        const wikiButton = document.createElement("button");
        wikiButton.className = "btn btn-info btn-sm ms-2";
        wikiButton.innerText = "Wiki";
        wikiButton.addEventListener("click", () =>
          handleWikiButtonClick(barco.nombre)
        );

        buttonContainer.appendChild(document.createTextNode(cell));
        buttonContainer.appendChild(wikiButton);

        td.appendChild(buttonContainer);
      } else {
        // for other columns, simply add the cell to the row
        td.innerText = cell;
      }

      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tableContainer.appendChild(table);
}

export function createPlaceholderOption(text) {
  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.text = text;
  placeholderOption.disabled = true;
  return placeholderOption;
}

export function createOption(select, value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.text = text;

  select.appendChild(option);
}

// Function to handle the Wiki button click
export function handleWikiButtonClick(shipName) {
  // console.log(`Wiki button clicked for ship: ${shipName}`);
  localStorage.setItem("shipsWiki", shipName);
  console.log("Nombre del barco en localStorage: ", shipName);
  //muestra el aside
  wikiContainer.style.display = "block";
  searchInWiki();
}

export function createWikiContent(wikiResults) {
  let wikiContent = "";
  wikiResults.forEach((result) => {
    const title = result.title;
    const snippet = result.snippet;
    const pageId = result.pageid;
    const wikiUrl = `https://en.wikipedia.org/?curid=${pageId}`;

    wikiContent += `
      <div class="wikiResult">
        <h3>${title}</h3>
        <p>${snippet}</p>
        <a href="${wikiUrl}" target="_blank">Read more</a>  
      </div>
    `;
  });
  return wikiContent;
}
