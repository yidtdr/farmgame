import Calc from "../../calc.js";
import GVAR from "../../globalVars/global.js";
import CVAR from "../../globalVars/const.js";

class Camera{
    constructor()
    {
        this._x = 0;
        this._y = 0;
        this.updateBoundingBox();
    }
    move(x, y)
    {
        if (this._x - x < CVAR.mapBoundingBox.left )
        {
            this._x = CVAR.mapBoundingBox.left;
        }
        else if (this._x - x > CVAR.mapBoundingBox.right )
        {
            this._x = CVAR.mapBoundingBox.right;
        }
        else
        {
            this._x -= x;
        }
        
        if (this._y - y > CVAR.mapBoundingBox.bottom)
        {
            this._y = CVAR.mapBoundingBox.bottom;
        }
        else if (this._y - y < CVAR.mapBoundingBox.top)
        {
            this._y = CVAR.mapBoundingBox.top;
        }
        else
        {
            this._y -= y;
        }
        this.updateBoundingBox();
    }
    newMove(x,y){
        if (this._x + x < -60)
            this._x = -60
        else
            this._x += x
        
        if (this._y + y < -60)
            this._y = -60
        else
            this._y += y
        this.updateBoundingBox();
    }
    getPos()
    {
        return{
            x: this._x,
            y: this._y
        }
    }
    updateBoundingBox()
    {
        this._cameraIndexBoundingBox = Calc.getCameraIndexBoundingBox(
         this.getPos(),
         {width: window.innerWidth, height: window.innerHeight},
         GVAR.scale, CVAR.tileSide, CVAR.outlineWidth,
         {width: CVAR.tileRows, height: CVAR.tileCols})
    }
    getBoundingBox()
    {
        return this._cameraIndexBoundingBox;
    }
}
const camera = new Camera();

export default camera;