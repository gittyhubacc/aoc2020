function getData(text){
    const data= text.split("\n");
    data.pop();
    return data.map(item => parseInt(item))
}

function findDifferences(data){
    let diff1 = 0;
    let diff2 = 0;
    let diff3 = 1;
    data = data.sort((a, b) => a - b);
    for(let i = 0; i < data.length; i++){
        let diff = 0;
        if(i == 0){
            diff = data[i];
        }else{
            diff = data[i] - data[i-1];
        }
        switch(diff){
            case 1:
                diff1++;
                break;
            case 2:
                diff2++;
                break;
            case 3:
                diff3++;
                break;
        }
    }
    return [diff1, diff2, diff3];
}

//let [diff1, diff2, diff3] = findDifferences(getData(document.getElementsByTagName("pre")[0].innerText));
//console.log("Part 1 answer: " + diff1*diff3);
