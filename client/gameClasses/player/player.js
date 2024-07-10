class Player{
    constructor()
    {
        this._money = 100;
        this._chosenTile = {i: -1, j: -1};
        this._inventory = new Array();
        this._inventory["pizdec"] = 9;
        this._inventory["wheat"] = 10;
        this._inventory["chickenFeed"] = 3;
        this._inventorySize = 20;
        this._maxOrderAmount = 6;
        this._ordersArr = new Array();
        this._networth = 0;
        this._phantomBuilding = "none";
        this._spinItems = new Array()
        this._isSpinActivated = false;
        this._spinDropIndex = 0
    }
    canBuy(cost, count){
        return (this._money >= cost && this.getInvFullness() >= count)
    }
    canBuy(cost){
        return (this._money >= cost)
    }
    buy(cost) {
        if (this._money >= cost){
            this._money -= cost;
            player.updateMoney();
            return true
        } else {
            return false
        }
    }
    getInvFullness(){
        let sum = 0;
        for (const el in this._inventory) {
            sum += this._inventory[el];
        }
        return this._inventorySize - sum
    }
    canCraft(item){
        for (const el in item.items) {
            if (item.items[el]>this._inventory[el]){
                return false
            }
        }
        return true
    }
    craftItem(item){
        for (const el in item.items) {
            this._inventory[el] -= item.items[el]
        };
    }
    updateOrders(newOrders)
    {
        this._orderArr = newOrders;
    }
    updateMoney()
    {
        document.getElementById('money').innerText = `Money: ${this._money}`;
    }
    pushInventory(item, n)
    {
        this._inventory[item]?
        this._inventory[item]+= n
        :
        this._inventory[item] = n;
        console.log(this._inventory)
    }
}
const player = new Player();

export default player
