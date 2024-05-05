import Sprite from "../sprite/sprite.js";

export default class Buildable extends Sprite{
    constructor(x, y, w, h, image)
    {
        super(x, y, w, h, image);
        this._isMoving = false;
        this._prevPosition = {
            i: 0,
            j: 0
        }
    }
    move(pos) {
        this._x = pos.x;
        this._y = pos.y;
    }
}