class Resources {
  constructor() {
    this.plants = {};
    this.buildings = {};
    this.items = {};
    this.animals = {};
    this.obstacles = {};
    this.map = {};
    this.names = {};
    this.buildingNames = {}
    this.names.buildings = ["bakery", "garden", "coop", 'cranberry','barn'];
    this.buildingNames.bakery = ["bakery"]
    this.buildingNames.garden = ["garden"]
    this.buildingNames.animalPen = ["coop"]
    this.buildingNames.bush = ['cranberry']
    this.buildingNames.serviceBuildings = ['barn'];
    this.names.plants = ["wheat", "pizdec"];
    this.names.items = ["bread"];
    this.names.animals = ["chicken"];
    this.names.obstacles = ["wood"];
    this.mapImgNames = ["grass_1", "grass_2"];
  }
}

const RES = new Resources();

export default RES;

