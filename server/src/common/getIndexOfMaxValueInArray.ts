const getIndexOfMaxValueInArray = (arr) => {
    let maxVal = 0;
    let indexWithMaxValue = 0;
    let arrIndex = 0;

    for(const el of arr) {
        if(el > maxVal) {
            maxVal = el;
            indexWithMaxValue = arrIndex;
        }
        arrIndex++;
    }

    return indexWithMaxValue;
}

export default getIndexOfMaxValueInArray;
