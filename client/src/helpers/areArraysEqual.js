const areArraysEqual = (arrA, arrB) => {
    return arrA.findIndex((item, index) => {
        return item !== arrB[index];
    }) === -1;
}

export default areArraysEqual;
