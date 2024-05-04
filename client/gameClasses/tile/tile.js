import GVAR from "../../globalVars/global.js";
import Sprite from "../sprite/sprite.js";
import tiles from "../../globalVars/tiles.js";
import Calc from "../../calc.js";
import CVAR from "../../globalVars/const.js";
import Building from "../building/building.js";
import Field from "../field/field.js";

export default class Tile extends Sprite{
    constructor(x, y, w, h, image)
    {
        super(x, y, w, h, image);
        this._structure = "none";
    }
    onClick()
    {  
        if (GVAR.UI[0] != null)
        {
            GVAR.UI.pop();
        }
        this._structure = new Field(this._x, this._y, CVAR.tileSide, CVAR.tileSide);
        GVAR.fieldArr.push(this._structure); //спавн грядки(потом убрать)
    }
    isCanPut(type){
        let size = GVAR.buildings[type].size;
        let tileIndex = Calc.CanvasToIndex(this._x, this._y, CVAR.tileSide, CVAR.outlineWidth);
        if (tileIndex.i+size.h>CVAR.tileRows-1 || tileIndex.j+size.w>CVAR.tileCols-1)
            return false;
        for (let i = tileIndex.i; i < tileIndex.i + size.w; i++) {
            for (let j = tileIndex.j; j < tileIndex.j + size.h; j++) {
                if (tiles[i][j]._occupied != "none") {
                    console.log(i,j)
                    return false;
                }
            }
        }
        return true;
    }
    createBuilding(type)
    {
        this._structure = new Building(this._rect.x, this._rect.y, this._rect.w, this._rect.h, type)
        let tileIndex = Calc.CanvasToIndex(this._x, this._y, CVAR.tileSide, CVAR.outlineWidth);
        for (let i = tileIndex.i; i < tileIndex.i + GVAR.buildings[type].size.w; i++) {
            for (let j = tileIndex.j; j < tileIndex.j + GVAR.buildings[type].size.h; j++) {
                tiles[i][j]._structure = this._structure;
            }
        }
        GVAR.buildingArr.push(this._structure);
    }
}