import GVAR from './globalVars/global.js';
import { canvas, ctx } from './globalVars/canvas.js';
import tiles from './globalVars/tiles.js';
import mouse from './gameClasses/controller/mouse.js';
import camera from './gameClasses/controller/camera.js';
import shop from './gameClasses/shop/shop.js';
import player from './gameClasses/player/player.js';
import Order from './gameClasses/orders/order.js';
import { orderManager } from './gameClasses/orders/orders.js';
import { spin } from './gameClasses/spin/spin.js';

// Ensure the document is scrollable
function ensureDocumentIsScrollable() {
    const isScrollable =
        document.documentElement.scrollHeight > window.innerHeight;
    if (!isScrollable) {
        document.documentElement.style.setProperty(
            "height",
            "calc(100vh + 1px)",
            "important"
        );
    }
}

// Prevent window.scrollY from becoming zero
function preventCollapse(event) {
    if (window.scrollY === 0) {
        window.scrollTo(0, 1);
    }
}

window.addEventListener("load", ensureDocumentIsScrollable);

//      [WINDOW STUFF]
window.onresize = () => {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    GVAR.rescale = true;
}

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

//      [GLOBAL VARS]
let prevdelta = 0.001;

shop.drawStash();

//      [EVENTS]

document.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const touchedElement = document.elementFromPoint(touchX, touchY);
    if (canvas === touchedElement){
        if (e.touches.length == 1)
            {
                mouse.onMouseMove(e);
            }
            else
            {
                mouse.onScale(e);
            }
    } else {
        if (player._phantomBuilding!="none")
            {
                mouse.onMouseMove(e);
            }
    }
}, false);

canvas.addEventListener('touchstart', (e) => {
    preventCollapse(e)
    if (e.touches.length == 1)
    {
        mouse.onMouseDown(e);
    }
    else
    {
        mouse.onScaleStart(e);
    }
})

document.addEventListener('touchend', (e) => {
    const touchX = e.changedTouches[0].clientX;
    const touchY = e.changedTouches[0].clientY;
    const touchedElement = document.elementFromPoint(touchX, touchY);
    if (canvas === touchedElement){
        mouse.onMouseUp(e);
    }
}, false);

setInterval(() => {
    GVAR.buildableArr.forEach((el) => {
        el.update();
        GVAR.redraw = true;  
    })
}, 1000);

setInterval(() => {
    let newOrders = new Array();

    for (let i = 0; i < player._maxOrderAmount; i++) {
        newOrders.push(new Order(player._inventory))
    }
    player._orderArr = newOrders;
    orderManager.renderOrders()
}, 10000); //таймер обновления ордеров


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

        GVAR.buildableArr.forEach((el) => {
            el.draw();
        })

        GVAR.phantomBildingArr.forEach((el) => {
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