const generateUniqueSixDigitNumber = (inputArray, n) => {
    let number;
    do {
        number = Math.floor(Math.random() * 90 * (n-2)) + 10 * (n-2);
    } while (inputArray.includes(number));

    return number;
}

export default generateUniqueSixDigitNumber;
