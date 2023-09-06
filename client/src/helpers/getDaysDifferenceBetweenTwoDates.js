const getDaysDifferenceBetweenTwoDates = (a, b) => {
    const difference = a - b;
    return Math.floor(difference / (24 * 60 * 60 * 1000));
}

export default getDaysDifferenceBetweenTwoDates;
