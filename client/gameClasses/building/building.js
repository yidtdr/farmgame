import GVAR from "../../globalVars/global.js";
import { ctx } from "../../globalVars/canvas.js";
import player from "../player/player.js";
import Buildable from "./buildable.js";
import RES from "../../resources.js";
import { buildingMenu } from "./buildingMenu.js";
import CVAR from "../../globalVars/const.js";

export default class Building extends Buildable{
    constructor(x, y, type)
    {
        super(x, y, type);
        this._products = new Array()
        this._craftingItems = new Array()
    }
    canStartWork(item){
        return this._craftingItems.length < RES.buildings[this._type].slotsAmount && player.canCraft(item)
    }
    startWork(item){
        const itemCopy = JSON.parse(JSON.stringify(item));
        player.craftItem(itemCopy)
        this._craftingItems.push(itemCopy);
        if (this._craftingItems.length > 1){
            this._craftingItems[this._craftingItems.length-1].workingTimeStamp = this._craftingItems[this._craftingItems.length-2].workingTimeStamp + itemCopy.timeToFinish * 1000;
        } else {
            this._craftingItems[this._craftingItems.length-1].workingTimeStamp = Date.now() +  itemCopy.timeToFinish * 1000;
        }
        this._craftingItems[this._craftingItems.length-1].timeToComplete = itemCopy.timeToFinish * 1000
    }    
    draw(){
        const out = (this._image.height - 16 * this._size.h)*CVAR.tileSide/16
        if (this._isMoving){
            ctx.shadowBlur = 30;
            ctx.shadowColor = "rgb(0,230,0)"
        }
        ctx.drawImage(this._image, this._x, this._y - out, this._w, this._h + out);
        ctx.shadowBlur = 0;
        if (this._products.length != 0){
            let key = Object.keys(this._products[0])[0]
            ctx.drawImage(RES.items[key].image, this._x, this._y, RES.items[key].size.w*8, RES.items[key].size.h*8)
        }
    }
    update()
    {
        if (this._craftingItems.length != 0){
            this._craftingItems[0].timeToComplete = ((this._craftingItems[0].workingTimeStamp - Date.now()) > 0 ? (this._craftingItems[0].workingTimeStamp - Date.now()) : 0);
            if (this._craftingItems[0].timeToComplete == 0)
            {
                this._products.push(this._craftingItems[0].products) // пусть всегда будет крафтиться 1 предмет
                console.log(this._craftingItems[0].products)
                this._craftingItems.shift()
            }
        }
    }
    collect()
    {
        GVAR.UI.pop();
        if (this._products.length>0)
        {
            const key = Object.keys(this._products[0])[0];
            if (player.getInvFullness()>=this._products[0][key]){
                player.pushInventory(key,this._products[0][key])
                this._products.shift()
            } else if (player.getInvFullness()>0) {
                let size = player.getInvFullness()
                player.pushInventory(key, size)
                this._products[0][key] -= size
            } else {
                console.log("инвентарь заполнен")
                return false
            }
            return true
        }
        else {
            console.log(`сейчас изготавливается:`, this._craftingItems)
            return false
        }
    }
    onClick() {
        if (!this.collect())
            buildingMenu.show(this)
    }
}