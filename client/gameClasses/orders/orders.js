import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import socketClient from "../../init.js";

class Orders {
    constructor() {
        this.renderOrders();
        document.getElementById("closeOrders").onclick = () => {
            document.getElementById("orders-wrap").style.display = "none";
        }
        document.getElementById("open-orders").onclick = () => {
            GVAR.closeAllWindows()
            document.getElementById("orders-wrap").style.display = "flex";
            this.renderOrders();
        }
        this.isShowTimer = false
    }
    verifyOrder(order) {
        for (let item in order.orderItems) {
            if (order.orderItems[item] > player._inventory[item]) return false;
        }
        return true;
    }
    completeOrder(order) {
        if (this.verifyOrder(order)) {
            player._orderArr[order.index].timeStamp = Math.floor(Date.now()/1000) + 120
            player._money += order.orderPrice;
            player.updateMoney();
            for (let item in order.orderItems) {
                player._inventory[item] -= order.orderItems[item]; 
            }
            this.showTimer(order);
            this.renderOrders();
            document.getElementById('order-details').innerHTML = "";
            socketClient.send(`order/complete/${order.index}`)
            // socketClient.send(`regen`)
        }
    }

    rerollOrder(order){
        player._orderArr[order.index].timeStamp = Math.floor(Date.now()/1000) + 120 //60-sec
        socketClient.send(`order/reroll/${order.index}`)
        // socketClient.send(`regen`)
        this.showTimer(order);
        this.renderOrders()
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
    showTimer(order){
        const orderDetails = document.getElementById('order-details');
        orderDetails.innerHTML = "";
        const timer = document.createElement('h3')
        timer.className = 'drop-list-text'
        orderDetails.appendChild(timer)
        if (order.timeStamp > Math.floor(Date.now()/1000))
            timer.innerText = this._formatTime(order.timeStamp - Math.floor(Date.now()/1000))
        else
            this.showOrderDetails(order)
    }
    showOrderDetails(order) {
        console.log(order.timeStamp, Math.floor(Date.now()/1000))
        if (order.timeStamp > Math.floor(Date.now()/1000)){
            this.isShowTimer = true
            this.showTimer(order)
            return
        } else {
            this.isShowTimer = false
        }
        const orderDetails = document.getElementById('order-details');
        orderDetails.innerHTML = "";

        const orderPrice = document.createElement("h3");
        orderPrice.className = "order-price";
        orderPrice.innerText = `Cost: ${order.orderPrice}`;

        const orderRes = document.createElement("div");
        orderRes.className = "order-res";
        for (let item in order.orderItems) {
            const res = document.createElement("div");
            res.className = "res-wrap";
            // res.id = `res${item}`;

            const resImg = document.createElement("img");
            resImg.src = `client/assets/${item}/${item}.png`;
            resImg.className = "res-img";

            const amount = document.createElement("h3");
            amount.innerText = `${player._inventory[item]}/${order.orderItems[item]}`;
            amount.className = `${player._inventory[item] >= order.orderItems[item] ? "unlocked-item" : ""}`;

            res.appendChild(resImg);
            res.appendChild(amount);
            orderRes.appendChild(res);
        }

        const completeButton = document.createElement("button");
        completeButton.className = `complete-order ${this.verifyOrder(order) ? "unlocked" : ""}`;
        completeButton.innerText = "Complete";
        completeButton.onclick = () => {
            this.completeOrder(order);
        };

        const rerollButton = document.createElement("button");
        rerollButton.className = `complete-order ${this.verifyOrder(order) ? "unlocked" : ""}`;
        rerollButton.innerText = "reroll";
        rerollButton.onclick = () => {
            this.rerollOrder(order);
        };

        orderDetails.appendChild(orderPrice);
        orderDetails.appendChild(orderRes);
        orderDetails.appendChild(completeButton);
        orderDetails.appendChild(rerollButton);
    }

    renderOrders() {
        console.log('order')
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = "";
        for (let i in player._orderArr) {
            const ord = player._orderArr[i];
            ord.index = i
            const order = document.createElement("div");
            order.className = "order";
            order.style.backgroundImage = `url(client/assets/pizdec/pizdec.png)`; // Устанавливаем фоновое изображение

            order.onclick = () => {
                this.showOrderDetails(ord);
            };

            ordersList.appendChild(order);
        }
    }
}

export const orderManager = new Orders();
