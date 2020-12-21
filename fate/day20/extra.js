const fs = require("fs");
const text = fs.readFileSync("./input.txt", "utf-8");

function backtrack(current, size, corners, sides, middles, grid, IDtoTile, tileToID, exclude){
  const [coord, tile] = current;

  grid[coord[0]][coord[1]] = tile; //updates the current coord

  if(coord[0] == size-1 && coord[1] == size-1) return [ true, grid ]; //if the current coord is the final coord, we're done

  let incrementX = 0;
  if(coord[0]+1 == size) incrementX++;
  const new_coord = [ (coord[0]+1) % size, (coord[1]+incrementX) % size ]; //increment the new coord correctly, sweeps downward in a straight line
  //ends in bottom right

  let valid_ids = get_ids(IDtoTile, tileToID, grid, new_coord, size, corners, sides, middles); //gets the valid ids
  valid_ids = valid_ids.filter(item => !exclude.has(item)); //filters out excluded items
  if(valid_ids.length == 0) return [ false ]; //if the length is now 0, dead branch
  
  for(const id of valid_ids){ //loop over each valid id
    const new_exclude = new Set([...Array.from(exclude), ...get_exclude_ids(id)]); //add this ID and all the IDs which are from the same base (since all are *12+i), to exclude set
    const ret = backtrack([new_coord, id], size, corners, sides, middles, grid, IDtoTile, tileToID, new_exclude); //recurse one level deeper
    if(ret[0] == false) continue; //ignore dead branches
    return ret; //return true ones
  }
  
  return [ false ]; //if it got here, must be a dead branch, return
}

function get_exclude_ids(id){ //helper function to get the 12 ids which are the same/similar to this one
  const actual_id = Math.floor(id/12);
  const retArray = [];
  for(let i = 0; i < 12; i++){
      retArray.push(actual_id*12 + i);
  }
  return retArray;
}

function union(arrayA, arrayB){ //gets the items in common with 2 array
  return arrayA.filter(item => arrayB.includes(item));
}

function get_ids(IDtoTile, tileToID, grid, coord, size, corners, sides, middles){ //returns ids which may be possible for coord
  const surrounding = [ grid[coord[0]-1]?.[coord[1]], grid[coord[0]]?.[coord[1]-1] ]; //top side, left side
  const _surroundings = [ tileToID[IDtoTile[surrounding[0]]?.[2]],  tileToID[IDtoTile[surrounding[1]]?.[1]] ];
  const top_side = _surroundings[0] ? _surroundings[0] : []; //bottom of one on top
  const left_side = _surroundings[1] ? _surroundings[1] : [];

  if(coord[0]-1 < 0){ //then at top
    if(coord[1]+1 == size){ //at top right
      return left_side.filter(item => corners[1].has(item));
    }else{ //sides
      return left_side.filter(item => sides[0].has(item));
    }
  }else if(coord[0]+1 == size){ //then at bottom
    if(coord[1]-1 < 0){ //at bottom left
      return top_side.filter(item => corners[3].has(item));
    }else if(coord[1]+1 == size){ //at bottom right
      return union(top_side, left_side).filter(item => corners[2].has(item));
    }else{ //sides
      return union(top_side, left_side).filter(item => sides[2].has(item));
    }
  }else if(coord[1]-1 < 0){ //at left side
    return top_side.filter(item => sides[3].has(item));
  }else if(coord[1]+1 == size){ //at right side
    console.log("RIGHT SIDE", coord, union(top_side, left_side).filter(item => sides[1].has(item)))
    return union(top_side, left_side).filter(item => sides[1].has(item));
  }else{ //one of the middles
    return union(top_side, left_side).filter(item => middles.has(item));
  }
}

function separate_data(data){
  const [tiles, tilesToID] = data;
  const corners = [ new Set(), new Set(), new Set(), new Set() ]; //top left, top right, bottom left, bottom right
  const sides = [ new Set(), new Set(), new Set(), new Set() ]; //top, right, bottom, left
  const middles = new Set();

  for(const tile of tiles){ //loop through each tile, and get the tiles with only 2 connections, they must be the corners
    let connection_side_indexes = [];
    for(let i = 0; i < 4; i++){
      if(tilesToID[tile[1][i]].filter(item => Math.floor(item/12) != Math.floor(tile[0]/12)).length > 0) connection_side_indexes.push(i);
    }

    if(connection_side_indexes.length == 2){
      if(connection_side_indexes[0] == 1 && connection_side_indexes[1] == 2) corners[0].add(tile[0]);
      if(connection_side_indexes[0] == 2 && connection_side_indexes[1] == 3) corners[1].add(tile[0]);
      if(connection_side_indexes[0] == 0 && connection_side_indexes[1] == 3) corners[2].add(tile[0]);
      if(connection_side_indexes[0] == 0 && connection_side_indexes[1] == 1) corners[3].add(tile[0]);
    }else if(connection_side_indexes.length == 3){
      if(!connection_side_indexes.includes(0)) sides[0].add(tile[0]);
      if(!connection_side_indexes.includes(1)) sides[1].add(tile[0]);
      if(!connection_side_indexes.includes(2)) sides[2].add(tile[0]);
      if(!connection_side_indexes.includes(3)) sides[3].add(tile[0]);
    }else if(connection_side_indexes.length == 4){
        middles.add(tile[0]);
    }
  }
  return [ corners, sides, middles ];
}

function p2(data){
  const size = Math.sqrt(data[0].length/12);
  
  const [ corners, sides, middles ] = separate_data(data);

  const grid = [];
  for(let i = 0; i < size; i++) {
    grid[i] = [];
    for(let j = 0; j < size; j++) grid[i][j] = 0;
  }

  const IDtoTile = Object.fromEntries(data[0]);

  //console.log(Array.from(corners[0]).map(item => Math.floor(item/12)));
  backtrack([[0, 0], Array.from(corners[0])[0]], size, corners, sides, middles, grid, IDtoTile, data[1], new Set([...get_exclude_ids(Array.from(corners[0])[0])]));

  return grid.map(row => row.map(item => Math.floor(item/12)));

  for(const topleft_corner of corners[0]){
    const reassembled = backtrack([[0, 0], topleft_corner], size, corners, sides, middles, grid, IDtoTile, data[1], new Set([...get_exclude_ids(topleft_corner)]));
    if(reassembled[0]) return reassembled[1].map(row => row.map(item => Math.floor(item/12)));
  }

  return grid;
}

function generate_tiles(A, B, C, D, id){
  const tiles = [];
  tiles.push(...generate_rotations(A, B, C, D).map((item, index) => [ id*12 + index, item ]));
  tiles.push(...generate_rotations(C, flip(B), A, flip(D)).map((item, index) => [ id*12 + index + 4, item ]));
  tiles.push(...generate_rotations(flip(A), D, flip(C), B).map((item, index) => [ id*12 + index + 8, item ]));
  return tiles;
}

function generate_rotations(A, B, C, D){
  const tiles = [];
  tiles.push([A, B, C, D]);
  tiles.push([D, A, B, C]);
  tiles.push([C, D, A, B]);
  tiles.push([B, C, D, A]);
  return tiles;
}

function flip(edge) {
  return edge.split("").reverse().join("");
}

function get_data(text){
  //clockwise, top, right, bottom, left => A, B, C, D
  text = text.split("\n\n");
  text.pop();
  const tiles = [];
  const tileToID = {};
  text = text.map(tile => {
    tile = tile.split(":\n");
    tile[0] = parseInt(tile[0].replace("Tile ", ""));
    tile[1] = tile[1].split("\n");
    const edges = [tile[1][0], "", tile[1][tile[1].length-1], ""];
    for(let j = 0; j < tile[1][0].length; j++){
        edges[1] += tile[1][j][0];
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
