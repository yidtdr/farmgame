import RES from "../../resources.js";
import { ctx } from "../../globalVars/canvas.js";
import Buildable from "../building/buildable.js";
import Animal from "./animal.js";
import player from "../player/player.js";
import { animalMenu } from "./animalMenu.js";
import socketClient from "../../init.js";
import CVAR from "../../globalVars/const.js";
import GVAR from "../../globalVars/global.js";

export default class AnimalPen extends Buildable{
    constructor(x, y, type)
    {
        super(x, y, type);
        this._animals = [];
        this._isWork = false;
        this._image = RES.buildings[type].image
        this._frontImage = RES.buildings[type].frontImage
        this._timeStamp = RES.buildings[this._type].workTime * 1000;
        this._freeze = false
    }
    activateBooster(){
        if (this._timeToFinish){
            if (this._timeToFinish > (player._workBooster.boosterAmount-1)*player._workBooster.timeToEnd){
                this._finishTime = Date.now() + this._timeToFinish - (player._workBooster.boosterAmount - 1) * player._workBooster.timeToEnd + 1000 //перестраховка для бека
            } else {
                this._finishTime = Date.now() + this._timeToFinish/player._workBooster.boosterAmount + 1000 //перестраховка для бека
            }
        }
    }
    setTime(startTime){
        this._finishTime = startTime * 1000 + this._timeStamp
        this._timeToFinish = Date.now() < this._finishTime ? this._finishTime - Date.now() : 0
        this._isWork = true;
        console.log(this._timeToFinish, Date.now() - this._finishTime)
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
        const out = (this._image.height - 16 * this._size.h)*CVAR.tileSide/16
        ctx.drawImage(this._image, this._x, this._y - out, this._w, this._h + out);
        ctx.shadowBlur = 0;
        this._animals.forEach(animal => {
            animal.draw();
        });
        const perc = 1 - this._frontImage.height / this._image.height
        ctx.drawImage(this._frontImage, this._x, this._y + (this._h + out) * perc, this._w, this._frontImage.height * CVAR.tileSide / 16);
    }
    canStartWork(){
        return !this._isWork && this._animals.length!=0 && player._inventory[RES.buildings[this._type].feedType] >= this._animals.length
    }
    startWork(){
        this._freeze = true
        socketClient.send(`use/start/${this._x/CVAR.tileSide}/${this._y/CVAR.tileSide}`)
        player._inventory[RES.buildings[this._type].feedType] -= this._animals.length;
        this._timeToFinish = this._timeStamp;
        this._isWork = true;
    }
    realStart(){
        console.log('realStart')
        if (player._workBooster.boosterAmount==1){
            this._finishTime = Date.now() + this._timeStamp;
            return
        }
        if (this._timeToFinish > (player._workBooster.boosterAmount-1)*player._workBooster.timeToEnd){
            this._finishTime = Date.now() + this._timeToFinish - (player._workBooster.boosterAmount - 1) * player._workBooster.timeToEnd
        } else {
            this._finishTime = Date.now() + this._timeToFinish/player._workBooster.boosterAmount
        }
    }
    canAddAnimal(animal){
        if (animal !== RES.buildings[this._type].animal)
            console.log('животное не подходит')
        if (this._animals.length == RES.buildings[this._type].maxCount)
            console.log('слоты для животных заняты')
        return (this._animals.length < RES.buildings[this._type].maxCount && animal === RES.buildings[this._type].animal)
    }
    addAnimal(){
        this._animals.push(new Animal(this._x + this._w/2, this._y + this._h/2,RES.buildings[this._type].animal,{x: this._x, y: this._y, w: this._w, h: this._h}))
        if (animalMenu.animalPen!='none'){
            animalMenu.renderMenu()
        }
    }
    update(){
        if (!this._freeze && this._isWork){
            this._timeToFinish = (this._timeToFinish > 0 
            ? 
            (this._timeToFinish - 1000)
            : 0);
            if (this._finishTime - Date.now() < 0){
                console.log(this._finishTime , Date.now())
                this._timeToFinish = 0
                console.log('да')
                this._isWork = false;
                animalMenu.close()
            }
        }
    }
    updateAnimal(){
        this._animals.forEach(animal => {
            animal.update();
        });
    }
    collect(){
        if (player.getInvFullness() >= this._animals.length){
            player.pushInventory(RES.buildings[this._type].product, this._animals.length);
            this._timeToFinish = undefined;
            socketClient.send(`collect/${this._x/CVAR.tileSide}/${this._y/CVAR.tileSide}`)
        } else{
            console.log('Недостаточно места в инвентаре')
        }
    }
    onClick()
    {
        if (this._timeToFinish == 0){
            this.collect()
        } else {
            animalMenu.show(this)
        }
    }
    move(pos) {
        const prev = {
            x: this._x,
            y: this._y
        }
        this._floatX = pos.x;
        this._floatY = pos.y;
        this._x = Math.ceil(this._floatX/CVAR.tileSide)*CVAR.tileSide
        this._y = Math.ceil(this._floatY/CVAR.tileSide)*CVAR.tileSide
        this._animals.forEach(el => {
            const a = {x: this._x - prev.x, y: this._y - prev.y}
            el.moveDelta(a)
        });
        GVAR.updateBuildingArr(this)
    }
}