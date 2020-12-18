function helper(a, b, sign){
    switch(sign){
        case "+":
            return parseInt(a)+parseInt(b);
        case "*":
            return parseInt(a)*parseInt(b);
    }
}

function evaluate(expr, part2){
    const matching_groups = expr.match(/\([0-9+*\/\-+ ]+\)/g);
    if(matching_groups){
        for(const group of matching_groups){
            const evaluated = evaluate(group.slice(1, group.length-1), part2).toString();
            expr = expr.replace(group, evaluated);
        }
        if(expr.indexOf("(") !== -1) expr = evaluate(expr, part2).toString();
    }
    if(part2){
        if(expr.indexOf("*") !== -1){
            const add_groups = expr.match(/[\d\*\+\(\)]+( \+ [\d\*\+\(\)]+)+/g);
            if(add_groups){
                for(const group of add_groups){
                    expr = expr.replace(group, "(" + group + ")");
                }
            }
            if(expr.indexOf("(") !== -1) expr = evaluate(expr, part2).toString();
        }
    }
    if(expr.search(/[*\/+\-\(\)]/) == -1) return parseInt(expr);
    expr = expr.split(" ");
    let retVal = expr[0];
    for(let i = 1; i < expr.length; i+=2){
        retVal = helper(retVal, expr[i+1], expr[i]);
    }
    return retVal;
}

function run(input, part2){
    input = input.split("\n");
    input.pop();
    return input.reduce((sum, current) => sum += evaluate(current, part2), 0);
}

console.log("Part 1: " + run(document.getElementsByTagName("pre")[0].innerText, false));
console.log("Part 2: " + run(document.getElementsByTagName("pre")[0].innerText, true));
