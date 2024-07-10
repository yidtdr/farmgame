class Resources {
  constructor() {
    this.plants = {};
    this.buildings = {};
    this.items = {};
    this.animals = {};
    this.map = {};
    this.names = {};
    this.names.buildings = ["bakery", "field", "coop"];
    this.names.plants = ["wheat", "pizdec"];
    this.names.items = ["bread"];
    this.names.animals = ["chicken"];
    this.mapImgNames = ["grass_1", "grass_2"];
  }
}

const RES = new Resources();

export default RES;

