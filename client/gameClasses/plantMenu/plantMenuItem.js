import Menu from "../menu/menu.js";
import { ctx } from "../../globalVars/canvas.js";
import GVAR from "../../globalVars/global.js";
import player from "../player/player.js";
import tiles from "../../globalVars/tiles.js";


export default class PlantMenuItem extends Menu{
    constructor(x, y, w, h, item, amount) {
        super(x, y, w, h);
        this._item = item;
        this._amount = amount;
        this._image = GVAR.plants[item].image;
    }
    draw()
    {
        ctx.fillStyle = "rgb(100,100,100)";
        ctx.fillRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);

        ctx.drawImage(this._image, this._rect.x, this._rect.y, this._rect.w, this._rect.h);

        ctx.fillStyle = "rgb(0,255,0)";
        ctx.font = "3px sans-serif"
        ctx.fillText(this._amount, this._rect.x, this._rect.y + 2, 100);

        ctx.fillStyle = "rgb(50,50,50)";
        ctx.fillRect(this._rect.x, this._rect.y + this._rect.h - 2, this._rect.w, 2);

        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = "2.2px sans-serif"
        ctx.fillText(this._item, this._rect.x, this._rect.y + this._rect.h, 100);
    }
    onClick()
    {
        // player._inventory[this._item]--;
        // tiles[player._chosenTile.i][player._chosenTile.j]._plant = this._item;
        // tiles[player._chosenTile.i][player._chosenTile.j].createPlant();
        if (tiles[player._chosenTile.i][player._chosenTile.j].isCanPut("bakery")){
            tiles[player._chosenTile.i][player._chosenTile.j].createBuilding("bakery"); //тут растение было
        }
    }
}