const input = "219748365";

function move_cups(current, cup_array){
    const current_index = cup_array.indexOf(current);
    const three_to_cut = [];
    let end_insert_num = 0;
    for(let i = 1; i <= 3; i++){
        const cut_index = (current_index+i) % cup_array.length;
        if(current_index < cut_index) end_insert_num++;
        three_to_cut.push(cup_array[cut_index]);
    }
    const filtered = cup_array.filter(item => !three_to_cut.includes(item));
    const insert_index = mod(get_dest_index(current, filtered), cup_array.length);
    filtered.splice(insert_index, 0, ...three_to_cut);
    if(filtered.indexOf(current) != current_index){
        const end_insert = filtered.splice(0, end_insert_num);
        filtered.splice(filtered.length, 0, ...end_insert);
    }
    return [filtered[mod(filtered.indexOf(current)+1, filtered.length)], filtered];
}

function mod(num, n){
    return (num + n) % n;
}

function get_dest_index(current, cup_array){
    const sorted = cup_array.slice().sort((a, b) => a - b);
    return mod(cup_array.indexOf(sorted[mod(sorted.indexOf(current) - 1, cup_array.length)]) + 1, cup_array.length);
}

function get_in_answer_form(current, cup_array){
    const end_insert = cup_array.splice(0, cup_array.indexOf(current));
    cup_array.shift();
    return [...cup_array, ...end_insert].join("");
}

const arr = input.split("").map(item => parseInt(item));
let start = [ arr[0], arr ];
for(let i = 0; i < 100; i++){
    start = move_cups(...start);
    //console.log(start[1].reduce((str, current) => current == start[0] ? str + " (" + current + ") " : str + " " + current + " ", ""))
}

console.log(get_in_answer_form(1, start[1]))
