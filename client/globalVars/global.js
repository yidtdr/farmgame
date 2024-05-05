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

        this.sizes = new Array();
        this.sizes["large"] = {
            h: 3, //j
            w: 2  //i
        }
        this.sizes["single"] = {
            h: 1,
            w: 1
        }

        this.buildings = new Array();
        this.buildings["bakery"] = {
            image: ASSETS.bakery,
            workingTime: 6,
            moneyReward: 500,
            size: this.sizes["large"]
            //shopCost: 3
        }

        this.UI = new Array(0);    
        this.PlantArr = new Array();
        this.buildingArr = new Array();
        this.workingBuildingArr = new Array();
        this.fieldArr = new Array();

        this.scale = 4.5;
        this.rescale = true
        this.redraw = true;
    }
}

const GVAR = new GlobalVars();

export default GVAR;