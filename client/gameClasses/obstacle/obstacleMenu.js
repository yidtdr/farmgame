import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import tiles from "../../globalVars/tiles.js";
import Calc from "../../calc.js";
import CVAR from "../../globalVars/const.js";

class ObstacleMenu {
    constructor() {
        document.getElementById("close-obstacle-menu").onclick = () => {
            this.close()
        };
        this.obstacle = 'none';
    }
    show(obstacle) {
        this.obstacle = obstacle;
        GVAR.closeAllWindows();
        document.getElementById("obstacle-menu-wrap").style.display = "flex";
        this.renderMenu();
    }
    close(){
        this.obstacle = 'none'
        document.getElementById("obstacle-menu-wrap").style.display = "none";
    }
    renderMenu() {
        const type = this.obstacle._type;
        const img = document.getElementById('obstacle-img')
        img.className = 'menu-big-img'; //заменить
        img.src = `client/assets/${type}/${type}0.png`;

        const obstacleDelete = document.getElementById('obstacle-button');
        obstacleDelete.className = 'booster-button'; //заменить
        if (player._money >= this.obstacle._deletePrice) {
            obstacleDelete.disabled = false;
        } else {
            obstacleDelete.disabled = true;
        }
        obstacleDelete.addEventListener('click', () => {
            const tileIndex = Calc.CanvasToIndex(this.obstacle._x, this.obstacle._y, CVAR.tileSide, CVAR.outlineWidth);
            for (let i = tileIndex.i; i < this.obstacle._w; i++) {
                for (let j = tileIndex.j; j < this.obstacle._h; j++) {
                    tiles[i][j]._structure = "none"
                }
            }
            player.buy(this.obstacle._deletePrice)
            this.obstacle.delete()
            this.close()
        });
    }
}
export const obstacleMenu = new ObstacleMenu();
