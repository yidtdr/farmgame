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
        this._LMBhold;
        this._isDragging = false;
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
        if (this._LMBdown && !this._isDragging)
        {
            camera.move(this._deltaMove.x, this._deltaMove.y);
            camera.updateBoundingBox();
        }
        GVAR.buildableArr.forEach((el) => {
            if (el._isMoving)
            {
                let pos = Calc.indexToCanvas(this._mapPos.i, this._mapPos.j, CVAR.tileSide, CVAR.outlineWidth);
                el.move(pos)
            }
        })

        GVAR.phantomBildingArr.forEach((el) => {
            let pos = Calc.indexToCanvas(this._mapPos.i, this._mapPos.j, CVAR.tileSide, CVAR.outlineWidth);
            el.move(pos)
        })
    }
    onMouseDown(e)
    {
        this._movedDist=0;
        this.onMouseMove(e);
        this._LMBdown = true;
        this._movedDist=0;

        this._LMBhold = setTimeout(() => {
            const mousePos = Calc.getTouchPos(canvas, e);
            this._deltaMove.x = mousePos.x - this._screenPos.x;
            this._deltaMove.y = mousePos.y - this._screenPos.y;
            if (Math.sqrt((this._deltaMove.x) * (this._deltaMove.x) + (this._deltaMove.y) * (this._deltaMove.y))<10){
                GVAR.UI.pop();

                let el = tiles[this._mapPos.i][this._mapPos.j]._structure
                if (el!="none"){
                    el._isMoving=true;
                    GVAR.redraw = true;
                    this._isDragging = true;
                    el._prevPosition = Calc.CanvasToIndex(el._x, el._y, CVAR.tileSide, CVAR.outlineWidth);
                    GVAR.phantomBildingArr.push(el)
                }
            }   
        }, 300); // time
    }
    onMouseUp(e)
    {
        if (player._phantomBuilding!="none" && tiles[mouse._mapPos.i][mouse._mapPos.j].isCanPut(player._phantomBuilding.building)){
            if (player._money >= player._phantomBuilding.cost){
                tiles[mouse._mapPos.i][mouse._mapPos.j].createBuilding(player._phantomBuilding.building._type)
                player._money -= player._phantomBuilding.cost
                player.updateMoney()
                player._phantomBuilding = "none"
            } else {
                console.log("недостаточно денег")
            }
        }
        GVAR.phantomBildingArr.pop()

        GVAR.buildableArr.forEach((el) => {
            if (el._isMoving)
            {
                if (el._x>=0 && el._y>=0 && tiles[this._mapPos.i][this._mapPos.j].isCanPut(el)){
                    tiles[el._prevPosition.i][el._prevPosition.j].moveStructure(this._mapPos)
                }
                else {
                    let prevPos = Calc.indexToCanvas(el._prevPosition.i, el._prevPosition.j, CVAR.tileSide, CVAR.outlineWidth);
                    el.move(prevPos)
                }
                el._isMoving=false;
                GVAR.phantomBildingArr.pop()
            }
        })

        this._LMBdown = false;
        clearTimeout(this._LMBhold);        
        const mousePos = Calc.getTouchEndPos(canvas, e);
        const index = Calc.screenToIndex(mousePos, camera.getPos(), GVAR.scale, CVAR.tileSide, CVAR.outlineWidth);
        GVAR.redraw = true;
        this._screenPos = mousePos;
        this._mapPos = index;
        this._isDragging = false;
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

        if (tiles[player._chosenTile.i][player._chosenTile.j]._structure != "none"){
            player._lastStructure = tiles[player._chosenTile.i][player._chosenTile.j]._structure
            tiles[player._chosenTile.i][player._chosenTile.j]._structure.onClick();
        } else
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