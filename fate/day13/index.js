//part 1
function getClosestTime(time, busID){
    return Math.ceil(time/busID)*busID - time;
}

function getData(text){
    text = text.replaceAll("x,", "")
    text = text.split("\n")
    text.pop()
    text[0] = parseInt(text[0])
    text[1] = text[1].split(",").map(num => parseInt(num))
    return text;
}

function goThrough(data){
    let min = -1, minID = 0, lastMin = -2;
    for(const busID of data[1]) {
        if(min == -1){
            min = getClosestTime(data[0], busID);
            minID = busID;
            lastMin = min;
            continue;
        }
        min = Math.min(min, getClosestTime(data[0], busID));
        if(lastMin != min) minID = busID;
        lastMin = min;
    }
    return min*minID;
}

console.log("Part 1: " + goThrough(getData(document.getElementsByTagName("pre")[0].innerText)));
