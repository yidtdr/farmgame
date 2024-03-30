class Assets{
    constructor()
    {
        this.pscenica = new Image();
        this.pizdec = new Image();
        this.grass1 = new Image();
        this.grass2 = new Image();
        this.grass1.src = 'client/assets/grass_1.png';
        this.grass2.src = 'client/assets/grass_2.png';
        this.pscenica.src = 'client/assets/pshenica.png';
        this.pizdec.src = 'client/assets/pizdec.png';
    }
}

const ASSETS = new Assets();

export default ASSETS;