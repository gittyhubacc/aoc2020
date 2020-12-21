const fs = require("fs");
const text = fs.readFileSync("./input.txt", "utf-8");

function backtrack(current, size, corners, sides, middles, grid, IDtoTile, tileToID, exclude){
    const [coord, tile] = current;

    //console.log(tile, IDtoTile[tile]);
    grid[coord[0]][coord[1]] = tile;

    if(coord[0] == size-1 && coord[1] == size-1) return [true, grid];

    let incrementX = 0;
    if(coord[0]+1 == size) incrementX++;
    const new_coord = [ (coord[0]+1) % size, (coord[1]+incrementX) % size ];


    let valid_ids = get_ids(IDtoTile, tileToID, corners, sides, middles, grid, new_coord, size);
    if(!valid_ids) return [false];
    valid_ids = valid_ids.filter(item => !exclude.has(item));
    if(valid_ids.length == 0) return [false];

    //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA");

    //console.log(grid, "aha");

    for(const id of valid_ids){
        console.log("Not excluded: ", id, exclude)
        const new_exclude = new Set([...Array.from(exclude), id]);
        const ret = backtrack([new_coord, id], size, corners, sides, middles, grid, IDtoTile, tileToID, new_exclude);
        // /console.log("ret: ", ret);
        return ret;
    }
}

function union(arrayA, arrayB){
    return arrayA.filter(item => arrayB.includes(item));
}

function get_ids(IDtoTile, tileToID, corners, sides, middles, grid, coord, size){
    const surrounding = [ grid[coord[0]-1][coord[1]], grid[coord[0]][coord[1]-1] ]; //top side, left side
    const _surroundings = [ tileToID[IDtoTile[surrounding[0]]?.[1]],  tileToID[IDtoTile[surrounding[1]]?.[2]] ];
    const top_side = _surroundings[0] ? _surroundings[0] : []; //bottom of one on top
    const left_side = _surroundings[1] ? _surroundings[1] : [];

    if(coord[0]-1 < 0){ //then at top
        if(coord[1]-1 < 0){ //at top left
            return corners[0];
        }else if(coord[1]+1 == size){ //at top right
            return left_side.filter(item => corners[1].has(item));
        }else{ //sides
            return left_side.filter(item => sides[0].has(item));
        }
    }else if(coord[0]+1 == size){ //then at bottom
        if(coord[1]-1 < 0){ //at bottom left
            return top_side.filter(item => corners[2].has(item));
        }else if(coord[1]+1 == size){ //at bottom right
            return union(top_side, left_side).filter(item => corners[3].has(item));
        }else{ //sides
            return union(top_side, left_side).filter(item => sides[1].has(item));
        }
    }else if(coord[1]-1 < 0){ //at left side
        console.log("AHAHAHA", top_side.filter(item => sides[2].has(item)))
        return top_side.filter(item => sides[2].has(item));
    }else if(coord[1]+1 == size){ //at right side
        return union(top_side, left_side).filter(item => sides[3].has(item));
    }else{ //one of the middles
        return union(top_side, left_side).filter(item => middles.has(item));
    }
}

function separate_data(data){
    const [tiles, tilesToID] = data;
    const size = Math.sqrt(tiles.length/12); //the image is a square, and each tile has 12 tiles made from it
    const corners = [ new Set(), new Set(), new Set(), new Set() ]; //top left, top right, bottom left, bottom right
    const sides = [ new Set(), new Set(), new Set(), new Set() ]; //top, bottom, left, right
    const middles = new Set();
    for(const tile of tiles){ //loop through each tile, and get the tiles with only 2 connections, they must be the corners
        let connection_side_indexes = [];
        for(let i = 0; i < 4; i++){
            if(tilesToID[tile[1][i]].filter((item, index, array) => Math.floor(item/12) != Math.floor(tile[0]/12)).length > 0) connection_side_indexes.push(i);
        }
        if(connection_side_indexes.length == 2){
            if(connection_side_indexes[0] == 1 && connection_side_indexes[1] == 3) corners[0].add(tile[0]);
            if(connection_side_indexes[0] == 1 && connection_side_indexes[1] == 2) corners[1].add(tile[0]);
            if(connection_side_indexes[0] == 0 && connection_side_indexes[1] == 3) corners[2].add(tile[0]);
            if(connection_side_indexes[0] == 0 && connection_side_indexes[1] == 2) corners[3].add(tile[0]);
        }else if(connection_side_indexes.length == 3){
            if(!connection_side_indexes.includes(0)) sides[0].add(tile[0]);
            if(!connection_side_indexes.includes(1)) sides[1].add(tile[0]);
            if(!connection_side_indexes.includes(2)) sides[2].add(tile[0]);
            if(!connection_side_indexes.includes(3)) sides[3].add(tile[0]);
        }else if(connection_side_indexes.length == 4){
            middles.add(tile[0]);
        }
    }
    return [corners, sides, middles];
}

function p2(data){
    const size = Math.sqrt(data[0].length/12);
    const [corners, sides, middles] = separate_data(data);
    const grid = [];
    for(let i = 0; i < size; i++) {
        grid[i] = [];
        for(let j = 0; j < size; j++) grid[i][j] = 0;
    }

    const IDtoTile = Object.fromEntries(data[0]);
    for(const topleft_corner of corners[0]){
        backtrack([[0, 0], topleft_corner], size, corners, sides, middles, grid, IDtoTile, data[1], new Set([topleft_corner]));
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
