class GlobalVars{
    constructor()
    {
        this.UI = new Array(0);    

        this.buildableArr = new Array();
        this.penArr = new Array();
        this.phantomStructureArr = new Array(0);

        this.scale = 4.5;
        this.rescale = true
        this.redraw = true;
    }
    closeAllWindows(){
        this.UI.pop()
        document.getElementById("spin-wrap").style.display = "none";
        document.getElementById("orders-wrap").style.display = "none";
        document.getElementById("stash-wrap").style.display = "none";
        document.getElementById("shop-wrap").style.display = "none";
        document.getElementById("building-menu-wrap").style.display = "none";
    }
}

const GVAR = new GlobalVars();

export default GVAR;