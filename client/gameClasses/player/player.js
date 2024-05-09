class Player{
    constructor()
    {
        this._money = 10;
        this._chosenTile = {i: -1, j: -1};
        this._inventory = new Array();
        this._inventory["PSHENO"] = 10;
        this._inventory["PIZDEC"] = 5;
        //this._inventory["potato"] = 5;
        this._stash = new Array();
        this._stash['PIZDEC'] = 10;
        this._maxOrderAmount = 6;
        this._ordersArr = new Array();
        this._expLevel = 1;
        this.phantonBuilding = "none";
    }
    updateOrders(newOrders)
    {
        this._orderArr = newOrders;
    }
    updateMoney()
    {
        document.getElementById('money').innerText = `Money: ${this._money}`;
    }
    pushStash(plant, n)
    {
        this._stash[plant]?
        this._stash[plant]+= n
        :
        this._stash[plant] = n;
    }
}
const player = new Player();

export default player
