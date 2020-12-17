function get_data(text){
    text = text.split("\n").map(row => row.split(""))
    text.pop();
    const grid = {};
    for(let i = 0; i < text.length; i++){
        for(let j = 0; j < text[0].length; j++){
            if(text[i][j] == "#"){
                if(!grid[i]) grid[i] = {};
                if(!grid[i][j]) grid[i][j] = {};
                grid[i][j][0] = "#";
            }
        }
    }
    return grid;
}

function populate_surrounding(coords, cache){
    coords = coords.map(coord => parseInt(coord));
    const to_key = (input) => input.reduce((total, coord) => total += coord.toString()+",", "");
    for(let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){
            for(let k = -1; k <= 1; k++){
                if(i == 0 && j == 0 && k == 0) continue;
                const key = to_key([coords[0]+i, coords[1]+j, coords[2]+k]);
                if(!cache[key]) cache[key] = 0;
                cache[key]++;
            }
        }
    }
}

function update(data){
    const cache_map = {};
    for(const x of Object.entries(data)){
        for(const y of Object.entries(x[1])){
            for(const z of Object.entries(y[1])){
                populate_surrounding([x[0],y[0],z[0]], cache_map)
            }
        }
    }
    const new_data = {};
    for(const item of Object.entries(cache_map)){
        if(item[1] == 3){
            const coord = item[0].split(",");
            coord.pop();
            if(!new_data[coord[0]]) new_data[coord[0]] = {};
            if(!new_data[coord[0]][coord[1]]) new_data[coord[0]][coord[1]] = {};
            new_data[coord[0]][coord[1]][coord[2]] = "#";
        }else if(item[1] == 2){
            const coord = item[0].split(",");
            coord.pop();
            if(data[coord[0]]?.[coord[1]]?.[coord[2]] == "#"){
                if(!new_data[coord[0]]) new_data[coord[0]] = {};
                if(!new_data[coord[0]][coord[1]]) new_data[coord[0]][coord[1]] = {};
                new_data[coord[0]][coord[1]][coord[2]] = "#";
            }
        }
    }
    let count = 0;
    for(const x of Object.entries(new_data)){
        for(const y of Object.entries(x[1])){
            for(const z of Object.entries(y[1])){
                count++;
            }
        }
    }
    return [count, new_data];
}


function do_p1(){
    let data = get_data(document.getElementsByTagName("pre")[0].innerText)
    let count = 0;
    for(let i = 0; i < 6; i++){
        [count, data] = update(data);
    }
    return count;
}

function populate_surrounding_p2(coords, cache){
    coords = coords.map(coord => parseInt(coord));
    const to_key = (input) => input.reduce((total, coord) => total += coord.toString()+",", "");
    for(let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){
            for(let k = -1; k <= 1; k++){
                for(let h = -1; h <= 1; h++){
                    if(i == 0 && j == 0 && k == 0 && h == 0) continue;
                    const key = to_key([coords[0]+i, coords[1]+j, coords[2]+k, coords[3]+h]);
                    if(!cache[key]) cache[key] = 0;
                    cache[key]++;
                }
            }
        }
    }
}

function update_p2(data){
    const cache_map = {};
    for(const x of Object.entries(data)){
        for(const y of Object.entries(x[1])){
            for(const z of Object.entries(y[1])){
                for(const w of Object.entries(z[1])){
                    populate_surrounding_p2([x[0],y[0],z[0], w[0]], cache_map)
                }
            }
        }
    }
    const new_data = {};
    for(const item of Object.entries(cache_map)){
        if(item[1] == 3){
            const coord = item[0].split(",");
            coord.pop();
            if(!new_data[coord[0]]) new_data[coord[0]] = {};
            if(!new_data[coord[0]][coord[1]]) new_data[coord[0]][coord[1]] = {};
            if(!new_data[coord[0]][coord[1]][coord[2]]) new_data[coord[0]][coord[1]][coord[2]] = {};
            new_data[coord[0]][coord[1]][coord[2]][coord[3]] = "#";
        }else if(item[1] == 2){
            const coord = item[0].split(",");
            coord.pop();
            if(data[coord[0]]?.[coord[1]]?.[coord[2]]?.[coord[3]] == "#"){
                if(!new_data[coord[0]]) new_data[coord[0]] = {};
                if(!new_data[coord[0]][coord[1]]) new_data[coord[0]][coord[1]] = {};
                if(!new_data[coord[0]][coord[1]][coord[2]]) new_data[coord[0]][coord[1]][coord[2]] = {};
                new_data[coord[0]][coord[1]][coord[2]][coord[3]] = "#";
            }
        }
    }
    let count = 0;
    for(const x of Object.entries(new_data)){
        for(const y of Object.entries(x[1])){
            for(const z of Object.entries(y[1])){
                for(const w of Object.entries(z[1])){
                    count++;
                }
            }
        }
    }
    return [count, new_data];
}

function get_data_p2(text){
    text = text.split("\n").map(row => row.split(""))
    text.pop();
    const grid = {};
    for(let i = 0; i < text.length; i++){
        for(let j = 0; j < text[0].length; j++){
            if(text[i][j] == "#"){
                if(!grid[i]) grid[i] = {};
                if(!grid[i][j]) grid[i][j] = {};
                if(!grid[i][j][0]) grid[i][j][0] = {};
                grid[i][j][0][0] = "#";
            }
        }
    }
    return grid;
}

function do_p2(){
    let data = get_data_p2(document.getElementsByTagName("pre")[0].innerText)
    let count = 0;
    for(let i = 0; i < 6; i++){
        [count, data] = update_p2(data);
    }
    return count;
}

console.log("Part 1: " + do_p1());
console.log("Part 2: " + do_p2());
