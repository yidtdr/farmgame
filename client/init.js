import RES from "./resources.js";
import tiles from "./globalVars/tiles.js";
import Tile from "./gameClasses/tile/tile.js";
import Calc from "./calc.js";
import CVAR from "./globalVars/const.js";

class Init {
    constructor() {
    }
    async initMap(){
        for (let i = 0; i < CVAR.tileRows; i++) {
            tiles[i] = new Array(CVAR.tileCols);
        }
        for (let i = 0; i < CVAR.tileRows; i++)
        {
            for (let j = 0; j < CVAR.tileCols; j++)
            {
                let tileCoords = Calc.indexToCanvas(i, j, CVAR.tileSide, CVAR.outlineWidth);
                tiles[i][j] = new Tile(tileCoords.x, tileCoords.y, CVAR.tileSide, CVAR.tileSide, ((i + j) % 2) ? RES.map["grass_1"].image : RES.map["grass_2"].image);
            }
        }
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
        const promises = RES.mapImgNames.map(async (name) => {
          const img = await loadImage(`client/assets/map/${name}.png`);
          RES.map[name] = {}
          RES.map[name].image = img;
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
        RES[type][name] = data[name];
      };
  
      try {
        await loadMapImages();
  
        const allAssetPromises = [];
        for (const type in RES.names) {
            RES.names[type].forEach((name) => {
            allAssetPromises.push(loadAssets(type, name));
          });
        }
        await this.initMap();
  
        await Promise.all(allAssetPromises);
        console.log('All resources loaded');
  
        // Возвращаем экземпляр класса Resources, чтобы его можно было использовать
        // после загрузки в других модулях
        return RES;
      } catch (error) {
        console.error('Error loading resources:', error);
        throw error; // Пробрасываем ошибку для обработки в вызывающем коде
      }
    }
  }
  
  const init = new Init();
  
  init.loadRes().then(() => {
    // Динамически загружаем основной скрипт после загрузки ресурсов
    const script = document.createElement('script');
    script.src = 'client/index.js';
    script.type = 'module'
    document.body.appendChild(script);
    document.getElementById('loading-screen').style.display = 'none';
  
  }).catch((error) => {
    console.error('Failed to load resources:', error);
  });
  
  