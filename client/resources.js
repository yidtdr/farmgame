class Resources {
  constructor() {
    this.plants = {};
    this.buildings = {};
    this.items = {};
    this.map = {};
    this.names = {};
    this.names.buildings = ["bakery", "field"];
    this.names.plants = ["wheat", "pizdec"];
    this.names.items = ["bread"];
    this.mapImgNames = ["grass_1", "grass_2"];
  }
}

const RES = new Resources();

export default RES;

