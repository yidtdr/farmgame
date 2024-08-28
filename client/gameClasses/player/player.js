class Player{
    constructor()
    {
        this._money = 100;
        this._chosenTile = {i: -1, j: -1};
        this._inventory = new Array();
        this._inventorySize = 50;
        this._maxOrderAmount = 6;
        this._ordersArr = new Array();
        this._networth = 0;
        this._phantomStructure = "none";
        this._spinItems = new Array();
        this._isSpinActivated = false;
        this._spinDropIndex = 0
        this._spinTimeStamp = 0
        this._boostersArr = new Array()
        this._activBoostersArr = new Array()
        this._growBooster = {
            type: 'GrowSpeed',
            boosterAmount: 1,
            timeStamp: 0,
            timeToEnd: 0
        }
        this._workBooster = {
            type: 'WorkSpeed',
            boosterAmount: 1,
            timeStamp: 0,
            timeToEnd: 0
        }
        this._moneyBooster = {
            type: 'OrderMoney',
            timeStamp: 0,
            timeToEnd: 0
        }
    }
    upgradeInventory(){
        this._inventorySize += 10 //временное
        this.buy(10)
    }
    canActivateBooster(id){
        let boost = this._boostersArr[id]
        this._activBoostersArr.forEach(booster => {
            if (boost.type == booster.type)
                return false
        });
    }
    activateBooster(id){
        let boost = this._boostersArr[id]
        this._boostersArr.splice(id, 1)
        if (boost.type == 'WorkSpeed'){
            this._workBooster.boosterAmount = boost.amount
            this._workBooster.timeToEnd = boost.time
            this._activBoostersArr.push(this._workBooster)
        } else if (boost.type == 'GrowSpeed'){
            this._growBooster.boosterAmount = boost.amount
            this._growBooster.timeToEnd = boost.time
            this._activBoostersArr.push(this._growBooster)
        } else if (boost.type == 'OrderMoney'){
            //запрос на реген идет в кнопке
            this._moneyBooster.timeToEnd = boost.time
            this._activBoostersArr.push(this._moneyBooster)
        }
    }
    realActivateBooster(){
        for (let i = 0; i < this._activBoostersArr.length; i++) {
            const booster = his._activBoostersArr[i];
            if (booster.timeStamp == 0){
                booster.timeStamp = Date.now() + booster.timeToEnd
                const timer = setInterval(() => {
                    booster.timeToEnd = (booster.timeStamp - Date.now() > 0 ? (booster.timeStamp - Date.now()) : 0);
                    if (booster.timeToEnd == 0)
                        booster.boosterAmount = 1
                        booster.timeStamp = 0;
                        clearInterval(timer)
                }, 1000);
                break
            }
        }
    }
    canBuy(cost, count){
        return (this._money >= cost && this.getInvFullness() >= count)
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
        console.log(this._inventory)
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
