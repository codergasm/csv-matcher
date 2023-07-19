const getMinValueFromArray = (arr) => {
    let min = 999999;

    for(const el of arr) {
        if(el < min) {
            min = el;
        }
    }

    return min;
}

export default getMinValueFromArray;
