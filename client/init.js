import RES from "./resources.js";
import tiles from "./globalVars/tiles.js";
import Calc from "./calc.js";
import CVAR from "./globalVars/const.js";
import player from "./gameClasses/player/player.js";

class SocketClient{
    constructor()
    {
        this.requestQueue = new Array()
        // this.socket = new WebSocket('ws:192.168.123.1:8000');
        this.gameSessionPromiseResolve = null;
        this.gameSessionPromise = new Promise((resolve) => {
            this.gameSessionPromiseResolve = resolve;
        });
      // this.socket.onopen = () => {
      //   console.log('WebSocket connection established');
      //   this.flushQueue();
      // };
        // this.socket.onmessage = (m) => {
        //     const data = JSON.parse(m.data)
        //     console.log(data)

        //     if (data.dataType == "game-session") 
        //     {
        //         this.initGameSession(data)
        //     }
        //     else if (data.dataType == "game-session-regen")
        //     {
        //         this.regenPlayer(data)
        //     }
        //     else if (data.dataType == "result-code")
        //     {
        //         this.handleResultCode(data.code)
        //     }
        // }
  }
  // flushQueue() {
  //   while (this.requestQueue.length > 0 && this.socket.readyState === WebSocket.OPEN) {
  //       const request = this.requestQueue.shift();
  //       this.socket.send(request);
  //   }
  //   console.log(this.requestQueue[0])
  // }
  _decipherRequest(request) {
    let parts = request.split('/');

    let requestType = parts[0];
    let result = { requestType: requestType };

    switch (requestType) {
        case 'connect':
            result.text = parts[1];
            break;
        case 'use':
            result.name = parts[1];
            result.x = parseInt(parts[2]);
            result.y = parseInt(parts[3]);
            break;
        case 'collect':
            result.x = parseInt(parts[1]);
            result.y = parseInt(parts[2]);
            break;
        case 'upgrade':
            result.x = parseInt(parts[1]);
            result.y = parseInt(parts[2]);
            break;
        case 'buy':
            result.name = parts[1];
            result.amount = parseInt(parts[2]);
            break;
        case 'spin':
            break;
        case 'regen':
            break;
        case 'order':
            result.operation = parts[1];
            result.index = parseInt(parts[2]);
            break;
        case 'place':
            result.name = parts[1];
            result.x = parseInt(parts[2]);
            result.y = parseInt(parts[3]);
            break;
        case 'move':
            result.x = parseInt(parts[1]);
            result.y = parseInt(parts[2]);
            result.to_x = parseInt(parts[3]);
            result.to_y = parseInt(parts[4]);
            break;
        case 'claim':
            result.index = parseInt(parts[1]);
            break;
        case 'withdraw':
            result.amount = parseFloat(parts[1]); // Changed to parseFloat for handling larger numbers
            break;
        case 'buyslot':
            result.x = parseInt(parts[1]);
            result.y = parseInt(parts[2]);
            break;
        case 'buydeal':
            result.name = parts[1];
            break;
        case 'activateb':
            result.index = parseInt(parts[1]);
            break;
        case 'invupgrade':
            break;
        case 'business':
            result.event = parts[1];
            result.id = parseInt(parts[2]);
            result.i = parseInt(parts[3]);
            break;
        default:
            result = { requestType: 'Unknown' };
            break;
    }

    return result;
}
  handleResultCode(code){
      console.log(this.requestQueue[0])
      if (code == 200){
          let request = this._decipherRequest(this.requestQueue[0])
          if (request.requestType == 'use') {
              tiles[request.x][request.y].use(request.name)
          } else if (request.requestType == 'activateb'){
              player.realActivateBooster()
          } else if (request.requestType == 'place' && RES.buildingNames.bush.includes(request.name)){
              tiles[request.x][request.y].use()
          }
      }
      console.log('код',code)
      this.requestQueue.shift()
  }
  send(request) {
    // if (this.socket.readyState === WebSocket.OPEN) {
    //     this.socket.send(request);
    //     if (request.split('/')[0] != 'connect'){// и реген
    //       this.requestQueue.push(request);
    //     }
    //     console.log(this.requestQueue)
    // }
  }
  	regenPlayer(data){
		player._inventory = data.player.Inventory.map
        console.log(player._inventory)
        player._inventory['chickenFeed'] = 10
		player._money = data.player.money
		player.updateMoney()

        player._spinItems = data.player.spin.items
        player._isSpinActivated = data.player.spin.activated
        player._spinTimeStamp = data.player.spin.generateTimeStamp
        for (let i = 0; i < player._spinItems.length; i++) {
            const el = player._spinItems[i];
            if (el.item == data.player.spin.drop.item && el.amount == data.player.spin.drop.amount){
                player._spinDropIndex = i
                break
            }
        }
      	player._orderArr = data.player.orders
  	}
  	initGameSession(data){
    	console.log(data)
      	data.world.tileArray.forEach(el => {
          	tiles[el.x][el.y].createBuilding(el.name)
          	if (RES.buildingNames.bakery.includes(el.name)){
              	el.slots.forEach(slot => {
                  	tiles[el.x][el.y]._structure.addSlot(slot)
              	});
              	tiles[el.x][el.y]._structure.update()
          	} else if (RES.buildingNames.garden.includes(el.name)){
				if (el.slots[0].workName != 'none')
					tiles[el.x][el.y]._structure.addSlot(el.slots[0])
			} else if (RES.buildingNames.animalPen.includes(el.name)){
				for (let i = 0; i < el.integerData; i++) {
					tiles[el.x][el.y]._structure.addAnimal()
				}
				if (el.slots[0])
					tiles[el.x][el.y]._structure.setTime(el.slots[0].workStartTimeStamp)
			} else if (RES.buildingNames.bush.includes(el.name)){
                //возможно проверка на мертвый куст
                console.log(tiles[el.x][el.y]._structure._timeToFinish)
				tiles[el.x][el.y]._structure.setProperties(el.slots[0].workStartTimeStamp, el.integerData)
			}
		});
		this.regenPlayer(data)
		this.gameSessionPromiseResolve()
  	}
}

const socketClient = new SocketClient();

export default socketClient;

class Init {
    constructor() {
    }
    async initMap(){
        const Tile = (await import("./gameClasses/tile/tile.js")).default;

        const loadText = async (url) => {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            const text = await response.text();
            const lines = text.split('\n');
            const mapArray = lines.map(line => 
                line.trim().split(' ').map(Number)
            );
            const transposedArray = mapArray[0].map((_, colIndex) => mapArray.map(row => row[colIndex]));

            return transposedArray;
        };
        
        const map = await loadText(`client/assets/map/map.txt`);
        for (let i = 0; i < CVAR.tileRows; i++) {
            tiles[i] = new Array(CVAR.tileCols);
        }
        for (let i = 0; i < CVAR.tileRows; i++)
        {
            for (let j = 0; j < CVAR.tileCols; j++)
            {
                let tileCoords = Calc.indexToCanvas(i, j, CVAR.tileSide, CVAR.outlineWidth);
                // let tileCoords = {
                //   x: i * CVAR.tileSide,
                //   y: j * CVAR.tileSide
                // }
                // tiles[i][j] = new Tile(tileCoords.x, tileCoords.y, CVAR.tileSide, CVAR.tileSide, RES.map[(i + j) % 2]);
                tiles[i][j] = new Tile(tileCoords.x, tileCoords.y, CVAR.tileSide, CVAR.tileSide, RES.map[map[i][j]]);
            }
        }

        // socketClient.send(`connect/` + Math.ceil(Date.now() / 10000))
        socketClient.send(`connect/2357287`)

        console.log("map loaded")

        // await socketClient.gameSessionPromise;
        console.log("Game session initialized");
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
        function loadImage(src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        }
        
        // Функция для создания canvas с определенными размерами
        function createCanvas(width, height) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            return canvas;
        }
        
        // Функция для разбиения изображения на блоки 16x16
        async function splitImageToBlocks(imageSrc) {
            const img = await loadImage(imageSrc);
            const blocks = [];
            const blockSize = 16;
        
            const canvas = createCanvas(blockSize, blockSize);
            const ctx = canvas.getContext('2d');
        
            const cols = img.width / blockSize;
            const rows = img.height / blockSize;
        
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    ctx.clearRect(0, 0, blockSize, blockSize);
                    ctx.drawImage(img, x * blockSize, y * blockSize, blockSize, blockSize, 0, 0, blockSize, blockSize);
    
                    const blockImg = new Image();
                    blockImg.src = canvas.toDataURL();
                    blocks.push(blockImg);
                }
            }
            console.log(blocks.length)
            blocks.push(await loadImage(`client/assets/map/Water_1.png`));
        
            return blocks;
        }

        RES.map = await splitImageToBlocks(`client/assets/map/Grass.png`)
      }
  
      const loadAssets = async (type, name) => {
        const data = await loadJson(`client/assets/${name}/${name}.json`);
        if (type === "plants") {
          data.image = {};
          data.image.stages = {};
  
          const stagesPromises = Array.from({ length: 4 }).map(async (_, i) => {
            data.image.stages[i] = await loadImage(`client/assets/${name}/${name}_stage${i}.png`);
          });
          await Promise.all(stagesPromises);
        } else {
          data.image = await loadImage(`client/assets/${name}/${name}.png`);
        }
        if (!data.size){
          data.size = {
            w: data.sizex,
            h: data.sizey
          }
        }
        RES[type][name] = data;
      };
  
      try {
        await loadMapImages();
  
        const allAssetPromises = [];
        for (const type in RES.names) {
            RES.names[type].forEach((name) => {
            allAssetPromises.push(loadAssets(type, name));
          });
        }
        console.log(RES)
  
        await Promise.all(allAssetPromises);
        console.log('All resources loaded');
        // Возвращаем экземпляр класса Resources, чтобы его можно было использовать
        // после загрузки в других модулях
        await this.initMap();
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
  
  