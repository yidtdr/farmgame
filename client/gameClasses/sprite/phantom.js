import Sprite from "../sprite/sprite.js";
import { ctx } from "../../globalVars/canvas.js";
import CVAR from "../../globalVars/const.js";

export default class Phantom extends Sprite{
    constructor(x, y, size, type, image)
    {
        super(x, y);
        this._floatX = this._x;
        this._floatY = this._y;
        this._type = type
        this._image = image
        this._size = size
        this._isMoving = false;
        this._w = this._size.w * CVAR.tileSide;
        this._h = this._size.h * CVAR.tileSide;
    }
    move(pos) {
        this._floatX = pos.x;
        this._floatY = pos.y;
        this._x = Math.ceil(this._floatX/CVAR.tileSide)*CVAR.tileSide
        this._y = Math.ceil(this._floatY/CVAR.tileSide)*CVAR.tileSide
    }
    draw () {
        const out = (this._image.height - 16 * this._size.h)*CVAR.tileSide/16
        ctx.drawImage(this._image, this._x, this._y - out, this._w, this._h + out);
    }
}