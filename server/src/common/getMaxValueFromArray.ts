const getMaxValueFromArray = (arr) => {
    let max = -999999;

    for(const el of arr) {
        if(el > max) {
            max = el;
        }
    }

    return max;
}

export default getMaxValueFromArray;
