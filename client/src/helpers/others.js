const sortByColumn = (sheet, column, type) => {
    const sortSheet = [...sheet];

    const isColumnWithNumbers = sheet
        .slice(0, 10)
        .findIndex((item) => (isNaN(parseInt(item[column])))) === -1;

    if(isColumnWithNumbers) {
        if(type === 1) {
            return sortSheet.sort((a, b) => {
                return parseFloat(a[column]) < parseFloat(b[column]) ? -1 : 1;
            });
        }
        else {
            return sortSheet.sort((a, b) => {
                return parseFloat(a[column]) > parseFloat(b[column]) ? -1 : 1;
            });
        }
    }
    else {
        if(type === 1) {
            return sortSheet.sort((a, b) => {
                return a[column] < b[column] ? -1 : 1;
            });
        }
        else {
            return sortSheet.sort((a, b) => {
                return a[column] > b[column] ? -1 : 1;
            });
        }
    }
}

const sortRelationColumn = (sheet, indexesOfCorrelatedRows, type) => {
    if(type === 1) {
        // Matched rows first
        const sortedSheet = [...sheet];

        return sortedSheet.sort((a, b) => {
            const aIndex = sortedSheet.indexOf(a);
            const bIndex = sortedSheet.indexOf(b);

            if(indexesOfCorrelatedRows[aIndex] !== -1 && indexesOfCorrelatedRows[bIndex] === -1) {
                return 1;
            }
            else if(indexesOfCorrelatedRows[bIndex] !== -1 && indexesOfCorrelatedRows[aIndex] === -1) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }
    else if(type === 2) {
        // Unmatched rows first
        const sortedSheet = [...sheet];

        return sortedSheet.sort((a, b) => {
            const aIndex = sortedSheet.indexOf(a);
            const bIndex = sortedSheet.indexOf(b);

            if(indexesOfCorrelatedRows[aIndex] !== -1 && indexesOfCorrelatedRows[bIndex] === -1) {
                // console.log(`>>> 1: ${aIndex} ${bIndex}`);
                return -1;
            }
            else if(indexesOfCorrelatedRows[bIndex] !== -1 && indexesOfCorrelatedRows[aIndex] === -1) {
                // console.log(`>>> 2: ${aIndex} ${bIndex}`);
                return 1;
            }
            else {
                return 0;
            }
        });
    }
    else {
        return [...sheet];
    }
}

export { sortByColumn, sortRelationColumn }
