import {HttpException, Inject, Injectable} from '@nestjs/common';
import { stringSimilarity } from "string-similarity-js";
import * as fs from "fs";
import * as papa from 'papaparse';
import {Repository} from "typeorm";
import {CorrelationJobsEntity} from "./entities/correlation_jobs.entity";
import {InjectRepository} from "@nestjs/typeorm";
import * as path from 'path';
import getMaxValueFromArray from "./common/getMaxValueFromArray";
import getMinValueFromArray from "./common/getMinValueFromArray";
import convertStringToBoolean from "./common/convertStringToBoolean";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectRepository(CorrelationJobsEntity)
        private readonly correlationJobs: Repository<CorrelationJobsEntity>
    ) {
        this.progressCount = 0;
    }

    private progressCount: number;

    async getProgressByJobId(jobId) {
        return this.correlationJobs.findOneBy({
            id: jobId
        });
    }

    async convertFileToArrayOfObjects(file) {
        const filepath = typeof file === 'string' ? path.resolve(__dirname, `../${file}`) : file.path;
        const dataFileContent = fs.readFileSync(filepath, 'utf-8');
        return papa.parse(dataFileContent, { header: true }).data;
    }

    findLongestSubstring(X, Y) {
        const m = X.length;
        const n = Y.length;

        let LCStuff = Array(m + 1).fill(0).map(()=>Array(n + 1).fill(0));

        let result = 0;
        let i, j;

        for (i = 0; i <= m; i++) {
            for (j = 0; j <= n; j++) {
                if (i == 0 || j == 0)
                    LCStuff[i][j] = 0;
                else if (X[i - 1] == Y[j - 1]) {
                    LCStuff[i][j] = LCStuff[i - 1][j - 1] + 1;
                    result = Math.max(result, LCStuff[i][j]);
                } else
                    LCStuff[i][j] = 0;
            }
        }

        return result;
    }

    getSimilarityFunction(type: number, a, b) {
        if(type === 0) {
            return stringSimilarity(a, b);
        }
        else if(type === 1) {
            const res = this.findLongestSubstring(a, b);
            return res / a.length;
        }
        else {
            return this.findLongestSubstring(a, b) / b.length;
        }
    }

    getCorrelationMatrixWithEmptySimilarities(dataSheetLength, relationSheetLength) {
        try {
            return Array.from(Array(parseInt(relationSheetLength)).keys()).map((relationRowItem, relationRowIndex) => {
                return Array.from(Array(parseInt(dataSheetLength)).keys()).map((dataRowItem, dataRowIndex) => {
                    return [dataRowIndex, relationRowIndex, -1];
                });
            });
        }
        catch(e) {
            throw new HttpException(e, 500, {cause: new Error('error')});
        }
    }

    transposeMatrix(matrix) {
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

    async getSelectList(dataSheetLength, relationSheetLength) {
        const relationSheetSelectList = this.getCorrelationMatrixWithEmptySimilarities(dataSheetLength, relationSheetLength);
        const dataSheetSelectList = this.transposeMatrix(relationSheetSelectList);

        return {
            relationSheetSelectList,
            dataSheetSelectList
        }
    }

    async getSimilarityScores(jobId, conditions, correlationMatrix, dataSheet,
                              relationSheet, indexesOfCorrelatedRows, overrideAllRows, fromSelect) {
        let allSimilarities = [];
        let i = 0;

        for(const relationRow of relationSheet) {
            let relationRowSimilarities = [];

            if(this.alreadyHaveMatchAndNoOverrideOptionSelected(indexesOfCorrelatedRows[i], overrideAllRows, correlationMatrix)) {
                relationRowSimilarities = correlationMatrix[i];
            }
            else {
                for(const dataRow of dataSheet) {
                    // Calculate similarities
                    let similarities = [];

                    for(const condition of conditions) {
                        const dataSheetPart = dataRow[condition.dataSheet];
                        const relationSheetPart = relationRow[condition.relationSheet];
                        const matchFunction = condition.matchFunction;

                        if(dataSheetPart && relationSheetPart) {
                            const similarity = this.getSimilarityFunction(parseInt(matchFunction),
                                dataSheetPart.toString(), relationSheetPart.toString());
                            similarities.push(similarity);
                        }
                        else {
                            similarities.push(0);
                        }
                    }

                    relationRowSimilarities.push(similarities.map((item) => {
                        return Math.max(item * 100, 0);
                    }));
                }
            }

            i++;
            allSimilarities.push(relationRowSimilarities);
            await this.updateJobProgress(i, jobId, relationSheet.length, fromSelect);
        }

        return allSimilarities;
    }

    alreadyHaveMatchAndNoOverrideOptionSelected(indexesOfCorrelatedRowsItem, overrideAllRows, correlationMatrix) {
        return (indexesOfCorrelatedRowsItem !== -1) && (!overrideAllRows) && correlationMatrix;
    }

    async updateJobProgress(i, jobId, relationSheetLength, fromSelect) {
        if(!(i % 20) && jobId) {
            await this.correlationJobs
                .createQueryBuilder()
                .update({
                    rowCount: fromSelect ? ((relationSheetLength / 2) + (i / 2)) : (i / 2)
                })
                .where({
                    id: jobId
                })
                .execute();
        }
    }

    async getCorrelationMatrix(jobId, priorities, correlationMatrix, dataSheet, relationSheet,
                               indexesOfCorrelatedRows, overrideAllRows, fromSelect = false) {
        // correlationMatrix: [relationSheetRow1[dataSheetRow1[priorities[cond1, cond2...]]], []]
        // single value in correlationMatrix: [[cond1Similarity], [cond1Similarity, cond2Similarity...] ...]
        let correlationMatricesForAllPriorities = [];
        let priorityIndex = 0;

        for(const priority of priorities) {
            // Get similarities for all rows for current priority
            // [[relationRow1 [dataRow1[cond1, cond2, cond3], dataRow2[...]], relationRow2...]
            // [[[cond1, cond2], [cond1, cond2]]]
            let currentPriorityCorrelationMatrix = [];
            const similarityScores = await this.getSimilarityScores(jobId, priority.conditions, correlationMatrix,
                dataSheet, relationSheet,
                indexesOfCorrelatedRows, overrideAllRows, fromSelect);

            let relationRowIndex = 0;
            for(const relationRowSimilarities of similarityScores) {
                currentPriorityCorrelationMatrix.push(relationRowSimilarities);
                relationRowIndex++;
            }

            priorityIndex++;
            correlationMatricesForAllPriorities.push(currentPriorityCorrelationMatrix);
        }

        // Convert array of correlation matrices to one huge correlationMatrix
        let outputCorrelationMatrix = [];
        for(let i=0; i<relationSheet.length; i++) {
            outputCorrelationMatrix.push([]);
            for(let j=0; j<dataSheet.length; j++) {
                outputCorrelationMatrix[i].push(correlationMatricesForAllPriorities.map((item) => {
                    return item[i][j];
                }));
            }
        }

        return outputCorrelationMatrix;
    }

    areRowsAvailableBasedOnOverrideSettings(dataRow, relationRow, overrideAllRows,
                                            avoidOverrideForManuallyCorrelatedRows, manuallyCorrelatedRows) {
        if(overrideAllRows && !avoidOverrideForManuallyCorrelatedRows) {
            return true;
        }
        else if(overrideAllRows && avoidOverrideForManuallyCorrelatedRows) {
            return manuallyCorrelatedRows.includes([dataRow, relationRow]);
        }
        else {
            return false;
        }
    }

    areRowsAvailableOneToOneRelation(dataRow, relationRow, indexesOfCorrelatedRows) {
        const dataRowAvailable = !indexesOfCorrelatedRows
            .map((item) => (item[0]))
            .includes(dataRow);
        const relationRowAvailable = !indexesOfCorrelatedRows
            .map((item) => (item[1]))
            .includes(relationRow);

        return dataRowAvailable && relationRowAvailable;
    }
    areRowsAvailableOneToManyRelation(dataRow, relationRow, indexesOfCorrelatedRows) {
        return !indexesOfCorrelatedRows
            .map((item) => (item[1]))
            .includes(relationRow);
    }

    areRowsAvailableManyToOneRelation(dataRow, relationRow, indexesOfCorrelatedRows) {
        return !indexesOfCorrelatedRows
            .map((item) => (item[0]))
            .includes(dataRow);
    }

    areRowsAvailableManyToManyRelation(dataRow, relationRow, indexesOfCorrelatedRows,
                                       overrideAllRows, avoidOverrideForManuallyCorrelatedRows, manuallyCorrelatedRows) {
        return true;
    }

    isPriorityFulfilled(similarities, matchThresholds, conditionsRequired, numberOfRequiredConditions) {
        let numberOfFulfilledConditions = 0;

        for(let i=0; i<similarities.length; i++) {
            const conditionFulfilled = parseInt(similarities[i]) >= parseInt(matchThresholds[i]);

            if(conditionFulfilled) {
                numberOfFulfilledConditions++;
            }
            else {
                if(parseInt(conditionsRequired[i])) {
                    return false;
                }
            }
        }

        return numberOfFulfilledConditions >= numberOfRequiredConditions;
    }

    async correlate(correlationId, jobId, dataFile, relationFile,
                    priorities, overrideAllRows,
                    avoidOverrideForManuallyCorrelatedRows, manuallyCorrelatedRows,
                    userId, matchType, prevIndexesOfCorrelatedRows, prevCorrelationMatrix,
                    relationTestRow = -1) {
        // indexesOfCorrelatedRows to tutaj tablica par, które są już skorelowane i których nie wolno nadpisać
        let newCorrelationMatrix, i, newIndexesOfCorrelatedRows, selectListIndicators;
        let relationSheetLength;

        console.log(prevIndexesOfCorrelatedRows);

        let dataSheet = await this.convertFileToArrayOfObjects(dataFile);
        let relationSheet = await this.convertFileToArrayOfObjects(relationFile);

        relationSheetLength = relationSheet.length;

        // [[priority, condition, isConstant]] - tablica wskazujaca, ktory selectList wyswietlic dla danych rekordow
        // wypelniamy nullami zeby moc potem zmieniac wartosci na pozycji [i][j]
        selectListIndicators = relationSheet.map(() => {
            return dataSheet.map(() => {
                return null;
            });
        });

        if(relationTestRow !== -1 && !isNaN(relationTestRow)) {
            relationSheet = [relationSheet[relationTestRow]];
        }

        await this.addNewCorrelationJob(jobId, userId, relationSheetLength);

        // Get correlation matrix
        newCorrelationMatrix = await this.getCorrelationMatrix(jobId, priorities, prevCorrelationMatrix,
            dataSheet, relationSheet,
            prevIndexesOfCorrelatedRows, overrideAllRows);
        i = 0;
        newIndexesOfCorrelatedRows = prevIndexesOfCorrelatedRows;

        const setSelectListIndicatorForNotMatchedRow = (relationRowIndex, dataRowIndex, sumOfRequiredConditions,
                                                        currentPriorityRequired, currentPrioritySimilarities) => {
            if(sumOfRequiredConditions > 0) {
                const requiredConditionsSimilarities = currentPrioritySimilarities.filter((item, index) => {
                    return currentPriorityRequired[index];
                })
                const minValueFromRequiredConditions = getMinValueFromArray(requiredConditionsSimilarities);
                const indexOfMinValueFromRequiredConditions = currentPrioritySimilarities.indexOf(minValueFromRequiredConditions);

                if(!selectListIndicators[relationRowIndex][dataRowIndex]) {
                    selectListIndicators[relationRowIndex][dataRowIndex] =
                        [i, indexOfMinValueFromRequiredConditions, minValueFromRequiredConditions, 0]
                }
                else if(minValueFromRequiredConditions < selectListIndicators[relationRowIndex][dataRowIndex][2]) {
                    if(!selectListIndicators[relationRowIndex][dataRowIndex][3]) {
                        selectListIndicators[relationRowIndex][dataRowIndex] =
                            [i, indexOfMinValueFromRequiredConditions, minValueFromRequiredConditions, 0]
                    }
                }
            }
            else {
                const optionalConditionsSimilarities = currentPrioritySimilarities.filter((item, index) => {
                    return !currentPriorityRequired[index];
                });
                const maxValueFromOptionalConditions = getMaxValueFromArray(optionalConditionsSimilarities);
                const indexOfMaxValueFromOptionalConditions = currentPrioritySimilarities.indexOf(maxValueFromOptionalConditions);

                if(!selectListIndicators[relationRowIndex][dataRowIndex]) {
                    selectListIndicators[relationRowIndex][dataRowIndex] =
                        [i, indexOfMaxValueFromOptionalConditions, maxValueFromOptionalConditions, 0]
                }
                else if(maxValueFromOptionalConditions > selectListIndicators[relationRowIndex][dataRowIndex][2]) {
                    if(!selectListIndicators[relationRowIndex][dataRowIndex][3]) {
                        selectListIndicators[relationRowIndex][dataRowIndex] =
                            [i, indexOfMaxValueFromOptionalConditions, maxValueFromOptionalConditions, 0]
                    }
                }
            }

            return selectListIndicators;
        }

        // Update indexesOfCorrelatedRows based on availability
        // Decide which rows meet all given conditions (priorities)
        let areRowsAvailable;

        if(matchType === 0) {
            areRowsAvailable = this.areRowsAvailableOneToOneRelation;
        }
        else if(matchType === 1) {
            areRowsAvailable = this.areRowsAvailableOneToManyRelation;
        }
        else if(matchType === 2) {
            areRowsAvailable = this.areRowsAvailableManyToOneRelation;
        }
        else {
            areRowsAvailable = this.areRowsAvailableManyToManyRelation;
        }

        const overrideAllRowsBoolean = convertStringToBoolean(overrideAllRows);
        const avoidOverrideForManuallyCorrelatedRowsBoolean = convertStringToBoolean(avoidOverrideForManuallyCorrelatedRows);

        try {
            for(let i=0; i<priorities.length; i++) {
                const currentPriority = priorities[i];
                const currentPriorityNumberOfRequiredConditions = currentPriority.requiredConditions;
                const currentPriorityMatchThresholds = currentPriority.conditions.map((item) => (item.matchThreshold));
                const currentPriorityRequired = currentPriority.conditions.map((item) => (item.required));
                const sumOfRequiredConditions = currentPriority.conditions.filter((item) => (item.required)).length;

                let relationRowIndex = 0;

                for(const relationRowSimilarities of newCorrelationMatrix) {
                    let dataRowIndex = 0;

                    for(const dataRow of relationRowSimilarities) {
                        const currentPrioritySimilarities = dataRow[i];

                        if(this.isPriorityFulfilled(currentPrioritySimilarities, currentPriorityMatchThresholds,
                            currentPriorityRequired, currentPriorityNumberOfRequiredConditions)) {
                            if(areRowsAvailable(dataRowIndex, relationRowIndex, newIndexesOfCorrelatedRows) || this.areRowsAvailableBasedOnOverrideSettings(
                                dataRowIndex, relationRowIndex,
                                overrideAllRowsBoolean, avoidOverrideForManuallyCorrelatedRowsBoolean, manuallyCorrelatedRows
                            )) {
                                // Update indexesOfCorrelatedRows
                                if(matchType === 0) {
                                    newIndexesOfCorrelatedRows = newIndexesOfCorrelatedRows.filter((item) => {
                                        return item[0] !== dataRowIndex && item[1] !== relationRowIndex;
                                    });
                                }
                                else if(matchType === 1) {
                                    newIndexesOfCorrelatedRows = newIndexesOfCorrelatedRows.filter((item) => {
                                        return item[1] !== relationRowIndex;
                                    });
                                }
                                else if(matchType === 2) {
                                    newIndexesOfCorrelatedRows = newIndexesOfCorrelatedRows.filter((item) => {
                                        return item[0] !== dataRowIndex;
                                    });
                                }

                                newIndexesOfCorrelatedRows.push([dataRowIndex, relationRowIndex]);

                                const maxValueOfAllConditions = getMaxValueFromArray(currentPrioritySimilarities);
                                const indexOfMaxValueFromAllConditions = currentPrioritySimilarities.indexOf(maxValueOfAllConditions);

                                // Match between dataRow and relationRow - set select list indicator for maximum condition
                                selectListIndicators[relationRowIndex][dataRowIndex] =
                                    [i, indexOfMaxValueFromAllConditions, maxValueOfAllConditions, 1];
                            }
                            else {
                                selectListIndicators = setSelectListIndicatorForNotMatchedRow(relationRowIndex, dataRowIndex,
                                    sumOfRequiredConditions, currentPriorityRequired, currentPrioritySimilarities);
                            }
                        }
                        else {
                            selectListIndicators = setSelectListIndicatorForNotMatchedRow(relationRowIndex, dataRowIndex,
                                sumOfRequiredConditions, currentPriorityRequired, currentPrioritySimilarities);
                        }

                        dataRowIndex++;
                    }

                    relationRowIndex++;
                }
            }
        }
        catch(e) {
            console.log('error 1');
            console.log(e);
        }

        await this.finishCorrelationJob(jobId, relationSheetLength);

        let correlationMatrixToReturn = newCorrelationMatrix.map((relationRowItem, relationRowIndex) => {
            return relationRowItem.map((dataRowItem, dataRowIndex) => {
                const [priority, condition] = selectListIndicators[relationRowIndex][dataRowIndex];
                return parseInt(dataRowItem[priority][condition].toFixed());
            });
        });

        // OVERRIDE PART
        const checkIfRowsAvailable = (dataRow, relationRow, indexesTaken) => {
            const dataRowAvailable = !indexesTaken.map((item) => (item[0]))
                .includes(dataRow);
            const relationRowAvailable = !indexesTaken.map((item) => (item[1]))
                .includes(relationRow);

            return dataRowAvailable && relationRowAvailable;
        }

        if(!overrideAllRows) {
            // dopasuj tylko te, które jeszcze nie mają dopasowania
            const newIndexesOfCorrelatedRowsWithoutAlreadyMatchedRows = newIndexesOfCorrelatedRows.filter((item) => {
                return checkIfRowsAvailable(item[0], item[1], prevIndexesOfCorrelatedRows);
            });

            newIndexesOfCorrelatedRows = [
                ...newIndexesOfCorrelatedRowsWithoutAlreadyMatchedRows,
                prevIndexesOfCorrelatedRows
            ]
        }
        else if(overrideAllRows) {
            // nadpisz (wszystkie/wszystkie automatyczne) rekordy jeśli znajdziesz nowe dopasowanie
            let allIndexesOfCorrelatedRows = [];
            let excludedIndexesOfCorrelatedRows = [];
            const correlatedDataSheetIndexes = newIndexesOfCorrelatedRows.map((item) => (item[0]));
            const correlatedRelationSheetIndexes = newIndexesOfCorrelatedRows.map((item) => (item[1]));

            if(matchType === 0) {
                allIndexesOfCorrelatedRows = prevIndexesOfCorrelatedRows.filter((item) => {
                    return !correlatedDataSheetIndexes.includes(item[0]) && !correlatedRelationSheetIndexes.includes(item[1]);
                }).concat(newIndexesOfCorrelatedRows);

                excludedIndexesOfCorrelatedRows = prevIndexesOfCorrelatedRows.filter((item) => {
                    return correlatedDataSheetIndexes.includes(item[0]) || correlatedRelationSheetIndexes.includes(item[1]);
                });
            }
            else if(matchType === 1) {
                allIndexesOfCorrelatedRows = prevIndexesOfCorrelatedRows.filter((item) => {
                    return !correlatedRelationSheetIndexes.includes(item[1]);
                }).concat(newIndexesOfCorrelatedRows);

                excludedIndexesOfCorrelatedRows = prevIndexesOfCorrelatedRows.filter((item) => {
                    return correlatedRelationSheetIndexes.includes(item[1]);
                });
            }
            else if(matchType === 2) {
                allIndexesOfCorrelatedRows = prevIndexesOfCorrelatedRows.filter((item) => {
                    return !correlatedDataSheetIndexes.includes(item[0]);
                }).concat(newIndexesOfCorrelatedRows);

                excludedIndexesOfCorrelatedRows = prevIndexesOfCorrelatedRows.filter((item) => {
                    return correlatedDataSheetIndexes.includes(item[0]);
                });
            }
            else {
                allIndexesOfCorrelatedRows = prevIndexesOfCorrelatedRows.concat(newIndexesOfCorrelatedRows);
            }

            if(!avoidOverrideForManuallyCorrelatedRows) {
                // nadpisz wszystkie rekordy
                manuallyCorrelatedRows = this.removeAutoMatchRowsFromManuallyCorrelatedRows(correlationId,
                    excludedIndexesOfCorrelatedRows,
                    manuallyCorrelatedRows);
            }

            newIndexesOfCorrelatedRows = allIndexesOfCorrelatedRows;
        }

        return {
            correlationMatrix: correlationMatrixToReturn,
            indexesOfCorrelatedRows: newIndexesOfCorrelatedRows,
            manuallyCorrelatedRows
        }
    }

    removeAutoMatchRowsFromManuallyCorrelatedRows(id, excludedRows, manuallyCorrelatedRows) {
        const rowsToCheck = excludedRows.map((item) => (item.toString()));

        return manuallyCorrelatedRows.filter((item) => {
            return !rowsToCheck.includes(item.toString());
        });
    }

    async addNewCorrelationJob(jobId, userId, relationSheetLength) {
        return this.correlationJobs.save({
            id: jobId,
            user_id: userId,
            creation_datetime: new Date(),
            totalRows: relationSheetLength,
            rowCount: 0,
            status: 'running'
        });
    }

    async finishCorrelationJob(jobId, relationSheetLength) {
        await this.correlationJobs
            .createQueryBuilder()
            .update({
                rowCount: relationSheetLength,
                status: 'finished'
            })
            .where({
                id: jobId
            })
            .execute();
    }
}
