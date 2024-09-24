export default class Calc{
    static screenToIndex(mousePos, offsetPos, scale, tileSide, outlineWidth) {
        return{
            i: Math.floor((mousePos.x+offsetPos.x)/ ((tileSide + outlineWidth)*scale)),
            j: Math.floor((mousePos.y+offsetPos.y)/ ((tileSide + outlineWidth)*scale))
        }
    }
    static indexToCanvas(i, j, tileSide, outlineWidth)
    {
        return{
            x: (i) * (tileSide + outlineWidth),
            y: (j) * (tileSide + outlineWidth)
        }
    }
    static CanvasToIndex(x, y, tileSide, outlineWidth)
    {
        return{
            i: x / (tileSide + outlineWidth),
            j: y / (tileSide + outlineWidth)
        }
    }
    static getTouchEndPos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.changedTouches[0].clientX - rect.left,
            y: evt.changedTouches[0].clientY - rect.top,
        };
    }
    static getTouchPos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.touches[0].clientX - rect.left,
            y: evt.touches[0].clientY - rect.top,
        };
    }
    static getCameraIndexBoundingBox(cameraPos, screenValues, scale, tileSide, outlineWidth, mapSize)
    {
        const topLeftCorner = this.screenToIndex(cameraPos, {x: 0, y: 0}, scale, tileSide, outlineWidth);
        const bottomRightCorner = this.screenToIndex({x: cameraPos.x + screenValues.width, y: cameraPos.y + screenValues.height}, {x: 0, y:0}, scale, tileSide, outlineWidth);
        const cameraIndexBoundingBox = {
            top: topLeftCorner.j > 0 ? topLeftCorner.j : 0,
            left: topLeftCorner.i > 0 ? topLeftCorner.i : 0,
            bottom: bottomRightCorner.j + 1 < mapSize.height ? bottomRightCorner.j + 1 : mapSize.height,
            right: bottomRightCorner.i + 1 < mapSize.width ? bottomRightCorner.i + 1 : mapSize.width
        }
        return cameraIndexBoundingBox;
    }
    static getTouchesDistance(e)
    {
        const pos1 = {x: e.touches[0].clientX, y: e.touches[0].clientY};
        const pos2 = {x: e.touches[1].clientX, y: e.touches[1].clientY};
        return (
            Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) +
            (pos1.y - pos2.y) * (pos1.y - pos2.y))
        )
    }
    static getApproximationCenter(e)
    {
        const pos1 = {x: e.touches[0].clientX, y: e.touches[0].clientY};
        const pos2 = {x: e.touches[1].clientX, y: e.touches[1].clientY};
        console.log(pos1,pos2)
        return {x: (pos1.x + pos2.x)/2,y: (pos1.y + pos2.y)/2}
    }
    static worldToScreen(x, y, camera, scale)
    {
        return (
            {
                x: (x - camera.x / scale) * scale,
                y: (y - camera.y / scale) * scale,
            }
        )
    }
    static screenToWorld(x, y, camera, scale)
    {
        return (
            {
                x: x / scale + camera.x / scale,
                y: y / scale + camera.y / scale,
            }
        )
    }
    static pointInBoudaries(x, y, rect)
    {
        return(
            (x > rect.x) && (y > rect.y) &&
            (x < rect.x + rect.w) && (y < rect.y + rect.h)
        )
    }
}