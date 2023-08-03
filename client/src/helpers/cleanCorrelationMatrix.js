const cleanCorrelationMatrix = (dataSheet, relationSheet) => {
    return relationSheet.map(() => {
        return dataSheet.map(() => {
            return -1;
        });
    });
}

export default cleanCorrelationMatrix;
