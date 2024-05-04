import GVAR from "../../globalVars/global.js";
import Sprite from "../sprite/sprite.js";
import PlantMenu from "../plantMenu/plantMenu.js";
import Plant from "../plant/plant.js";
import tiles from "../../globalVars/tiles.js";
import Calc from "../../calc.js";
import CVAR from "../../globalVars/const.js";
import Building from "../building/building.js";
import ASSETS from "../../globalVars/assets.js";
import { ctx } from "../../globalVars/canvas.js";

export default class Field extends Sprite{
    constructor(x, y, w, h)
    {
        super(x, y, w, h);
        this._plant = "none";
        this._image = ASSETS.field;
        this._isMoving = false;
        this._prevPosition = {
            i: -1,
            j: -1
        }
    }
    draw(){
        ctx.drawImage(this._image, this._x, this._y, this._w, this._h);
        ctx.shadowBlur = 0;
    }
    onClick()
    {
        if (GVAR.UI[0] != null)
        {
            GVAR.UI.pop();
        }
        else if (this._plant == "none")
        {
            GVAR.UI.push(new PlantMenu(this._x, this._y, 30, 30));
        } else {
            this._plant.collect();
        }
    }
    createPlant(type)
    {
        this._plant = new Plant(this._x, this._y, this._w, this._h, type)
        GVAR.PlantArr.push(this._plant);
    }
    plantCollected()
    {
        this._plant = "none";
    }

}