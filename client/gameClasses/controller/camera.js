import Calc from "../../calc.js";
import GVAR from "../../globalVars/global.js";
import CVAR from "../../globalVars/const.js";

class Camera{
    constructor()
    {
        this._x = 0;
        this._y = 0;
        this.updateBoundingBox();
        this.updateMapBoundingBox();
    }
    move(x, y)
    {
        if (this._x - x < this.mapBoundingBox.left)
        {
            this._x = this.mapBoundingBox.left;
        }
        else if (this._x - x > this.mapBoundingBox.right )
        {
            this._x = this.mapBoundingBox.right;
        }
        else
        {
            this._x -= x;
        }
        
        if (this._y - y > this.mapBoundingBox.bottom)
        {
            this._y = this.mapBoundingBox.bottom;
        }
        else if (this._y - y < this.mapBoundingBox.top)
        {
            this._y = this.mapBoundingBox.top;
        }
        else
        {
            this._y -= y;
        }
        this.updateBoundingBox();
    }
    newMove(x,y){
        if (this._x + x < this.mapBoundingBox.left)
            this._x = this.mapBoundingBox.left
        else
            this._x += x
        
        if (this._y + y < this.mapBoundingBox.top)
            this._y = this.mapBoundingBox.top
        else
            this._y += y

        if (this._x + x > this.mapBoundingBox.right)
            this._x = this.mapBoundingBox.right
        else
            this._x += x
        
        if (this._y + y > this.mapBoundingBox.bottom)
            this._y = this.mapBoundingBox.bottom
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
    updateMapBoundingBox(){
        const boundingBox = Calc.getCameraIndexBoundingBox(
         this.getPos(),
         {width: window.innerWidth, height: window.innerHeight},
         GVAR.scale, CVAR.tileSide, CVAR.outlineWidth,
         {width: 100, height: 100}
        )
        const screenW = boundingBox.right - boundingBox.left
        const screenH = boundingBox.bottom - boundingBox.top
        this.mapBoundingBox = {
            top: -1 * (CVAR.tileSide+CVAR.outlineWidth) * GVAR.scale,
            bottom: (CVAR.tileCols+2-screenH) * (CVAR.tileSide+CVAR.outlineWidth) * GVAR.scale,
            left: -1 * (CVAR.tileSide+CVAR.outlineWidth) * GVAR.scale,
            right: (CVAR.tileRows+3-screenW) * (CVAR.tileSide+CVAR.outlineWidth) * GVAR.scale,
        }
        console.log(screenW, screenH,boundingBox, this.mapBoundingBox)
    }
}
const camera = new Camera();

export default camera;