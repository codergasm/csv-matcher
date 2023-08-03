const getNumberOfOccurrencesInArray = (el, arr) => {
    return arr.filter((item) => (item === el)).length;
}

export default getNumberOfOccurrencesInArray;
