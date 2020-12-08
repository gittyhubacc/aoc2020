function getData(){
    const text = document.getElementsByTagName("pre")[0].innerText;
    const data = text.split("\n");
    data.pop();
    return data.map(instruction => {
        const processed = instruction.split(" ");
        return [ processed[0], parseInt(processed[1]) ];
    });
}

//p1

function goThroughP1(data){
    let accumulator = 0;
    let visited = new Set();
    for(let i = 0; i < data.length; i++){
        if(visited.has(i)) break;
        visited.add(i);
        const instruction = data[i];
        switch(instruction[0]){
            case "jmp":
                i += instruction[1]-1;
                break;
            case "acc":
                accumulator += instruction[1];
                break;
            default:
                break;
        }
    }
    return accumulator;
}

console.log("Accumulator before the infinite loop: " + goThroughP1(getData()));


//p2

function goThrough(data){
    let accumulator = 0;
    let visited = new Set();
    for(let i = 0; i < data.length; i++){
        if(visited.has(i)) return [ accumulator, false ];
        visited.add(i);
        const instruction = data[i];
        switch(instruction[0]){
            case "jmp":
                i += instruction[1]-1;
                break;
            case "acc":
                accumulator += instruction[1];
                break;
            default:
                break;
        }
    }
    return [ accumulator, true ];
}

function findBug(data){
    for(let i = 0; i < data.length; i++){
        if(data[i][0] == "jmp" || data[i][0] == "nop"){
            const edited_data = data.slice();
            edited_data[i] = data[i][0] == "jmp" ? "nop" : "jmp";
            const returnedData = goThrough(edited_data);
            if(returnedData[1]) return returnedData[0];
        }
    }
}

console.log("Accumulator final value, with bug fixed: " + findBug(getData()));
