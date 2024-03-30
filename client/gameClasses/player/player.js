class Player{
    constructor()
    {
        this._money = 10;
        this._chosenTile = {i: -1, j: -1};
        this._inventory = new Array();
        this._inventory["PSHENO"] = 10;
        this._inventory["PIZDEC"] = 5;
        this._stash = new Array();
        this._stash['PIZDEC'] = 10;
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