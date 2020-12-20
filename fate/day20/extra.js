function backtrack(current, size, corners, sides, middles, grid, IDtoTile, tileToID, exclude){
    const [coord, tile] = current;

    //console.log(tile, IDtoTile[tile]);
    grid[coord[0], coord[1]] = tile;

    if(coord[0] == size-1 && coord[1] == size-1) return [true, grid];

    let incrementX = 0;
    if(coord[0]+1 == size) incrementX++;
    const new_coord = [ (coord[0]+1) % size, (coord[1]+incrementX) % size ];

    const surrounding = [ grid[new_coord[0]-1, new_coord[1]], grid[new_coord[0], new_coord[1]-1] ];

    let valid_ids = get_ids(IDtoTile, tileToID, corners, sides, middles, grid, tile, new_coord, size);
    if(valid_ids){
        valid_ids = valid_ids.filter(item => !exclude.has(item));
        console.log(valid_ids);
    }

    return backtrack([new_coord, tile], size, corners, sides, middles, grid, IDtoTile, tileToID, exclude);
}

function get_ids(IDtoTile, tileToID, corners, sides, middles, grid, id, coord, size){
    if(coord[0]-1 < 0){ //then at top
        if(coord[1]-1 < 0){ //at top left
            const side = IDtoTile[id][2];
            return tileToID[side].filter(item => corners[0].has(item));
        }else if(coord[1]+1 == size){ //at top right
            const side = IDtoTile[id][2];
            return tileToID[side].filter(item => corners[1].has(item));
        }else{ //sides
            
        }
    }else if(coord[0]+1 == size){ //then at bottom
        if(coord[1]-1 < 0){ //at bottom left
            const side = IDtoTile[id][2];
            return tileToID[side].filter(item => corners[2].has(item));
        }else if(coord[1]+1 == size){ //at bottom right
            const side = IDtoTile[id][2];
            return tileToID[side].filter(item => corners[3].has(item));
        }else{ //sides

        }
    }else if(coord[1]-1 < 0){ //at left side

    }else if(coord[1]+1 == size){ //at right side

    }else{ //one of the middles

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

    const IDtoTile = Object.fromEntries(data[0]);
    for(const topleft_corner of corners[0]){
        backtrack([[0, 0], topleft_corner], size, corners, sides, middles, grid, IDtoTile, data[1], new Set([topleft_corner]));
    }

    for(let i = 0; i < size; i++) grid[i] = [];
    return grid;
}
