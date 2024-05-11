import GVAR from "../../globalVars/global.js";
import Sprite from "../sprite/sprite.js";
import tiles from "../../globalVars/tiles.js";
import Calc from "../../calc.js";
import CVAR from "../../globalVars/const.js";
import Building from "../building/building.js";
import Field from "../field/field.js";
import ASSETS from "../../globalVars/assets.js";

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
        this._structure = new Field(this._x, this._y, 'field');
        GVAR.buildableArr.push(this._structure); //спавн грядки(потом убрать)
    }
    isCanPut(elem){
        let size = ASSETS.pictures[elem._type].size;
        let tileIndex = Calc.CanvasToIndex(this._x, this._y, CVAR.tileSide, CVAR.outlineWidth);

        if (tileIndex.i+size.h>CVAR.tileRows-1 || tileIndex.j+size.w>CVAR.tileCols-1)
            return false;
        for (let i = tileIndex.i; i < tileIndex.i + size.w; i++) {
            for (let j = tileIndex.j; j < tileIndex.j + size.h; j++) {
                if ((tiles[i][j]._structure != "none") && (tiles[i][j]._structure != elem)) {
                    console.log(i,j, tiles[i][j]._structure != "none", (this._structure !== elem))
                    console.log(this._structure, elem)
                    return false;
                }
            }
        }
        return true;
    }
    createBuilding(type)
    {
        this._structure = new Building(this._x, this._y, type)
        let tileIndex = Calc.CanvasToIndex(this._x, this._y, CVAR.tileSide, CVAR.outlineWidth);
        for (let i = tileIndex.i; i < tileIndex.i + ASSETS.pictures[type].size.w; i++) {
            for (let j = tileIndex.j; j < tileIndex.j + ASSETS.pictures[type].size.h; j++) {
                tiles[i][j]._structure = this._structure;
            }
        }
        GVAR.buildableArr.push(this._structure);
    }
    moveStructure(newPos){
        let el = this._structure
        let size = ASSETS.pictures[el._type].size;

        for (let i = el._prevPosition.i; i < el._prevPosition.i + size.w; i++) {
            for (let j = el._prevPosition.j; j < el._prevPosition.j + size.h; j++) {
                tiles[i][j]._structure="none";
            }
        }

        for (let i = newPos.i; i < newPos.i + size.w; i++) {
            for (let j = newPos.j; j < newPos.j + size.h; j++) {
                tiles[i][j]._structure=el;
            }
        }
        let pos = Calc.indexToCanvas(newPos.i, newPos.j, CVAR.tileSide, CVAR.outlineWidth);
        el.move(pos)
    }
}