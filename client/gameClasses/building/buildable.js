import Sprite from "../sprite/sprite.js";
import RES from "../../resources.js";
import { ctx } from "../../globalVars/canvas.js";
import CVAR from "../../globalVars/const.js";

export default class Buildable extends Sprite{
    constructor(x, y, type)
    {
        super(x, y);
        this._floatX = this._x;
        this._floatY = this._y;
        this._type = type
        this._image = RES.buildings[type].image
        this._isMoving = false;
        this._prevPosition = {
            i: 0,
            j: 0
        }
        this._size = RES.buildings[type].size;
        this._w = this._size.w * CVAR.tileSide;
        this._h = this._size.h * CVAR.tileSide;
    }
    move(pos) {
        if (pos.x < 0)
            pos.x = 0
        if (pos.y < 0)
            pos.y = 0
        this._floatX = pos.x;
        this._floatY = pos.y;
        this._x = Math.ceil(this._floatX/CVAR.tileSide)*CVAR.tileSide
        this._y = Math.ceil(this._floatY/CVAR.tileSide)*CVAR.tileSide
    }
    draw () {
        const out = (this._image.height - 16 * this._size.h)*CVAR.tileSide/16
        console.log(this._x, this._y, this._image.height, this._size.h, out)
        ctx.drawImage(this._image, this._x, this._y - out, this._w, this._h + out);
    }
}