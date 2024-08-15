import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import socketClient from "../../init.js";

class BoosterMenu{
    constructor() {
        this.drawMenu();

        document.getElementById("close-booster-menu").onclick = () => {
            document.getElementById("booster-menu-wrap").style.display = "none";
        }
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
    renderActivBoosters(){
        const activBoosters = document.getElementById('activ-boosters');
        if (player._activBoostersArr.length != 0){
            const text = document.createElement('h3')
            text.innerText = 'Активные бустеры:'
            text.className = 'queue-text' // в будущем изменить
            activBoosters.appendChild(text)
        }
        player._activBoostersArr.forEach(booster => {
            const activBooster = document.createElement('div')
            const name = document.createElement('h3')
            name.innerText = booster.type
            name.className = 'queue-text' // в будущем изменить
            const amount = document.createElement('h3')
            amount.innerText = 'x' + booster.boosterAmount
            amount.className = 'queue-text' // в будущем изменить
            const time = document.createElement('h3')
            time.innerText = this._formatTime(booster.timeToEnd)
            time.className = 'queue-text' // в будущем изменить

            activBooster.appendChild(name)
            activBooster.appendChild(amount)
            activBooster.appendChild(time)
            activBoosters.appendChild(activBooster)
        });
    }
    drawMenu() {
        this.renderActivBoosters();
        const list = document.getElementById('booster-list');
        list.innerHTML = '';
        for (let i = 0; i < player._boostersArr.length; i++) {
            const booster = player._boostersArr[i];
            const boostDiv = document.createElement('div');
            boostDiv.className = 'stash-item'; //в будущем изменить
    
            const img = document.createElement('img');
            img.className = 'item-image';
            // img.src = `client/assets/boosterImg/${booster.type}.png`
            img.src = `client/assets/pizdec/pizdec.png`; //пока так
            boostDiv.appendChild(img);
    
            const amount = document.createElement('h3');
            amount.innerText = 'x' + booster.amount;
            amount.className = 'queue-text'; // в будущем изменить
            boostDiv.appendChild(amount);
    
            const time = document.createElement('h3');
            time.innerText = this._formatTime(booster.time);
            time.className = 'queue-text'; // в будущем изменить
            boostDiv.appendChild(time);
    
            const button = document.createElement('button');
            button.innerText = 'Activate';
            button.className = 'booster-button';
    
            if (player.canActivateBooster(i)) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
            button.addEventListener('click', () => {
                player.activateBooster(i)
                socketClient.send(`activateb/${i}`)
                if (booster.type == 'OrderMoney')
                    socketClient.send(`regen`)
            });

            boostDiv.appendChild(button);
    
            list.appendChild(boostDiv);
        }
    }
    
}
const boosterMenu = new BoosterMenu();
export default shop;
