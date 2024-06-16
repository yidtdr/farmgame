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

  async loadRes() {
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          console.log(`Image loaded: ${src}`);
          resolve(img);
        };
        img.onerror = (error) => {
          console.error(`Error loading image: ${src}`, error);
          reject(error);
        };
      });
    };

    const loadJson = async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    };

    const loadMapImages = async () => {
      const promises = this.mapImgNames.map(async (name) => {
        const img = await loadImage(`client/assets/map/${name}.png`);
        this.map[name] = {}
        this.map[name].image = img;
      });
      await Promise.all(promises);
      console.log('All map images loaded');
    };

    const loadAssets = async (type, name) => {
      const data = await loadJson(`client/assets/${name}/${name}.json`);
      if (type === "plants") {
        data[name].image = {};
        data[name].image.stages = {};

        const stagesPromises = Array.from({ length: 4 }).map(async (_, i) => {
          data[name].image.stages[i] = await loadImage(`client/assets/${name}/${name}_stage${i}.png`);
        });
        await Promise.all(stagesPromises);
      } else {
        data[name].image = await loadImage(`client/assets/${name}/${name}.png`);
      }
      this[type][name] = data[name];
    };
    console.log(this.buildings)

    try {
      await loadMapImages();

      const allAssetPromises = [];
      for (const type in this.names) {
        this.names[type].forEach((name) => {
          allAssetPromises.push(loadAssets(type, name));
        });
      }

      await Promise.all(allAssetPromises);
      console.log('All resources loaded');

      // Возвращаем экземпляр класса Resources, чтобы его можно было использовать
      // после загрузки в других модулях
      return this;
    } catch (error) {
      console.error('Error loading resources:', error);
      throw error; // Пробрасываем ошибку для обработки в вызывающем коде
    }
  }
}

const RES = new Resources();

RES.loadRes().then(() => {
  // Динамически загружаем основной скрипт после загрузки ресурсов
  const script = document.createElement('script');
  script.src = 'client/index.js';
  script.type = 'module'
  document.body.appendChild(script);
}).catch((error) => {
  console.error('Failed to load resources:', error);
});

export default RES;

