import RES from "../../resources.js";
import { ctx } from "../../globalVars/canvas.js";
import Buildable from "../building/buildable.js";
import player from "../player/player.js";
import { bushMenu } from "./bushMenu.js";
import socketClient from "../../init.js";
import CVAR from "../../globalVars/const.js";

export default class Bush extends Buildable{
    constructor(x, y, type)
    {
        super(x, y, type);
        this._isWork = false;
        this._image = RES.buildings[type].image
        this._timeStamp = RES.buildings[this._type].speed * 1000;
        this._freeze = false
        this._collectedAmountLimit = 3;
        this._collectedAmount = 0
        this._resetPrice = 30
        this.startWork()
    }
    activateBooster(){
        if (this._timeToFinish){
            if (this._timeToFinish > (player._growBooster.boosterAmount-1)*player._growBooster.timeToEnd){
                this._finishTime = Date.now() + this._timeToFinish - (player._growBooster.boosterAmount - 1) * player._growBooster.timeToEnd + 1000 //перестраховка для бека
            } else {
                this._finishTime = Date.now() + this._timeToFinish/player._growBooster.boosterAmount + 1000 //перестраховка для бека
            }
        }
    }
    setTime(startTime){
        this._finishTime = startTime * 1000 + this._timeStamp
        this._isWork = true;
    }
    draw(){
        if (this._isMoving){
            ctx.shadowBlur = 30;
            ctx.shadowColor = "rgb(0,230,0)";
        }
        if (this._timeToFinish == 0){ //показатель готовности
            ctx.shadowBlur = 30;
            ctx.shadowColor = "rgb(0,0,230)";
        }
        ctx.drawImage(this._image, this._x, this._y, this._w, this._h);
        ctx.shadowBlur = 0;
    }
    canReset(){
        return this._collectedAmount < this._collectedAmountLimit
    }
    reset(){
        this._collectedAmount = 0;
        player.buy(this._resetPrice)
    }
    canStartWork(){
        return (!this._isWork && this._collectedAmount < this._collectedAmountLimit)
    }
    startWork(){
        this._freeze = true
        // socketClient.send(`use/start/${this._x/CVAR.tileSide}/${this._y/CVAR.tileSide}`)
        this._timeToFinish = this._timeStamp;
        this._isWork = true;
        this.realStart()//потом убрать
    }
    realStart(){
        if (player._growBooster.boosterAmount==1){
            this._finishTime = Date.now() + this._timeStamp;
            return
        }
        if (this._timeToFinish > (player._growBooster.boosterAmount-1)*player._growBooster.timeToEnd){
            this._finishTime = Date.now() + this._timeToFinish - (player._growBooster.boosterAmount - 1) * player._growBooster.timeToEnd
        } else {
            this._finishTime = Date.now() + this._timeToFinish/player._growBooster.boosterAmount
        }
    }
    update(){
        if (true){ //!this._freeze && this._isWork
            this._timeToFinish = (this._timeToFinish != 0 
            ? 
            (this._timeToFinish - 1000)
            : 0);
            if (this._finishTime - Date.now() > 0){
                this._image = RES.plants['wheat'].image.stages[0]
                this._isWork = false;
                bushMenu.close()
            }
        }
    }
    collect(){
        if (player.getInvFullness() >= 3){
            player.pushInventory(RES.buildings[this._type].product, 3);//3 будет записано в json сколько собирается
            this._timeToFinish = undefined;
            socketClient.send(`collect/${this._x/CVAR.tileSide}/${this._y/CVAR.tileSide}`)
        }
        // if (this._collectedAmount < 3)
        //     //картинка живого
        // else
        //     //картинка мертвого
    }
    onClick()
    {
        if (this._timeToFinish == 0){
            this.collect()
        } else {
            bushMenu.show(this)
        }
    }
}