import Sprite from "../sprite/sprite.js";
import { ctx } from "../../globalVars/canvas.js";
import CVAR from "../../globalVars/const.js";

export default class Phantom extends Sprite{
    constructor(x, y, size, type, image)
    {
        super(x, y);
        this._type = type
        this._image = image
        this._size = size
        this._isMoving = false;
        this._w = this._size.w * CVAR.tileSide;
        this._h = this._size.h * CVAR.tileSide;
    }
    move(pos) {
        this._x = pos.x;
        this._y = pos.y;
    }
    draw () {
        const out = (this._image.height - 16 * this._size.h)*CVAR.tileSide/16
        console.log(this._x, this._y, this._image.height, this._size.h, out)
        ctx.drawImage(this._image, this._x, this._y - out, this._w, this._h + out);
    }
}