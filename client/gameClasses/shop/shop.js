import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import mouse from "../controller/mouse.js";
import Calc from "../../calc.js";
import CVAR from "../../globalVars/const.js";
import Buildable from "../building/buildable.js";
import RES from "../../resources.js";

class Shop{
    constructor() {
        const shop = document.getElementById('shop-list');
        document.getElementById("buy-building").onclick = () => {
            shop.innerHTML = '';
            RES.names.buildings.forEach(building => {
                const button = document.createElement('button');
                button.innerText = `Buy ${building}`;
                button.addEventListener("touchstart", function(e) {
                    document.getElementById("shop-wrap").style.display = "none";
                    player._phantomBuilding = {
                        cost: RES.buildings[building].price
                    }
                    let pos = Calc.indexToCanvas(mouse._mapPos.i, mouse._mapPos.j, CVAR.tileSide, CVAR.outlineWidth)
                    player._phantomBuilding.building = new Buildable(pos.x, pos.y, building)
                    player._phantomBuilding.building._isMoving = true
                    GVAR.phantomBildingArr.push(player._phantomBuilding.building)
                    mouse._isDragging = true
                    mouse.onMouseMove(e)
                });
                button.className = "buybutton";
                shop.appendChild(button);
            });
        }

        document.getElementById("buy-plant").onclick = () => {
            shop.innerHTML = '';
            RES.names.plants.forEach(plant => {
                const button = document.createElement('button');
                button.innerText = `Buy ${plant}`;
                button.addEventListener("touchstart", function(e) {
                    if (player._money >= RES.plants[plant].price)
                    {
                        player.buy(RES.plants[plant].price)
                        player.pushInventory(plant, 1)
                    }
                    else
                    {
                        console.log("no money")
                    }
                });
                button.className = "buybutton";
                shop.appendChild(button);
            });
        }
    
        document.getElementById("closeShop").onclick = () => {
            document.getElementById("shop-wrap").style.display = "none";
        }
        document.getElementById("open-shop").onclick = () => {
            GVAR.UI.pop();
            document.getElementById("shop-wrap").style.display = "flex";
            document.getElementById("stash-wrap").style.display = "none";
        }        

        document.getElementById("closeStash").onclick = () => {
            document.getElementById("stash-wrap").style.display = "none";
        }
        document.getElementById("open-stash").onclick = () => {
            GVAR.UI.pop();
            document.getElementById("shop-wrap").style.display = "none";
            document.getElementById("stash-wrap").style.display = "flex";
            this.drawStash();
        }
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