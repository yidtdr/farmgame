class Assets{
    constructor()
    {
        this.sizes = new Array();
        this.sizes["3x2"] = {
            h: 3, //j
            w: 2  //i
        }
        this.sizes["1x1"] = {
            h: 1,
            w: 1
        }

        this.pscenica = new Image();
        this.pizdec = new Image();
        this.grass1 = new Image();
        this.grass2 = new Image();
        this.grass1.src = 'client/assets/grass_1.png';
        this.grass2.src = 'client/assets/grass_2.png';
        this.pscenica.src = 'client/assets/pshenica.png';
        this.pizdec.src = 'client/assets/pizdec.png';
        this.field = new Image();
        this.field.src = 'client/assets/field.jpg';
        this.bakery = new Image();
        this.bakery.src = 'client/assets/bakery.jpg';

        this.pictures = new Array();
        this.pictures['psheno'] = { //для растений size не нужен
            image: this.pscenica,
            stages: {
                // 1: this.pscenica1,
                // 2: this.pscenica2,
            }
        }
        this.pictures['field'] = {
            image: this.field,
            size: this.sizes['1x1']
        }
        this.pictures['bakery'] = {
            image: this.bakery,
            size: this.sizes['3x2']
        }
    }
}

const ASSETS = new Assets();

export default ASSETS;