import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import mouse from "../controller/mouse.js";
import Calc from "../../calc.js";
import CVAR from "../../globalVars/const.js";
import Buildable from "../building/buildable.js";
import RES from "../../resources.js";
import Phantom from "../sprite/phantom.js";

class Shop{
    constructor() {
        const shopWrap = document.getElementById('shop-wrap');
        const shopBar = document.getElementById('shop-bar');
        shopWrap.addEventListener('click', function(event) {
            if (!(event.target.closest('#shop-bar') || event.target.closest('#shop-list'))) {
                const slidableDiv = document.getElementById('shop');
                slidableDiv.classList.add('slide-out');
                setTimeout(() => {
                    document.getElementById("shop-wrap").style.display = "none";
                }, 450);
            }
        });
        this.drawBuildingShop();

        document.getElementById("buy-building").onclick = () => {
            this.drawBuildingShop();
        }

        document.getElementById("buy-plant").onclick = () => {
            this.drawPlantShop();
        }

        document.getElementById("buy-animal").onclick = () => {
            this.drawAnimalShop();
        }
    
        document.getElementById("open-shop").onclick = () => {
            const slidableDiv = document.getElementById('shop');
            slidableDiv.classList.remove('slide-out');
            GVAR.closeAllWindows();
            document.getElementById("shop-wrap").style.display = "flex";
        }        

        document.getElementById("closeStash").onclick = () => {
            document.getElementById("stash-wrap").style.display = "none";
        }
        document.getElementById("open-stash").onclick = () => {
            GVAR.closeAllWindows();
            document.getElementById("stash-wrap").style.display = "flex";
            this.drawStash();
        }
    }
    drawBuildingShop(){
        const shop = document.getElementById('shop-list');
        shop.innerHTML = '';
        RES.names.buildings.forEach(building => {
            const shopItem = document.createElement('div');
            const img = document.createElement('img');
            img.src = `client/assets/${building}/${building}.png`
            img.className = "item-image"
            const price = document.createElement('h3');
            price.innerText = `${RES.buildings[building].price}$`;
            shopItem.appendChild(img)
            shopItem.appendChild(price)
            shopItem.addEventListener("touchstart", function(e) {
                document.getElementById("shop-wrap").style.display = "none";
                player._phantomBuilding = {
                    cost: RES.buildings[building].price,
                    structureType: 'building'
                }
                let pos = Calc.indexToCanvas(mouse._mapPos.i, mouse._mapPos.j, CVAR.tileSide, CVAR.outlineWidth)
                player._phantomBuilding.building = new Buildable(pos.x, pos.y, building)
                player._phantomBuilding.building._isMoving = true
                GVAR.phantomBildingArr.push(player._phantomBuilding.building)
                mouse._isDragging = true
                mouse.onMouseMove(e)
            });
            shopItem.className = "shop-item";
            shop.appendChild(shopItem);
        });
    }
    drawPlantShop(){
        const shop = document.getElementById('shop-list');
        shop.innerHTML = '';
        RES.names.plants.forEach(plant => {
            const shopItem = document.createElement('div');
            const img = document.createElement('img');
            img.src = `client/assets/${plant}/${plant}.png`
            img.className = "item-image"
            const price = document.createElement('h3');
            price.innerText = `${RES.plants[plant].price}$`;
            shopItem.appendChild(img)
            shopItem.appendChild(price)
            shopItem.addEventListener("click", function(e) {
                if (player.canBuy(RES.plants[plant].price, 1))
                {
                    player.buy(RES.plants[plant].price)
                    player.pushInventory(plant, 1)
                }else{
                    console.log("нет денег или места в инвентаре")
                }
            });
            shopItem.className = "shop-item";
            shop.appendChild(shopItem);
        });
    }
    drawAnimalShop(){
        const shop = document.getElementById('shop-list');
        shop.innerHTML = '';
        RES.names.animals.forEach(animal => {
            const shopItem = document.createElement('div');
            const img = document.createElement('img');
            img.src = `client/assets/${animal}/${animal}.png`
            img.className = "item-image"
            const price = document.createElement('h3');
            price.innerText = `${RES.animals[animal].price}$`;
            shopItem.appendChild(img)
            shopItem.appendChild(price)
            shopItem.addEventListener("touchstart", function(e) {
                document.getElementById("shop-wrap").style.display = "none"; //везде заменить на плавное закрывание
                player._phantomBuilding = {
                    cost: RES.animals[animal].price,
                    structureType: 'animal'
                }
                let pos = Calc.indexToCanvas(mouse._mapPos.i, mouse._mapPos.j, CVAR.tileSide, CVAR.outlineWidth)
                player._phantomBuilding.building = new Phantom(pos.x, pos.y, RES.animals[animal].size, animal, RES.animals[animal].image)
                player._phantomBuilding.building._isMoving = true
                GVAR.phantomBildingArr.push(player._phantomBuilding.building)
                mouse._isDragging = true
                mouse.onMouseMove(e)
            });
            shopItem.className = "shop-item";
            shop.appendChild(shopItem);
        });
    }
    drawStash()
    {
        const stashList = document.getElementById('stash-list')
        stashList.innerHTML = "";

        for (let item in player._inventory)
        {
            if (player._inventory[item] > 0)
            {
                const div = document.createElement('div');
                div.className = 'stash-item'
                const img = document.createElement("img")
                img.src = `client/assets/${item}/${item}.png`
                img.className = "item-image"
                div.appendChild(img)

                const name = document.createElement('h3');
                name.innerHTML = player._inventory[item];    
                div.appendChild(name);
                stashList.appendChild(div);
            }
        }
    }
}
const shop = new Shop();
export default shop;
