import GVAR from "../../globalVars/global.js";
import Sprite from "../sprite/sprite.js";
import PlantMenu from "../plantMenu/plantMenu.js";
import Plant from "../plant/plant.js";

export default class Tile extends Sprite{
    constructor(x, y, w, h, image)
    {
        super(x, y, w, h, image);
        this._plant = "none";
    }
    onClick()
    {  
        if (GVAR.UI[0] != null)
        {
            GVAR.UI.pop();
        }
        else if (this._plant == "none")
        {
            GVAR.UI.push(new PlantMenu(this._rect.x, this._rect.y, 30, 30));
        }
    }
    createPlant()
    {
        GVAR.PlantArr.push(new Plant(this._rect.x, this._rect.y, this._rect.w, this._rect.h, this._plant));
    }
    plantCollected()
    {
        this._plant = "none";
    }
}