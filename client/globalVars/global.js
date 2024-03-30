import ASSETS from "./assets.js";
import CVAR from "./const.js";
import Calc from "../calc.js";

class GlobalVars{
    constructor()
    {
        this.plants = new Array();
        this.plants["PSHENO"] = {
            image: ASSETS.pscenica,
            imageSrc: 'assets/pshenica.png',
            growTime: 6,
            moneyReward: 5,
            shopCost: 3,
            collectAmount: 2
        }
        this.plants["PIZDEC"] = {
            image: ASSETS.pizdec,
            imageSrc: 'assets/pizdec.png',
            growTime: 10,
            moneyReward: 15,
            shopCost: 6,
            collectAmount: 1
        }

        this.UI = new Array(0);    
        this.PlantArr = new Array(); 

        this.scale = 4.5;
        this.rescale = true
        this.redraw = true;
        this.a = ASSETS;
    }
}

const GVAR = new GlobalVars();

export default GVAR;