const convertColumnToNumber = (col) => {
    if(col === 'l.p.') {
        col = '0';
    }
    return col;
}

export default convertColumnToNumber;
