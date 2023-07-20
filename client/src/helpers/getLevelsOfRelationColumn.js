const getLevelsOfRelationColumn = (indexesOfCorrelatedRows, sheetIndex) => {
    // One to many
    let levelsOfIndexesOfCorrelatedRows = [[]];
    let alreadyUsedIndexes = [[]];

    for(const pair of indexesOfCorrelatedRows) {
        let currentPairLevel = 0;

        while(alreadyUsedIndexes[currentPairLevel].includes(pair[sheetIndex])) {
            currentPairLevel++;

            if(levelsOfIndexesOfCorrelatedRows.length < currentPairLevel+1) {
                levelsOfIndexesOfCorrelatedRows.push([]);
                alreadyUsedIndexes.push([]);
            }
        }

        levelsOfIndexesOfCorrelatedRows[currentPairLevel].push(pair);
        alreadyUsedIndexes[currentPairLevel].push(pair[sheetIndex]);
    }

    return levelsOfIndexesOfCorrelatedRows;
}

export default getLevelsOfRelationColumn;
