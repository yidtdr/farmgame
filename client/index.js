import GVAR from './globalVars/global.js';
import { canvas, ctx } from './globalVars/canvas.js';
import tiles from './globalVars/tiles.js';
import mouse from './gameClasses/controller/mouse.js';
import camera from './gameClasses/controller/camera.js';
import shop from './gameClasses/shop/shop.js';

//      [WINDOW STUFF]
window.onresize = () => {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    GVAR.rescale = true;
}

//      [GLOBAL VARS]
let prevdelta = 0.001;

shop.drawStash();

//      [EVENTS]
canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length == 1)
    {
        mouse.onMouseMove(e);
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

setInterval(() => {
    GVAR.PlantArr.forEach((el) => {
        el.updateGrowTime();
        GVAR.redraw = true;  
    })
}, 1000);


//      [ANIMATE]
function animate(delta){
    if (GVAR.redraw)
    {
        GVAR.redraw = false;
        const pos = camera.getPos();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(-pos.x, -pos.y);
        ctx.scale(GVAR.scale, GVAR.scale);

        const drawBoundingBox = camera.getBoundingBox();
        for (let i = drawBoundingBox.left; i < drawBoundingBox.right; i++)
        {
            for (let j = drawBoundingBox.top; j < drawBoundingBox.bottom; j++)
            {
                tiles[i][j].draw();
            }
        }

        GVAR.PlantArr.forEach((el) => {
            el.draw();
        })

        GVAR.UI.forEach((el) => {
            el.draw();
        })
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    prevdelta = delta
    requestAnimationFrame(animate);
}

animate()