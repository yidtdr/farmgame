import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";

class Orders{
    constructor() {
        this.renderOrders()
        document.getElementById("closeOrders").onclick = () => {
            document.getElementById("orders-wrap").style.display = "none";
        }
        document.getElementById("open-orders").onclick = () => {
            GVAR.UI.pop();
            document.getElementById("orders-wrap").style.display = "flex";
            document.getElementById("stash-wrap").style.display = "none";
            document.getElementById("shop-wrap").style.display = "none";
        }        
    }
    verifyOrder(order){
        for(let item in order._info.items){
            if (order._info.items[item]>player._inventory[item]) return false
        }
        return true
    }
    completeOrder(order){
        if (this.verifyOrder(order)){
            player._orderArr = player._orderArr.filter((ord) => {
                return ord!=order
            })
            player._money+=order._info.cost
            player.updateMoney();
            for (let item in order._info.items){
                player._inventory[item] -= order._info.items[item]
            }
            this.renderOrders();
        }
    }
    renderOrders(){
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = ""
        let index = 0;
        for (let i in player._orderArr)
        {
            const ord = player._orderArr[i]
            index+=1
            const order = document.createElement("div")
            order.className = "order"
            const orderPrice = document.createElement("h3")
            orderPrice.className = "order-price"
            orderPrice.innerText = ord._info.cost
            const orderRes = document.createElement("div")
            orderRes.className = "order-res"
            for (let item in ord._info.items){
                const res = document.createElement("div")
                res.className = "res-wrap"
                res.id = `res${item}`
                const resImg = document.createElement("img")
                resImg.src = `client/${GVAR.plants[item].imageSrc}`
                resImg.className = "res-img"
                const amount = document.createElement("h3")
                amount.innerText = `${player._inventory[item]}/${ord._info.items[item]}`
                amount.className = `${player._inventory[item]>=ord._info.items[item] ? "unlocked-item": ""}`
                res.appendChild(resImg)
                res.appendChild(amount)
                orderRes.appendChild(res)
            }
            order.appendChild(orderPrice)
            order.appendChild(orderRes)
            const completeButton = document.createElement("button")
            completeButton.id = `complete${index}`
            completeButton.className = `complete-order ${this.verifyOrder(ord) ? "unlocked" : ""}`
            completeButton.innerText = "Complete"
            completeButton.onclick = () => {
                this.completeOrder(ord)
            }
            order.appendChild(completeButton)
            ordersList.appendChild(order)
        }
    }
}
export const orderManager = new Orders();