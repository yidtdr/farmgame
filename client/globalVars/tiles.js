import CVAR from "./const.js";
import Calc from "../calc.js";
import Tile from "../gameClasses/tile/tile.js";
import RES from "../resources.js";

const tiles = new Array(CVAR.tileRows);

const initTiles = () =>
{
    for (let i = 0; i < CVAR.tileRows; i++) {
        tiles[i] = new Array(CVAR.tileCols);
    }
    for (let i = 0; i < CVAR.tileRows; i++)
    {
        for (let j = 0; j < CVAR.tileCols; j++)
        {
            let tileCoords = Calc.indexToCanvas(i, j, CVAR.tileSide, CVAR.outlineWidth);
            tiles[i][j] = new Tile(tileCoords.x, tileCoords.y, CVAR.tileSide, CVAR.tileSide, ((i + j) % 2) ? RES.map["grass_1"].image : RES.map["grass_2"].image);
        }
    }
}

initTiles();

export default tiles;