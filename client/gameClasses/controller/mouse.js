import Calc from "../../calc.js";
import tiles from "../../globalVars/tiles.js";
import camera from "./camera.js";
import GVAR from "../../globalVars/global.js";
import CVAR from "../../globalVars/const.js";
import player from "../player/player.js";

class Mouse{
    constructor() {
        this._LMBdown = false;
        this._screenPos = {
            x: 0,
            y: 0
        }
        this._mapPos = {
            i: 0,
            j: 0
        }
        this._deltaMove = {
            x: 0,
            y: 0
        }
        this._scale = 0;
        this._deltaScale = 0;
        this._movedDist = 0;
    }
    onMouseMove(e){
        const mousePos = Calc.getTouchPos(canvas, e);
        const index = Calc.screenToIndex(mousePos, camera.getPos(), GVAR.scale, CVAR.tileSide, CVAR.outlineWidth);
        GVAR.redraw = true;
        this._deltaMove.x = mousePos.x - this._screenPos.x;
        this._deltaMove.y = mousePos.y - this._screenPos.y;
        this._movedDist += Math.sqrt((this._deltaMove.x) * (this._deltaMove.x) + (this._deltaMove.y) * (this._deltaMove.y))
        this._screenPos = mousePos;
        this._mapPos = index;
        if (this._LMBdown)
        {
            camera.move(this._deltaMove.x, this._deltaMove.y);
            camera.updateBoundingBox();
        }
    }
    onMouseDown(e)
    {
        this.onMouseMove(e);
        this._movedDist = 0;
        this._LMBdown = true;
    }
    onMouseUp(e)
    {
        this._LMBdown = false;
        const mousePos = Calc.getTouchEndPos(canvas, e);
        const index = Calc.screenToIndex(mousePos, camera.getPos(), GVAR.scale, CVAR.tileSide, CVAR.outlineWidth);
        GVAR.redraw = true;
        this._screenPos = mousePos;
        this._mapPos = index;
        if (this._movedDist < 10)
        {
           this.onClick();
        }
        this._movedDist = 0;
    }
    onClick()
    {
        let Clicked = false;
        GVAR.UI.forEach((el) => {
            el.checkRectHover();
            if (el._hovered)
            {
                el.onClick();
                Clicked = true;
            }
        })
        player._chosenTile = {
            i: this._mapPos.i,
            j: this._mapPos.j,
        }
        if (Clicked)
        {return};
        GVAR.PlantArr.forEach((el) => {
            el.checkRectHover();
            if (el._hovered)
            {
                el.collect();
                Clicked = true;
            }
        })
        if (Clicked)
        {return};
        tiles[this._mapPos.i][this._mapPos.j].onClick();
    }
    onScaleStart(e)
    {
        this._scale = Calc.getTouchesDistance(e) / 100;
    }
    onScale(e)
    {
        const newScale = Calc.getTouchesDistance(e) / 100;
        this._deltaScale = newScale - this._scale;
        this._scale = newScale;
        GVAR.scale = (GVAR.scale + this._deltaScale) > 0.5 ? (GVAR.scale + this._deltaScale) : 0.5;
        camera.updateBoundingBox();
        GVAR.redraw = true;
    }
}
const mouse = new Mouse();

export default mouse