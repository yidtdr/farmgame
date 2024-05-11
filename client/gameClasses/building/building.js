import GVAR from "../../globalVars/global.js";
import { ctx } from "../../globalVars/canvas.js";
import CVAR from "../../globalVars/const.js";
import Calc from "../../calc.js";
import tiles from "../../globalVars/tiles.js";
import player from "../player/player.js";
import Buildable from "./buildable.js";

export default class Building extends Buildable{
    constructor(x, y, type)
    {
        super(x, y, type);
        this._buildingTimeStamp;
        this._workingTimeStamp;
        this._timeToComplete =  GVAR.buildings[type].workingTime * 1000;
        this._isReady = false;
        this._isWorking = false;
    }
    startWork(){
        if (!this._isWorking) { 
            this._buildingTimeStamp = Date.now();
            this._workingTimeStamp = Date.now() +  this._timeToComplete;
            this._isWorking = true;
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
    }
    update()
    {
        if (this._isWorking){
        this._timeToComplete = ((this._workingTimeStamp - Date.now()) > 0 ? (this._workingTimeStamp - Date.now()) : 0);
        if ((this._workingTimeStamp - Date.now()) < 0)
        {
            this._isReady = true;
        }
        }
    }
    collect()
    {
        GVAR.UI.pop();
        if (this._isReady)
        {
            this._isWorking = false;
            player._money +=  GVAR.buildings[this._type].moneyReward; // позже изменить
            player.updateMoney();
            const index = Calc.CanvasToIndex(this._rect.x, this._rect.y, CVAR.tileSide, CVAR.outlineWidth);
            this._isReady=false;
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