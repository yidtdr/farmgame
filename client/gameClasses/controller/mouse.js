import Calc from "../../calc.js";
import Building from "../building/building.js";
import tiles from "../../globalVars/tiles.js";
import camera from "./camera.js";
import GVAR from "../../globalVars/global.js";
import CVAR from "../../globalVars/const.js";
import player from "../player/player.js";
import Buildable from "../building/buildable.js";

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
        console.log(1)
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
        GVAR.buildingArr.forEach((el) => { //уже готово к объединению
            if (el._isMoving)
            {
                let pos = Calc.indexToCanvas(this._mapPos.i, this._mapPos.j, CVAR.tileSide, CVAR.outlineWidth);
                el.move(pos)
            }
        })
        GVAR.fieldArr.forEach((el) => {
            if (el._isMoving)
            {
                let pos = Calc.indexToCanvas(this._mapPos.i, this._mapPos.j, CVAR.tileSide, CVAR.outlineWidth);
                el.move(pos)
            }
        })
        GVAR.movingBuildable.forEach((el) => {
            if (el._isMoving)
            {
                let pos = Calc.indexToCanvas(this._mapPos.i, this._mapPos.j, CVAR.tileSide, CVAR.outlineWidth);
                el.move(pos)
            }
        })
    }
    onMouseDown(e)
    {
        this._movedDist=0;
        this.onMouseMove(e);
        this._LMBdown = true;
        this._movedDist=0;
        // if (player.phantonBuilding!="none"){ // временно
        //     let pos = Calc.indexToCanvas(mouse._mapPos.i, mouse._mapPos.j, CVAR.tileSide, CVAR.outlineWidth)
        //     player.phantonBuilding.building = new Buildable(pos.x, pos.y, CVAR.tileSide, CVAR.tileSide, 'bakery')
        //     player.phantonBuilding.building._isMoving = true
        //     GVAR.movingBuildable.push(player.phantonBuilding.building) //просто Buildable
        //     this._isDragging = true
        //     return
        // }
        this._LMBhold = setTimeout(() => {
            const mousePos = Calc.getTouchPos(canvas, e);
            this._deltaMove.x = mousePos.x - this._screenPos.x;
            this._deltaMove.y = mousePos.y - this._screenPos.y;
            if (Math.sqrt((this._deltaMove.x) * (this._deltaMove.x) + (this._deltaMove.y) * (this._deltaMove.y))<10){
                GVAR.UI.pop();
                GVAR.fieldArr.forEach((el) => {
                    el.checkRectHover(mouse._screenPos);
                    if (el._hovered)
                    {
                        el._isMoving=true;
                        GVAR.redraw = true;
                        this._isDragging = true;
                        el._prevPosition = Calc.CanvasToIndex(el._x, el._y, CVAR.tileSide, CVAR.outlineWidth);
                        let prevPos = el._prevPosition;
                        let prevCoords = Calc.indexToCanvas(prevPos.i, prevPos.j, CVAR.tileSide, CVAR.outlineWidth);
                        GVAR.PlantArr.forEach((el) => {
                            if (el._x==prevCoords.x && el._y==prevCoords.y){
                                el._prevPosition = prevPos;
                            }
                        })
                    }
                })
                
                GVAR.buildingArr.forEach((el) => {
                    el.checkRectHover(mouse._screenPos);
                    if (el._hovered)
                    {
                        el._isMoving=true;
                        this._isDragging = true;
                        el._prevPosition = Calc.CanvasToIndex(el._x, el._y, CVAR.tileSide, CVAR.outlineWidth);
                    }
                })
            }   
        }, 300); // time
        this._movedDist=0;
    }
    onMouseUp(e)
    {
        if (player.phantonBuilding!="none"){ // добавить проверку на возможность установить
            let pos = Calc.indexToCanvas(mouse._mapPos.i, mouse._mapPos.j, CVAR.tileSide, CVAR.outlineWidth)
            if (player._money>= player.phantonBuilding.cost){
                tiles[mouse._mapPos.i][mouse._mapPos.j].createBuilding(player.phantonBuilding.type)
                player._money -= player.phantonBuilding.cost
                player.updateMoney()
                player.phantonBuilding = "none"
            }
            GVAR.movingBuildable.pop()
        }

        GVAR.fieldArr.forEach((el) => {
            if (el._isMoving)
            {
                if (!tiles[this._mapPos.i][this._mapPos.j]._isOccupied){
                    tiles[this._mapPos.i][this._mapPos.j]._structure = tiles[el._prevPosition.i][el._prevPosition.j]._structure
                    tiles[el._prevPosition.i][el._prevPosition.j]._structure = "none"
                    //очистка прошлой территории
                    tiles[el._prevPosition.i][el._prevPosition.j]._isOccupied = false
                    //заполняем новую терр
                    tiles[this._mapPos.i][this._mapPos.j]._isOccupied = true
                    let pos = Calc.indexToCanvas(this._mapPos.i, this._mapPos.j, CVAR.tileSide, CVAR.outlineWidth);
                    el.move(pos)
                    let prevPos = Calc.indexToCanvas(el._prevPosition.i, el._prevPosition.j, CVAR.tileSide, CVAR.outlineWidth);
                }
                else {
                    let prevCoords = Calc.indexToCanvas(el._prevPosition.i, el._prevPosition.j, CVAR.tileSide, CVAR.outlineWidth);
                    el.move(prevCoords)
                    let prevPos = el._prevPosition;
                    tiles[el._prevPosition.i][el._prevPosition.j]._structure._plant.move(prevCoords);
                }
                el._isMoving=false;  
            }
        })

        GVAR.buildingArr.forEach((el) => {  // всё переписать под нвоое
            if (el._isMoving)
            {
                if (tiles[this._mapPos.i][this._mapPos.j].isCanPut(el._type)){
                    //очистка прошлой территории
                    let size = GVAR.buildings[el._type].size;
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
                    el.move(pos)
                }
                else {
                    let prevPos = Calc.indexToCanvas(el._prevPosition.i, el._prevPosition.j, CVAR.tileSide, CVAR.outlineWidth);
                    el.move(prevCoords)
                }
                el._isMoving=false;
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
            console.log("click");
            tiles[player._chosenTile.i][player._chosenTile.j]._structure.onClick();
            if (tiles[player._chosenTile.i][player._chosenTile.j]._structure instanceof Building)
                GVAR.workingBuildingArr.push(tiles[player._chosenTile.i][player._chosenTile.j]._structure);
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