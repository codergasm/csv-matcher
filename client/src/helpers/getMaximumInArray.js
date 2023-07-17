const getMaximumInArray = (arr) => {
    let maxEl = arr[0];
    for(let i=0; i< arr.length; i++) {
        if(arr[i] > maxEl) {
            maxEl = arr[i];
        }
    }
    return maxEl;
}

export default getMaximumInArray;
