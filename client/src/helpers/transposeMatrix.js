const transposeMatrix = (matrix) => {
    if (!matrix || matrix.length === 0) {
        return [];
    }

    const numRows = matrix.length;
    const numCols = matrix[0].length;

    const transposedMatrix = [];

    for (let j = 0; j < numCols; j++) {
        const newRow = [];
        for (let i = 0; i < numRows; i++) {
            newRow.push(matrix[i][j]);
        }
        transposedMatrix.push(newRow);
    }

    return transposedMatrix;
}

export default transposeMatrix;
