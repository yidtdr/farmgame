import { ctx } from "../../globalVars/canvas.js";
import CVAR from "../../globalVars/const.js";
import Calc from "../../calc.js";
import tiles from "../../globalVars/tiles.js";
import player from "../player/player.js";
import Sprite from "../sprite/sprite.js";
import RES from "../../resources.js";

export default class Plant extends Sprite{
    constructor(x, y, w, h, plantType)
    {
        super(x, y, w, h);
        console.log(plantType)
        this._image = RES.plants[plantType].image.stages[0]
        this._plantType = plantType;
        this._plantTimeStamp = RES.plants[plantType].growTime * 1000;
        this._timeToGrow = this._plantTimeStamp;
        this._grown = false;
    }
    draw(){
        if (this._grown)
        {
            ctx.shadowBlur = 20;
            ctx.shadowColor = "yellow";
        }
        const out = (this._image.height - 16 * this._h/CVAR.tileSide)*CVAR.tileSide/16 //смещение вверх из-за размера картинки
        ctx.drawImage(this._image, this._x, this._y - out, this._w, this._h + out);
        ctx.shadowBlur = 0;
    }
    updateGrowTime()
    {
        this._image = RES.plants[this._plantType].image.stages[Math.trunc(3-this._timeToGrow*3/this._plantTimeStamp)]
        this._timeToGrow = (this._timeToGrow != 0 ? (this._timeToGrow - 1000) : 0);
        console.log(this._growTimeStamp - Date.now(), this._timeToGrow)
        if (this._growTimeStamp - Date.now() <= 0)
        {
            this._timeToGrow = 0
            this._grown = true;
        }
    }
    collect()
    {
        if (this._grown)
        {
            const index = Calc.CanvasToIndex(this._x, this._y, CVAR.tileSide, CVAR.outlineWidth);
            player.pushInventory(this._plantType, RES.plants[this._plantType].collectAmount);
            tiles[player._chosenTile.i][player._chosenTile.j]._structure._plant = 'none';
        }
    }
    move(pos) {
        this._x = pos.x;
        this._y = pos.y;
    }
}