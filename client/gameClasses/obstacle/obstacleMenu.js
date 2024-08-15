import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import RES from "../../resources.js";

class ObstacleMenu {
    constructor() {
        document.getElementById("close-obstacle-menu").onclick = () => {
            document.getElementById("obstacle-menu-wrap").style.display = "none";
        };
        this.obstacle = 'none';
    }
    show(obstacle) {
        this.obstacle = obstacle;
        GVAR.closeAllWindows();
        document.getElementById("obstacle-menu-wrap").style.display = "flex";
        this.renderMenu();
    }
    renderMenu() {
        const type = this.ostacleMenu._type;
        const obstacleDelete = document.getElementById('obstacle-button');
        obstacleDelete.className = 'booster-button'; //заменить
        if (player._money >= this.obstacle._deletePrice) {
            obstacleDelete.disabled = false;
        } else {
            obstacleDelete.disabled = true;
        }
        obstacleDelete.addEventListener('click', () => {
            player.buy(this.obstacle._deletePrice)
            this.obstacle.delete()
        });
    }
}
export const obstacleMenu = new ObstacleMenu();
