import GVAR from "../../globalVars/global.js";
import Sprite from "../sprite/sprite.js";
import PlantMenu from "../plantMenu/plantMenu.js";
import Plant from "../plant/plant.js";
import tiles from "../../globalVars/tiles.js";
import Calc from "../../calc.js";
import CVAR from "../../globalVars/const.js";
import Building from "../building/building.js";

export default class Tile extends Sprite{
    constructor(x, y, w, h, image)
    {
        super(x, y, w, h, image);
        this._plant = "none";
        this._building = "none";
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
    isCanPut(type){
        let size = GVAR.buildings[type].size;
        let tileIndex = Calc.CanvasToIndex(this._x, this._y, CVAR.tileSide, CVAR.outlineWidth);
        if (tileIndex.i+size.h>CVAR.tileRows-1 || tileIndex.j+size.w>CVAR.tileCols-1)
            return false;
        for (let i = tileIndex.i; i < tileIndex.i + size.w; i++) {
            for (let j = tileIndex.j; j < tileIndex.j + size.h; j++) {
                if (tiles[i][j]._plant!="none" || tiles[i][j]._building!="none") { //в будущем растения не будет
                    console.log(i,j,tiles[i][j]._building, tiles[i][j]._plant)
                    return false;
                }
            }
        }
        return true;
    }
    createBuilding(type)
    {
        let tileIndex = Calc.CanvasToIndex(this._x, this._y, CVAR.tileSide, CVAR.outlineWidth);
        for (let i = tileIndex.i; i < tileIndex.i + GVAR.buildings[type].size.w; i++) {
            for (let j = tileIndex.j; j < tileIndex.j + GVAR.buildings[type].size.h; j++) {
                tiles[i][j]._building = type;
            }
        }
        GVAR.buildingArr.push(new Building(this._rect.x, this._rect.y, this._rect.w, this._rect.h, this._building));
    }
    buildingCollected()
    {
        this._building = "none";
    }
}