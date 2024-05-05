import Sprite from "../sprite/sprite.js";
import GVAR from "../../globalVars/global.js";
import { ctx } from "../../globalVars/canvas.js";
import CVAR from "../../globalVars/const.js";
import Calc from "../../calc.js";
import tiles from "../../globalVars/tiles.js";
import player from "../player/player.js";
import Buildable from "../building/buildable.js";

export default class Plant extends Buildable{
    constructor(x, y, w, h, plantType)
    {
        super(x, y, w, h, GVAR.plants[plantType].image);
        this._plantType = plantType;
        this._plantTimeStamp = Date.now();
        this._growTimeStamp = Date.now() + GVAR.plants[plantType].growTime * 1000;
        this._timeToGrow = GVAR.plants[plantType].growTime * 1000;
        this._grown = false;
    }
    draw(){
        if (this._grown)
        {
            ctx.shadowBlur = 20;
            ctx.shadowColor = "yellow";
        }
        ctx.drawImage(this._image, this._x, this._y, this._w, this._h);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgb(0,200,0)"
        ctx.fillRect(this._rect.x, this._rect.y - this._rect.h / 3, this._rect.w * this._timeToGrow /(1000 * GVAR.plants[this._plantType].growTime), CVAR.tileSide / 5);
    }
    updateGrowTime()
    {
        this._timeToGrow = ((this._growTimeStamp - Date.now()) > 0 ? (this._growTimeStamp - Date.now()) : 0);
        if (this._timeToGrow == 0)
        {
            this._grown = true;
        }
    }
    collect()
    {
        if (this._grown)
        {
            const index = Calc.CanvasToIndex(this._rect.x, this._rect.y, CVAR.tileSide, CVAR.outlineWidth);
            tiles[player._chosenTile.i][player._chosenTile.j]._structure.plantCollected();
            player.pushStash(this._plantType, GVAR.plants[this._plantType].collectAmount);
            GVAR.PlantArr = GVAR.PlantArr.filter((el) => el !== this);
        }
        else
        {
            console.log(`notgrown ${this._timeToGrow / 1000}`)
        }
    }
}