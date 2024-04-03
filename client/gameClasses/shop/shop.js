import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";

class Shop{
    constructor() {
        const shop = document.getElementById('shop');
        for (let plant in GVAR.plants)
        {
            const button = document.createElement('button');
            button.innerText = `Buy ${plant} seeds`;
            button.onclick = () => {
                this.buy(plant);
            }
            button.className = "buybutton";
            shop.appendChild(button);
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

        for (let item in player._stash)
        {
            if (player._stash[item] > 0)
            {
                const div = document.createElement('div');
                div.className = 'stash-item'
                div.style.backgroundImage = `url(${GVAR.plants[item].image.src})`;
                const name = document.createElement('h3');
                name.innerHTML = item;
                const sellWrap = document.createElement('div');
                sellWrap.className = 'sell-wrap';
                const amount = document.createElement('input');
                amount.className = 'stash-slider';
                amount.type = 'range';
                amount.min = 1;
                amount.max = player._stash[item];
                amount.value = 1;
                const button = document.createElement('button');
                button.className = 'stash-sell';
                button.innerText = 'Sell';
                button.onclick = () => {
                    this.sell(item, parseInt(amount.value)  );
                    this.drawStash();
                }
                div.appendChild(name);
                sellWrap.appendChild(amount);
                sellWrap.appendChild(button);
                div.appendChild(sellWrap);
                stashList.appendChild(div);
            }
        }
    }
    sell(plant, amount)
    {
        if (player._stash[plant] >= amount)
        {
            player._stash[plant] -= amount;
            player._money += GVAR.plants[plant].moneyReward * amount;
            player.updateMoney();
        }
    }
    buy(plant)
    {
        if (player._money > GVAR.plants[plant].shopCost)
        {
            player._money-=GVAR.plants[plant].shopCost;
            player._inventory[plant]++;
            player.updateMoney();
        }
        else
        {
            console.log("no money")
        }
    }
}
const shop = new Shop();
export default shop;