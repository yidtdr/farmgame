import GVAR from "../../globalVars/global.js";

class Spin {
    constructor() {
        this.sectors = 16;
        this.renderSpin(this.sectors);

        const container = document.getElementById('container');
        const btn = document.getElementById('spin-button');
        let number = Math.ceil(Math.random()*1000);
        this.topSector = 0.5;
        btn.onclick = () => {
            container.style.transform = `rotate(${number}deg)`;
            container.style.transform = `rotate(${number}deg)`;
            this.topSector = (0.5 - ((number / (360/this.sectors)) % this.sectors) + 16);
            console.log("Верхний сектор: " + Math.ceil(this.topSector));
            number += Math.ceil(Math.random()*1000);
        }
        
        document.getElementById("closeSpin").onclick = () => {
            document.getElementById("spin-wrap").style.display = "none";
        }
        document.getElementById("open-spin").onclick = () => {
            GVAR.UI.pop();
            document.getElementById("spin-wrap").style.display = "flex";
            document.getElementById("orders-wrap").style.display = "none";
            document.getElementById("stash-wrap").style.display = "none";
            document.getElementById("shop-wrap").style.display = "none";
        }
    }
    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    renderSpin(size){
        const spin = document.getElementById('container');
        spin.innerHTML = ""
        let h = 150; // половина ширины рулетки (радиус)
        for (let index = 1; index <= size; index++) {
            const elem = document.createElement("div")
            elem.innerText = index
            elem.style.backgroundColor = this.getRandomColor();
            elem.style.height = "50%";
            elem.style.width = `${h*Math.sqrt(2-2*Math.cos(2*Math.PI/size))/Math.cos(Math.PI/size)}px`;
            elem.style.position = "absolute";
            elem.style.clipPath = "polygon(100% 0, 50% 100%, 0 0)";
            elem.style.transformOrigin = "bottom";
            elem.style.textAlign = "center";
            elem.style.display = "flex";
            elem.style.alignItems = "center";
            elem.style.justifyContent = "center";
            elem.style.fontSize = "20px";
            elem.style.fontWeight = "bold";
            elem.style.fontFamily = "sans-serif";
            elem.style.color = "#fff";
            elem.style.left = "120px";
            elem.style.transform = `rotate(${(index - 1) * 360 / size}deg)`;
            spin.appendChild(elem)
        }
    }
}
export const spin = new Spin();