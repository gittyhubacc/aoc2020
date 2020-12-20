//part 1
function generate_tiles(top, bottom, left, right, id){
    const tiles = [];
    //6 transformations are possible with horizontal flips, vertical flips, and 180deg rotates
    tiles.push([id*10, [top, bottom, left, right]]);
    tiles.push([id*10 + 1, [bottom, top, right, left]]);
    tiles.push([id*10 + 2, [bottom, top, flip(left), flip(right)]]);
    tiles.push([id*10 + 3, [top, bottom, flip(right), flip(left)]]);
    tiles.push([id*10 + 4, [flip(top), flip(bottom), right, left]]);
    tiles.push([id*10 + 5, [flip(bottom), flip(top), left, right]]);
    return tiles;
}

function flip(edge) {
    return edge.split("").reverse().join("");
}

function get_data(text){
    text = text.split("\n\n");
    text.pop();
    const tiles = [];
    const tileToID = {};
    text = text.map(tile => {
        tile = tile.split(":\n");
        tile[0] = parseInt(tile[0].replace("Tile ", ""));
        tile[1] = tile[1].split("\n");
        const edges = [tile[1][0], tile[1][tile[1].length-1], "", ""];
        for(let j = 0; j < tile[1][0].length; j++){
            edges[2] += tile[1][j][0];
            edges[3] += tile[1][j][tile[1].length-1];
        }
        tiles.push(...generate_tiles(edges[0], edges[1], edges[2], edges[3], tile[0])); //pushes all orientations of this tile to the array
    });
    for(const tile of tiles){ //make a map of edges of any orientation to an array of IDs they are used in
        for(let i = 0; i < 4; i++){
            if(!tileToID[tile[1][i]]) tileToID[tile[1][i]] = [];
            tileToID[tile[1][i]].push(tile[0]);
        }
    }
    return [tiles, tileToID];
}

function p1(data){
    const [tiles, tilesToID] = data;
    const corners = new Set();
    for(const tile of tiles){ //loop through each tile, and get the tiles with only 2 connections, they must be the corners
        let connections = 0;
        for(let i = 0; i < 4; i++){
            if(tilesToID[tile[1][i]].filter((item, index, array) => Math.floor(item/10) != Math.floor(tile[0]/10)).length > 1) connections++;
        }
        if(connections == 2) corners.add(Math.floor(tile[0]/10)); //divide by 10 and add to set, as corners will be corners regardless of orientation
    }
    //you divide by 10 and add to the set because there are actually 24 IDs for the corners in total, 6 for each corner (6 orientations of the tile)
    return Array.from(corners).reduce((sum, item) => sum *= item, 1);
}

console.log("Part 1: " + p1(get_data(document.getElementsByTagName("pre")[0].innerText)));
