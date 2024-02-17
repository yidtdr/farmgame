import Calc from './calc.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);
ctx.shadowColor = 'white';

//      [WINDOW STUFF]
window.onresize = () => {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    rescale = true;
}

//      [CONST]
const tileSide = 9; const outlineWidth = 1;
const tileRows = 1000; const tileCols = 1000;
const mapBoundingBox = {
    top: -50,
    bottom: tileCols * (tileSide+outlineWidth) + 50,
    left: -50,
    right: tileRows * (tileSide+outlineWidth) + 50,
}

//      [GLOBAL VARS]
let scale = 1; let rescale = true; let redraw = true;
let prevdelta = 0.001;

//      [SPRITE]
class Sprite{
    constructor(x, y, w, h)
    {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._rect = this.getRect();
        this._color = 'grey';
        this._hovered = false;
    }
    getRect(){
        return {
            x: this._x,
            y: this._y,
            w: this._w,
            h: this._h
        }
    }
    draw(){
        //ctx.shadowBlur = 20 * this._hovered; // Adjust the blur radius to increase or decrease the glow effect
        ctx.strokeStyle = this._color;  
        ctx.lineWidth = 1;
        ctx.strokeRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
        //ctx.shadowBlur = 0;
    }
}

//      [TILE MAN.]
class Tile extends Sprite{
    constructor(x, y, w, h)
    {
        super(x, y, w, h);
        this._timerId;
    }
    onHoverStart()
    {
        if (!this._hover)
        {
            this._hovered = true;
            this._color = 'white';
            redraw = true;
            if (this._timerId)
            {
                clearTimeout(this._timerId);
                this._timerId = 0;
            }
        }
    }
    onHoverEnd()
    {
        this._hovered = false;
        this._timerId = setTimeout(() => {this._color = 'grey'; redraw = true}, 3000);
    }
}

//      [MAP]  -  initialization
var tiles = new Array(tileRows);
for (let i = 0; i < tileRows; i++) {
    tiles[i] = new Array(tileCols);
}

for (let i = 0; i < tileRows; i++)
{
    for (let j = 0; j < tileCols; j++)
    {
        let tileCoords = Calc.indexToCanvas(i, j, tileSide, outlineWidth);
        tiles[i][j] = new Tile(tileCoords.x, tileCoords.y, tileSide, tileSide);
    }
}

//      [CAMERA]
class Camera{
    constructor()
    {
        this._x = 15;
        this._y = 15;
        //this._scale = 1; - to implement
        this._cameraIndexBoundingBox = Calc.getCameraIndexBoundingBox(
         this.getPos(),
         {width: window.innerWidth, height: window.innerHeight},
         scale, tileSide, outlineWidth,
         {width: tileRows, height: tileCols})
    }
    move(x, y)
    {
        if (this._x - x < mapBoundingBox.left )
        {
            this._x = mapBoundingBox.left;
        }
        else if (this._x - x > mapBoundingBox.right )
        {
            this._x = mapBoundingBox.right;
        }
        else
        {
            this._x -= x;
        }
        
        if (this._y - y > mapBoundingBox.bottom)
        {
            this._y = mapBoundingBox.bottom;
        }
        else if (this._y - y < mapBoundingBox.top)
        {
            this._y = mapBoundingBox.top;
        }
        else
        {
            this._y -= y;
        }
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
         scale, tileSide, outlineWidth,
         {width: tileRows, height: tileCols})
    }
    getBoundingBox()
    {
        return this._cameraIndexBoundingBox;
    }
}
const cmr = new Camera();

//      [MOUSE]
class Mouse{
    constructor() {
        this._LMBdown = false;
        this._screenPos = {
            x: 0,
            y: 0
        }
        this._mapPos = {
            i: 0,
            j: 0
        }
        this._deltaMove = {
            x: 0,
            y: 0
        }
        this._scale = 0;
        this._deltaScale = 0;
    }
    onMouseMove(e){
        const mousePos = Calc.getTouchPos(canvas, e);
        const index = Calc.screenToIndex(mousePos, cmr.getPos(), scale, tileSide, outlineWidth);
        this._deltaMove.x = mousePos.x - this._screenPos.x;
        this._deltaMove.y = mousePos.y - this._screenPos.y;
        this._screenPos = mousePos;
        this._mapPos = index;
        if (this._LMBdown)
        {
            cmr.move(this._deltaMove.x, this._deltaMove.y);
            cmr.updateBoundingBox();
        }
    }
    onMouseDown(e)
    {
        this.onMouseMove(e);
        this._LMBdown = true;
    }
    onMouseUp(e)
    {
        //this.onMouseMove(e);
        this._LMBdown = false;
    }
    onScaleStart(e)
    {
        this._scale = Calc.getTouchesDistance(e) / 100;
    }
    onScale(e)
    {
        const newScale = Calc.getTouchesDistance(e) / 100;
        this._deltaScale = newScale - this._scale;
        this._scale = newScale;
        scale = (scale + this._deltaScale) > 0.5 ? (scale + this._deltaScale) : 0.5;
        cmr.updateBoundingBox();
        redraw = true;
    }
}
const mouse = new Mouse();

//      [EVENTS]
canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length == 1)
    {
        mouse.onMouseMove(e);
        tiles[mouse._mapPos.i][mouse._mapPos.j].onHoverStart();
        tiles[mouse._mapPos.i][mouse._mapPos.j].onHoverEnd();
    }
    else
    {
        //mouse.onScale(e);
    }
}, false);
canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length == 1)
    {
        mouse.onMouseDown(e);
    }
    else
    {
        //mouse.onScaleStart(e);
    }
})
canvas.addEventListener('touchend', (e) => {
    mouse.onMouseUp(e);
})


//      [ANIMATE]
function animate(delta){
    if (redraw)
    {
        redraw = false;
        const pos = cmr.getPos();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(-pos.x, -pos.y);

        const drawBoundingBox = cmr.getBoundingBox();
        for (let i = drawBoundingBox.left; i < drawBoundingBox.right; i++)
        {
            for (let j = drawBoundingBox.top; j < drawBoundingBox.bottom; j++)
            {
                tiles[i][j].draw();
            }
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    document.getElementById('fps').innerText = `fps: ${1/((delta-prevdelta)/ 1000)}`;
    prevdelta = delta
    requestAnimationFrame(animate);
}

animate()