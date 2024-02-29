//Función para crear cartas de comandantes
export const createCommanderCards = (
  comandantes,
  page,
  comandantesPorPagina
) => {
  const startIndex = (page - 1) * comandantesPorPagina;
  const endIndex = page * comandantesPorPagina;
  const comandantesPagina = comandantes.slice(startIndex, endIndex);

  section.innerHTML = "";

  //solo lo que tengan foto
  const comandantesconFoto = comandantesPagina.filter(
    (comandante) => comandante.iconImage
  );

  comandantesconFoto.forEach((comandante) => {
    section.appendChild(createCard(comandante));
  });
};

// Función para crear cartas de barcos
export const createShipCards = (barcos, page, barcosPorPagina) => {
  const startIndex = (page - 1) * barcosPorPagina;
  const endIndex = page * barcosPorPagina;
  const barcosPagina = barcos.slice(startIndex, endIndex);

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
  const div = document.createElement("div");
  div.classList.add("card__enciclopedia");
  const container = document.createElement("div");
  container.classList.add("container-card");

  const img = document.createElement("img");
  img.src = data.iconImage || data.imagenes;
  img.alt = "Avatar";

  const textCard = document.createElement("div");
  textCard.classList.add("text-card");

  let names;
  if (Array.isArray(data.nombre)) {
    // Si es un array, tomamos el primer elemento antes de la coma (si hay una)
    names = data.nombre[0]?.split(",")[0]?.trim() || "";
    console.log("Nombres: ", names);
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
    const title = document.createElement("h4");
    title.innerHTML = `<b>${names}</b>`;
    textCard.appendChild(title);
  }

  const nationality = document.createElement("p");
  nationality.textContent = data.nation || data.nacion;

  const typeDescription = document.createElement("p");
  if (data.tipo) {
    typeDescription.textContent = data.tipo;
  } else {
    typeDescription.textContent = data.descripcion;
  }

  textCard.appendChild(nationality);
  textCard.appendChild(typeDescription);

  container.appendChild(img);
  container.appendChild(textCard);
  div.appendChild(container);

  return div;
};

/**
 * FUNCION PARA CREAR UNA TABLA DE BARCOS FILTRADOS
 */
export function createTable(data) {
  const tableContainer = document.getElementById("tableContainer");
  tableContainer.innerHTML = ""; // Limpiar la tabla anterior
  tableContainer.style.display = "block"; // Mostrar la tabla
  const table = document.createElement("table");
  table.className = "styled-table"; // Puedes agregar una clase para dar estilo a la tabla

  // Crear la cabecera de la tabla
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Nombre", "Descripción", "Nación", "Tipo"]; // Ajusta según tus propiedades de Barco

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.innerText = header;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Crear el cuerpo de la tabla
  const tbody = document.createElement("tbody");

  data.forEach((barco) => {
    const row = document.createElement("tr");
    const cells = [barco.nombre, barco.descripcion, barco.nacion, barco.tipo]; // Ajusta según tus propiedades de Barco

    cells.forEach((cell) => {
      const td = document.createElement("td");
      td.innerText = cell;
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

export function createOption(value) {
  const option = document.createElement("option");
  option.value = value;
  option.text = value;
  return option;
}
