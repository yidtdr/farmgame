import Sprite from "../sprite/sprite.js";
import ASSETS from "../../globalVars/assets.js";
import { ctx } from "../../globalVars/canvas.js";
import CVAR from "../../globalVars/const.js";

export default class Buildable extends Sprite{ // нужно переименовтаь
    constructor(x, y, type)
    {
        super(x, y);
        this._type = type
        this._image = ASSETS.pictures[type].image
        this._isMoving = false;
        this._prevPosition = {
            i: 0,
            j: 0
        }
        this._size =  ASSETS.pictures[type].size;
        this._w = this._size.w * CVAR.tileSide;
        this._h = this._size.h * CVAR.tileSide;
    }
    move(pos) {
        this._x = pos.x;
        this._y = pos.y;
    }
    draw () {
        ctx.drawImage(this._image, this._x, this._y, this._w, this._h);
    }
}