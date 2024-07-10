import GVAR from "../../globalVars/global.js";
import RES from "../../resources.js";
import { ctx } from "../../globalVars/canvas.js";
import Buildable from "../building/buildable.js";
import Animal from "./animal.js";
import player from "../player/player.js";
import { animalMenu } from "./animalMenu.js";

export default class AnimalPen extends Buildable{
    constructor(x, y, type)
    {
        super(x, y, type);
        this._animals = [];
        this._isWork = false;
        this._image = RES.buildings[type].image
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
        this._animals.forEach(animal => {
            animal.draw();
        });
    }
    canStartWork(){
        console.log(player._inventory[RES.buildings[this._type].feedType], this._animals.length, !this._isWork)
        return (player._inventory[RES.buildings[this._type].feedType] >= this._animals.length && !this._isWork && this._animals.length!=0)
    }
    startWork(){
        console.log("start", player._inventory)
        player._inventory[RES.buildings[this._type].feedType] -= this._animals.length;
        this._timeStamp = RES.buildings[this._type].workTime * 1000;
        this._finishTime = Date.now() + this._timeStamp;
        this._timeToFinish = this._timeStamp;
        this._isWork = true;
    }
    canAddAnimal(animal){
        return (this._animals.length < RES.buildings[this._type].maxCount && animal === RES.buildings[this._type].animal)
    }
    addAnimal(){
        this._animals.push(new Animal(this._x + this._w/2, this._y + this._h/2,RES.buildings[this._type].animal,{x: this._x, y: this._y, w: this._w, h: this._h}))
        animalMenu.renderMenu()
    }
    update(){
        if (this._isWork){
            this._timeToFinish = ((this._finishTime - Date.now()) > 0 ? (this._finishTime - Date.now()) : 0);
            if (this._timeToFinish == 0){
                this._isWork = false;
                animalMenu.close()
            }
        }
        this._animals.forEach(animal => {
            animal.update();
        });
    }
    onClick()
    {
        if (GVAR.UI[0] != null) //в будущем не будет
        {
            GVAR.UI.pop();
        }
        if (this._timeToFinish == 0){
            player.pushInventory(RES.buildings[this._type].product, this._animals.length);
            this._timeToFinish = undefined;
        } else {
            animalMenu.show(this)
        }
    }
    move(pos) {
        this._animals.forEach(el => {
            el.move({x: pos.x - this._x, y: pos.y - this._y})
        });
        this._x = pos.x;
        this._y = pos.y;
    }
}