import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import RES from "../../resources.js";
import tiles from "../../globalVars/tiles.js";

class BuildingMenu{
    constructor() {
        document.getElementById("close-building-menu").onclick = () => {
            document.getElementById("building-menu-wrap").style.display = "none";
        }
    }
    show(type){
        GVAR.UI.pop();
        document.getElementById("orders-wrap").style.display = "none";
        document.getElementById("stash-wrap").style.display = "none";
        document.getElementById("shop-wrap").style.display = "none";
        document.getElementById("building-menu-wrap").style.display = "flex";
        this.renderCrafts(type)
    }
    renderCrafts(type){
        const buildingMenuList = document.getElementById('building-menu-list');
        buildingMenuList.innerHTML = ""
        let index = 0;
        for (let product in RES.buildings[type].workTypes)
        {
            index+=1
            const craft = document.createElement("div")
            craft.className = "craft"

            const craftImg = document.createElement("img")

            craftImg.src = `client/assets/${product}.png`
            craftImg.className = "item-image"

            const dropList = document.createElement("div")
            dropList.className = "craft-drop-list"

            for (let item in RES.buildings[type].workTypes[product].items){
                const dropItem = document.createElement("div")
                dropItem.className = "drop-item"
                
                const itemText = document.createElement("span")
                itemText.innerText = `${item}: ${RES.buildings[type].workTypes[product].items[item]}`
                dropItem.appendChild(itemText)
                dropList.appendChild(dropItem)
            }
            craft.appendChild(craftImg)
            craft.appendChild(dropList)

            const createButton = document.createElement("button")
            createButton.id = `create${index}`
            createButton.className = `create-item ${player.canCraft(RES.buildings[type].workTypes[product]) ? "unlocked" : ""}`
            createButton.innerText = "Create"
            createButton.onclick = () => {
                tiles[player._chosenTile.i][player._chosenTile.j]._structure.startWork(RES.buildings[type].workTypes[product])
                this.renderCrafts(type)
            }
            craft.appendChild(createButton)
            buildingMenuList.appendChild(craft)
        }
    }
}
export const buildingMenu = new BuildingMenu();