function evaluate_p1(expr){
    const matching_groups = expr.match(/\([0-9+*\/\-+ ]+\)/g);
    if(matching_groups){
        for(const group of matching_groups){
            const evaluated = evaluate_p1(group.slice(1, group.length-1)).toString();
            expr = expr.replace(group, evaluated);
        }
        if(expr.indexOf("(") !== -1) expr = evaluate_p1(expr).toString();
    }
    if(expr.search(/[*\/+\-\(\)]/) == -1) return parseInt(expr);
    expr = expr.split(" ");
    let retVal = expr[0];
    for(let i = 1; i < expr.length; i+=2){
        retVal = helper(retVal, expr[i+1], expr[i]);
    }
    return retVal;
}

function helper(a, b, sign){
    switch(sign){
        case "+":
            return parseInt(a)+parseInt(b);
        case "*":
            return parseInt(a)*parseInt(b);
    }
}

function evaluate_p2(expr){
    const matching_groups = expr.match(/\([0-9+*\/\-+ ]+\)/g);
    if(matching_groups){
        for(const group of matching_groups){
            const evaluated = evaluate_p2(group.slice(1, group.length-1)).toString();
            expr = expr.replace(group, evaluated);
        }
        if(expr.indexOf("(") !== -1) expr = evaluate_p2(expr).toString();
    }
    if(expr.indexOf("*") !== -1){
        const add_groups = expr.match(/[\d\*\+\(\)]+( \+ [\d\*\+\(\)]+)+/g);
        if(add_groups){
            for(const group of add_groups){
                expr = expr.replace(group, "(" + group + ")");
            }
        }
        if(expr.indexOf("(") !== -1) expr = evaluate_p2(expr).toString();
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
    if(part2) return input.reduce((sum, current) => sum += evaluate_p2(current), 0);
    return input.reduce((sum, current) => sum += evaluate_p1(current), 0);
}

console.log("Part 1: " + run(document.getElementsByTagName("pre")[0].innerText, false));
console.log("Part 2: " + run(document.getElementsByTagName("pre")[0].innerText, true));
