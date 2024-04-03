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
        GVAR.buildingArr.forEach((el) => {
            if (el._isMoving)
            {
                let pos = Calc.indexToCanvas(this._mapPos.i, this._mapPos.j, CVAR.tileSide, CVAR.outlineWidth);
                el._x = pos.x;
                el._y = pos.y;
            }
        })
    }
    onMouseDown(e)
    {
        this.onMouseMove(e);
        console.log("down");
        this._movedDist = 0;
        this._LMBdown = true;

        this._LMBhold = setTimeout(() => {
            // GVAR.PlantArr.forEach((el) => {
            //     el.checkRectHover();
            //     if (el._hovered)
            //     {
                    
            //     }
            // })
            
            GVAR.buildingArr.forEach((el) => {
                el.checkRectHover();
                if (el._hovered)
                {
                    el._isMoving=true;
                    this._isDragging = true;
                    console.log("start");
                    el._prevPosition = Calc.CanvasToIndex(el._x, el._y, CVAR.tileSide, CVAR.outlineWidth);
                }
            })
        }, 500); // time
    }
    onMouseUp(e)
    {
        GVAR.buildingArr.forEach((el) => {
            // el.checkRectHover();
            if (el._isMoving)
            {
                console.log(tiles[this._mapPos.i][this._mapPos.j].isCanPut(el._buildingType));
                if (tiles[this._mapPos.i][this._mapPos.j].isCanPut(el._buildingType)){
                    //очистка прошлой территории
                    let size = GVAR.buildings[el._buildingType].size;
                    for (let i = el._prevPosition.i; i < el._prevPosition.i + size.w; i++) {
                        for (let j = el._prevPosition.j; j < el._prevPosition.j + size.h; j++) {
                            tiles[i][j]._building="none";
                        }
                    }
                    //заполняем новую терр
                    for (let i = this._mapPos.i; i < this._mapPos.i + size.w; i++) {
                        for (let j = this._mapPos.j; j < this._mapPos.j + size.h; j++) {
                            tiles[i][j]._building=el._buildingType;
                        }
                    }
                    let pos = Calc.indexToCanvas(this._mapPos.i, this._mapPos.j, CVAR.tileSide, CVAR.outlineWidth);
                    el._x = pos.x;
                    el._y = pos.y;
                }
                else {
                    let prevPos = Calc.indexToCanvas(el._prevPosition.i, el._prevPosition.j, CVAR.tileSide, CVAR.outlineWidth);
                    el._x = prevPos.x;
                    el._y = prevPos.y;
                }
                el._isMoving=false;
                this._isDragging = false;
                console.log("поднял")
            }
        })
        
        this._LMBdown = false;
        clearTimeout(this._LMBhold);        
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
        console.log("click");
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

        GVAR.buildingArr.forEach((el) => {
            el.checkRectHover();
            if (el._hovered && !el._isMoving)
            {
                console.log(el._isMoving);
                if (!el._isWorking){
                    el.startWork();
                    GVAR.workingBuildingArr.push(el);
                }
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