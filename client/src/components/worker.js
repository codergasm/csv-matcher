function calculateValue(inputValue) {
    // długie obliczenia
    return Math.pow(inputValue, 2);
}

onmessage = function (event) {
    const calculatedValue = calculateValue(event.data.inputValue);
    postMessage({ calculatedValue });
};
