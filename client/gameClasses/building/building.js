import Sprite from "../sprite/sprite.js";
import GVAR from "../../globalVars/global.js";
import { ctx } from "../../globalVars/canvas.js";
import CVAR from "../../globalVars/const.js";
import Calc from "../../calc.js";
import tiles from "../../globalVars/tiles.js";
import player from "../player/player.js";

export default class Building extends Sprite{
    constructor(x, y, w, h, buildingType)
    {
        super(x, y, w, h, GVAR.buildings[buildingType].image);
        this._buildingType = buildingType;
        this._buildingTimeStamp;
        this._workingTimeStamp;
        this._size =  GVAR.buildings[buildingType].size;
        this._w *= this._size.w;
        this._h *= this._size.h;
        this._timeToComplete =  GVAR.buildings[buildingType].workingTime * 1000;
        this._isReady = false;
        this._isWorking = false;
        this._isMoving = false;
        this._prevPosition = {
            i: -1,
            j: -1
        }
    }
    startWork(){
        console.log("start"+this._buildingType)
        if (!this._isWorking) { 
            this._buildingTimeStamp = Date.now();
            this._workingTimeStamp = Date.now() +  GVAR.buildings[this._buildingType].workingTime * 1000;
            this._isWorking = true;
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    console.log(tiles[i][j]._building)
                }
            }
        }
    }
    draw(){
        if (this._isReady)
        {
            ctx.shadowBlur = 20;
            ctx.shadowColor = "yellow";
        }
        ctx.drawImage(this._image, this._x, this._y, this._w, this._h);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgb(0,200,0)"
        ctx.fillRect(this.getRect().x, this.getRect().y - this.getRect().h / 3, this.getRect().w * this._timeToComplete /(1000 * GVAR.buildings[this._buildingType].workingTime), CVAR.tileSide / 5);
    }
    updateGrowTime()
    {
        this._timeToComplete = ((this._workingTimeStamp - Date.now()) > 0 ? (this._workingTimeStamp - Date.now()) : 0);
        if ((this._workingTimeStamp - Date.now()) < 0)
        {
            console.log("ready")
            this._isReady = true;
        }
    }
    collect()
    {
        GVAR.UI.pop();
        if (this._isReady)
        {
            this._isWorking = false;
            console.log("nice");
            player._money +=  GVAR.buildings[this._buildingType].moneyReward;
            player.updateMoney();
            const index = Calc.CanvasToIndex(this._rect.x, this._rect.y, CVAR.tileSide, CVAR.outlineWidth);
            tiles[index.i][index.j].buildingCollected();
            this._isReady=false;
            GVAR.workingBuildingArr = GVAR.workingBuildingArr.filter((el) => el !== this);
        }
        else{
            console.log(`notgrown ${this._timeToComplete / 1000}`)
        }
    }
    onClick() {
        this.startWork()
        this.collect()
    }
}