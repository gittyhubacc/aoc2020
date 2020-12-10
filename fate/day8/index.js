var fs = require("fs");
var text = fs.readFileSync("./input.txt", "utf-8");

function main(data){
    let current_total = 0, last_total = 0, prev1total = 0, prev2total = 0, prev3total = 0, sumThisIter = 0, diff1 = 0, diff3 = 1;
    for(let i = 0; i < data.length; i++){
    	prev3total = prev2total;
    	prev2total = prev1total;
    	prev1total = current_total;
    	current_total = 0;
        sumThisIter = 0;
        
        if(data[i-1] == 0) sumThisIter++;
        if(data[i] - data[i-2] <= 3){
            if(data[i-2] == 0) sumThisIter++;
            sumThisIter += prev2total;
        }

        if(data[i] - data[i-3] <= 3){
            if(data[i-3] == 0) sumThisIter++;
            sumThisIter += prev3total;
        }

        current_total += sumThisIter + prev1total;
        
        switch(data[i] - (data[i-1] ? data[i-1] : 0)){
            case 1:
            	diff1++;
            	break;
            case 3:
            	diff3++;
	}
            
    }

    console.log("Part 1: " + diff1*diff3);
    console.log("Part 2: " + current_total);
}

function getData(text){
    const data= text.split("\n");
    data.pop();
    return [0, ...data.map(item => parseInt(item)).sort((a, b) => a-b)]
}

main(getData(text));
