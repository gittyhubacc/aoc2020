const fs = require("fs");
const text = fs.readFileSync("./input.txt", "utf-8");

function backtrack(current, size, grid, IDtoTile, tileToID, exclude){
    const [coord, tile] = current;

    //console.log(tile, IDtoTile[tile]);
    grid[coord[0]][coord[1]] = tile;

    if(coord[0] == size-1 && coord[1] == size-1) return [true, grid];

    let incrementX = 0;
    if(coord[0]+1 == size) incrementX++;
    const new_coord = [ (coord[0]+1) % size, (coord[1]+incrementX) % size ];



    let valid_ids = get_ids(IDtoTile, tileToID, grid, new_coord, size);
    //console.log(valid_ids, new_coord)
    if(!valid_ids) return [false, grid];
    valid_ids = valid_ids.filter(item => !exclude.has(item));
    if(valid_ids.length == 0) return [false, grid];

    //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA");

    //console.log(grid, "aha");
    for(const id of valid_ids){
        //console.log("Not excluded: ", id, exclude)
        const new_exclude = new Set([...Array.from(exclude), ...get_exclude_ids(id)]);
        const ret = backtrack([new_coord, id], size, grid, IDtoTile, tileToID, new_exclude);
        //console.log("ret: ", ret);
        return ret;
    }
}

function get_exclude_ids(id){
    const actual_id = Math.floor(id/12);
    //console.log(actual_id, id)
    const retArray = [];
    for(let i = 0; i < 12; i++){
        retArray.push(actual_id*12 + i);
    }
    return retArray;
}

function union(arrayA, arrayB){
    return arrayA.filter(item => arrayB.includes(item));
}

function get_ids(IDtoTile, tileToID, grid, coord){
    const surrounding = [ grid[coord[0]-1]?.[coord[1]], grid[coord[0]]?.[coord[1]-1] ]; //top side, left side
    const _surroundings = [ tileToID[IDtoTile[surrounding[0]]?.[3]],  tileToID[IDtoTile[surrounding[1]]?.[2]] ];
    const top_side = _surroundings[0] ? _surroundings[0] : []; //bottom of one on top
    const left_side = _surroundings[1] ? _surroundings[1] : [];

    console.log(coord, tileToID[IDtoTile[surrounding[0]]?.[0]])
    if(top_side.length == 0) return left_side;
    if(left_side.length == 0) return top_side;
    return union(top_side, left_side)
}

function separate_data(data){
    const [tiles, tilesToID] = data;
    const corners = [ new Set(), new Set(), new Set(), new Set() ]; //top left, top right, bottom left, bottom right
    
    for(const tile of tiles){ //loop through each tile, and get the tiles with only 2 connections, they must be the corners
        let connection_side_indexes = [];
        for(let i = 0; i < 4; i++){
            if(tilesToID[tile[1][i]].filter(item => Math.floor(item/12) != Math.floor(tile[0]/12)).length > 0) connection_side_indexes.push(i);
        }

        if(connection_side_indexes.length == 2){
            if(connection_side_indexes[0] == 1 && connection_side_indexes[1] == 3) corners[0].add(tile[0]);
            if(connection_side_indexes[0] == 1 && connection_side_indexes[1] == 2) corners[1].add(tile[0]);
            if(connection_side_indexes[0] == 0 && connection_side_indexes[1] == 3) corners[2].add(tile[0]);
            if(connection_side_indexes[0] == 0 && connection_side_indexes[1] == 2) corners[3].add(tile[0]);
        }
    }
    return corners;
}

function p2(data){
    const size = Math.sqrt(data[0].length/12);
    const corners = separate_data(data);
    const grid = [];
    for(let i = 0; i < size; i++) {
        grid[i] = [];
        for(let j = 0; j < size; j++) grid[i][j] = 0;
    }

    const IDtoTile = Object.fromEntries(data[0]);

    console.log(Array.from(corners[0]).map(item => Math.floor(item/12)));
    backtrack([[0, 0], Array.from(corners[0])[0]], size, grid, IDtoTile, data[1], new Set([...get_exclude_ids(Array.from(corners[0])[0])]));

    return grid;

    for(const topleft_corner of corners[0]){
        /*console.log(*/backtrack([[0, 0], topleft_corner], size, grid, IDtoTile, data[1], new Set([...get_exclude_ids(topleft_corner)]));/*);*/
    }

    return grid;
}

function generate_tiles(top, bottom, left, right, id){
    const tiles = [];
    //12 transformations are possible with horizontal flips, vertical flips, and 90deg rotations
    tiles.push([id*12, [top, bottom, left, right]]);
    tiles.push([id*12 + 1, [left, right, bottom, top]]);
    tiles.push([id*12 + 2, [bottom, top, right, left]]);
    tiles.push([id*12 + 3, [right, left, top, bottom]]);
    tiles.push([id*12 + 4, [bottom, top, flip(left), flip(right)]]);
    tiles.push([id*12 + 5, [flip(left), flip(right), top, bottom]]);
    tiles.push([id*12 + 6, [top, bottom, flip(right), flip(left)]]);
    tiles.push([id*12 + 7, [flip(right), flip(left), top, bottom]]);
    tiles.push([id*12 + 8, [flip(top), flip(bottom), right, left]]);
    tiles.push([id*12 + 9, [right, left, flip(bottom), flip(top)]]);
    tiles.push([id*12 + 10, [flip(bottom), flip(top), left, right]]);
    tiles.push([id*12 + 11, [left, right, flip(top), flip(bottom)]]);
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

console.log(p2(get_data(text)));
