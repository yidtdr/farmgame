import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import Menu from "../menu/menu.js";
import { ctx } from "../../globalVars/canvas.js";
import PlantMenuItem from "./plantMenuItem.js";
import mouse from "../controller/mouse.js";
import Calc from "../../calc.js";
import camera from "../controller/camera.js";

export default class PlantMenu extends Menu
{
    constructor(x, y, w, h) {
        super(x, y, w, h, null);
        this._items = new Array();
        let k = 0;
        for (let item in player._inventory)
        {
            if (player._inventory[item] > 0)
            {
            this._items.push(new PlantMenuItem(
             this._rect.x + (k % 3) * this._rect.w / 3,
             this._rect.y + Math.floor(k / 3) * this._rect.h / 3,
             this._rect.w / 3, this._rect.h / 3, 
             item, player._inventory[item]))
            k++;
            }
        }
    }
    draw()
    {
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
        this._items.forEach((el) => {
            el.draw();
        })
    }
    checkRectHover(){
        const mousePos = mouse._screenPos;
        const worldMousePos = Calc.screenToWorld(mousePos.x, mousePos.y, camera.getPos(), GVAR.scale);
        this._hovered = Calc.pointInBoudaries(worldMousePos.x, worldMousePos.y, this._rect);

        this._items.forEach((el) => {
            el.checkRectHover();
        })
    }
    onClick(){
        this._items.forEach((el) => {
            if (el._hovered)
            {
                el.onClick();
            }
        })
        GVAR.UI.pop();
    }
}