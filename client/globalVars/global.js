class GlobalVars{
    constructor()
    {
        this.UI = new Array(0);    

        this.buildableArr = new Array();
        this.phantomBildingArr = new Array(0);

        this.scale = 4.5;
        this.rescale = true
        this.redraw = true;
    }
}

const GVAR = new GlobalVars();

export default GVAR;