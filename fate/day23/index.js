const input = "389125467";

const arr = input.split("").map(item => parseInt(item));
const original_length = arr.length;
const sorted_array = arr.slice().sort((a, b) => a - b);
const max = sorted_array[sorted_array.length-1];
/*for(let i = arr.length; i < 1000000; i++){
    arr.push(i - original_length + max);
    sorted_array.push(i - original_length + max);
}*/

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
    const insert_index = get_dest_index(current, cup_array, three_to_cut);
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

function get_dest_index_no_filter(current, cup_array, three_elements){
    let current_elem = three_elements[0];
    let i = 0;
    while(three_elements.includes(current_elem)){
        current_elem = sorted_array[mod(sorted_array.indexOf(current) - ++i, sorted_array.length)];
    }
    return mod(cup_array.indexOf(current_elem) + 1, cup_array.length);
}

function get_in_answer_form(current, cup_array){
    const end_insert = cup_array.splice(0, cup_array.indexOf(current));
    cup_array.shift();
    return [...cup_array, ...end_insert].join("");
}

let start = [ arr[0], arr ];
for(let i = 0; i < 5; i++){
    start = move_cups(...start);
    console.log(start[1].reduce((str, current) => current == start[0] ? str + " (" + current + ") " : str + " " + current + " ", ""))
}

console.log(get_in_answer_form(1, start[1]))
