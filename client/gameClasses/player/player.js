class Player{
    constructor()
    {
        this._money = 100;
        this._chosenTile = {i: -1, j: -1};
        this._inventory = new Array();
        this._inventory["pizdec"] = 9;
        this._inventory["wheat"] = 10;
        this._inventorySize = 20;
        this._maxOrderAmount = 6;
        this._ordersArr = new Array();
        this._networth = 0;
        this._phantomBuilding = "none";
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
    }
}
const player = new Player();

export default player
