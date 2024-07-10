import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import RES from "../../resources.js";

class FieldMenu{
    constructor() {
        document.getElementById("close-field-menu").onclick = () => {
            document.getElementById("field-menu-wrap").style.display = "none";
        }
        this.field = 'none'
    }
    show(field){
        this.field = field
        GVAR.closeAllWindows()
        document.getElementById("field-menu-wrap").style.display = "flex";
        this.renderPlants()
    }
    _formatTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secs = seconds % 60;
    
        let result = [];
        if (hours > 0) {
            result.push(hours + 'ч');
        }
        if (minutes > 0) {
            result.push(minutes + 'м');
        }
        if (secs > 0 || (hours === 0 && minutes === 0 && secs === 0)) {
            result.push(secs + 'с');
        }
        return result.join(' ');
    }
    renderPlants(){
        const fieldImg = document.getElementById('field-img')
        fieldImg.src = `client/assets/field/field.png`
        fieldImg.className = 'menu-big-img'
        const fieldMenuList = document.getElementById('field-menu-list');
        fieldMenuList.innerHTML = ""
        for (let plant in RES.names.plants)
        {
            const craft = document.createElement("div")
            craft.className = "craft"
            craft.id = `${plant}-craftItem`

            const craftImg = document.createElement("div")
            craftImg.style.backgroundImage = `url(client/assets/${plant}/${plant}.png)`
            craftImg.className = "craft-item-image"
            const amount = document.createElement("h3")
            amount.innerText = player._inventory[plant]
            amount.className = 'queue-text' //потом замениться

            const isIntersecting = (rect1, rect2) => {
                return (
                    rect1.left + rect1.width/2 < rect2.right &&
                    rect1.right - rect1.width/2 > rect2.left &&
                    rect1.top + rect1.height/2 < rect2.bottom &&
                    rect1.bottom - rect1.height/2> rect2.top
                );
            };
            const thisMenu = this;
            const field = this.field;
            craftImg.addEventListener('touchstart', function (e) { //добавить штуку с запретом крафта сюда и в здание, везде показывать дроп меню но картинку серую
                e.preventDefault();
                const clone = this.cloneNode(true);
                const chosenElem = craft.id.substring(0, craft.id.indexOf('-'));
                clone.classList.add('clone-image');
                document.body.appendChild(clone);
    
                const moveAt = (pageX, pageY) => {
                    clone.style.left = pageX - clone.offsetWidth / 2 + 'px';
                    clone.style.top = pageY - clone.offsetHeight / 2 + 'px';
                    console.log("move", pageX, pageY);
                };
    
                const touch = e.touches[0];
                moveAt(touch.pageX, touch.pageY);
    
                const onTouchMove = (event) => {
                    if (!isIntersecting(clone.getBoundingClientRect(),craft.getBoundingClientRect()))
                        document.getElementById('drop-list').style.display = 'none';
                    const touch = event.touches[0];
                    moveAt(touch.pageX, touch.pageY);
                };
                const onTouchEnd = () => {
                    document.removeEventListener('touchmove', onTouchMove);
                    const cloneRect = clone.getBoundingClientRect();
                    const visualRect = document.getElementById('building-visual').getBoundingClientRect();
                    if (isIntersecting(cloneRect, visualRect)) {
                        player._inventory[chosenElem] -= 1;
                        field.createPlant(chosenElem)
                    }
                    clone.remove();
                };
                
                document.addEventListener('touchmove', onTouchMove);
                document.addEventListener('touchend', onTouchEnd, { once: true });
            });

            craft.addEventListener('touchstart', (event) => {
                let product = craft.id.substring(0, craft.id.indexOf('-'));
                const dropList = document.createElement("div")
                dropList.id = 'drop-list'
                dropList.className = "craft-drop-list"
                const dropName =  document.createElement("h3")
                dropName.innerText = product
                dropName.className = 'drop-list-text'
                dropList.appendChild(dropName)

                const dropTime =  document.createElement("h3")
                dropTime.innerText = this._formatTime(RES.buildings[type].workTypes[product].timeToFinish)
                dropTime.className = 'drop-list-text'
                dropList.appendChild(dropTime)

                for (let item in RES.buildings[type].workTypes[product].items){
                    const dropItem = document.createElement("div")
                    dropItem.className = "drop-item"
                    const img = document.createElement("img")
                    img.src = `client/assets/${item}/${item}.png`
                    img.className = 'drop-list-img'
                    
                    const itemText = document.createElement("h3")
                    itemText.className = 'drop-items-amount';
                    const playerItemAmount = player._inventory[item];
                    const requiredItemAmount = RES.buildings[type].workTypes[product].items[item];
                    itemText.innerText = `${playerItemAmount}/${requiredItemAmount}`;

                    if (playerItemAmount < requiredItemAmount) {
                        itemText.classList.add('insufficient');
                    }
                    dropItem.appendChild(img)
                    dropItem.appendChild(itemText)
                    dropList.appendChild(dropItem)
                }
                craft.appendChild(dropList)
                dropList.style.display = 'block';
            });
    
            craft.addEventListener('touchend', (event) => {
                document.getElementById('drop-list').remove()
            });

            craft.appendChild(craftImg)
            craft.appendChild(amount)

            fieldMenuList.appendChild(craft)
        }
    }
}
export const fieldMenu = new FieldMenu();