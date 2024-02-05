export class Barco {
  constructor(data) {
    this.id = data.ship_id;
    this.name = data.name;
    this.description = data.description;
    this.type = data.type;
    this.nation = data.nation;
    this.images = data.icons[0][1];
  }
  // Método para mostrar la información del barco
  showInfo() {
    console.log(`Descripción del barco seleccionado: ${this.description}`);
  }
  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getDescription() {
    return this.description;
  }
  getType() {
    return this.type;
  }
  getNation() {
    return this.nation;
  }
  getImages() {
    return this.images;
  }
  setName(name) {
    this.name = name;
  }
  setDescription(description) {
    this.description = description;
  }
  setType(type) {
    this.type = type;
  }
  setNation(nation) {
    this.nation = nation;
  }
  setImages(images) {
    this.images = images;
  }
}

export class Comandante {
  constructor(data) {
    this.first_names = data.first_names;
    this.base_training_hire_price = data.base_training_hire_price;
    this.iconImage = data.icons[0][1];
    this.nation = data.nation;
  }
  // Método para mostrar la información del comandante
  showInfoComanders() {
    console.log(`Comandante seleccionado: ${this.first_names}`);
  }
  getFirstNames() {
    return this.first_names;
  }
  getBaseTrainingHirePrice() {
    return this.base_training_hire_price;
  }
  getIconImage() {
    return this.iconImage;
  }
  getNation() {
    return this.nation;
  }
}
