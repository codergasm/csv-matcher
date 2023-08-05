const createUniqueArray = (arr) => {
    return [...new Set(arr.map((item) => (JSON.stringify(item))))].map((item) => (JSON.parse(item)));
}

export default createUniqueArray;
