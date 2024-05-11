import GVAR from "../../globalVars/global.js";
import { ctx } from "../../globalVars/canvas.js";
import CVAR from "../../globalVars/const.js";
import Calc from "../../calc.js";
import tiles from "../../globalVars/tiles.js";
import player from "../player/player.js";
import Sprite from "../sprite/sprite.js";
import ASSETS from "../../globalVars/assets.js";

export default class Plant extends Sprite{
    constructor(x, y, w, h, plantType)
    {
        super(x, y, w, h);
        console.log(plantType)
        this._image = ASSETS.pictures[plantType].image
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
        }
        else
        {
            console.log(`notgrown ${this._timeToGrow / 1000}`)
        }
    }
    move(pos) {
        this._x = pos.x;
        this._y = pos.y;
    }
}