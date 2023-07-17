import {HttpException, Injectable} from '@nestjs/common';
import { stringSimilarity } from "string-similarity-js";
import * as fs from "fs";
import * as papa from 'papaparse';
import {Repository} from "typeorm";
import {CorrelationJobsEntity} from "./entities/correlation_jobs.entity";
import {InjectRepository} from "@nestjs/typeorm";
import * as path from 'path';
import getIndexOfMaxValueInArray from "./common/getIndexOfMaxValueInArray";

@Injectable()
export class AppService {
    constructor(
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
                    return {
                        dataRowIndex,
                        relationRowIndex,
                        similarity: -1
                    }
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

  async getSelectList(jobId, priorities, dataFile, relationFile, dataFileDelimiter, relationFileDelimiter,
                      isCorrelationMatrixEmpty, showInSelectMenuColumnsDataSheet, dataSheetLength, relationSheetLength, similarityFunctionType: number) {
      if(isCorrelationMatrixEmpty === 'true') {
          return this.getCorrelationMatrixWithEmptySimilarities(dataSheetLength, relationSheetLength);
      }
      else {
          const dataSheet = await this.convertFileToArrayOfObjects(dataFile);
          const relationSheet = await this.convertFileToArrayOfObjects(relationFile);

          // Get correlation matrix ([[relation row 1 similarities], [relation row 2 similarities] ...])
          const correlationMatrix = await this.getCorrelationMatrix(jobId, JSON.parse(priorities), null,
                                                                    dataSheet, relationSheet,[],
                                                       true, similarityFunctionType);
          const correlationMatrixForDataSheet = this.transposeMatrix(correlationMatrix);

          await this.finishCorrelationJob(jobId, relationSheet.length);

          try {
              // Convert correlation matrix to array of arrays of objects
              const relationSheetSelectList = correlationMatrix.map((relationRowItem, relationRowIndex) => {
                  const relationRowSimilaritiesArray = relationRowItem.map((dataRowItem, dataRowIndex) => {
                      const similarity = correlationMatrix[relationRowIndex][dataRowIndex]
                          .toFixed(0);

                      return {
                          dataRowIndex,
                          relationRowIndex,
                          similarity: isNaN(similarity) ? 0 : similarity
                      }
                  });

                  return this.sortBySimilarity(relationRowSimilaritiesArray);
              });

              const dataSheetSelectList = correlationMatrixForDataSheet.map((dataRowItem, dataRowIndex) => {
                  const relationRowSimilaritiesArray = dataRowItem.map((relationRowItem, relationRowIndex) => {
                      const similarity = correlationMatrixForDataSheet[dataRowIndex][relationRowIndex]
                          .toFixed(0);

                      return {
                          dataRowIndex,
                          relationRowIndex,
                          similarity: isNaN(similarity) ? 0 : similarity
                      }
                  });

                  return this.sortBySimilarity(relationRowSimilaritiesArray);
              });

              return {
                  relationSheetSelectList,
                  dataSheetSelectList
              }
          }
          catch(e) {
              console.log(e);
              throw new HttpException(e, 500);
          }
      }
  }

    async getSimilarityScores(jobId, conditions, logicalOperators, correlationMatrix, dataSheet,
                        relationSheet, indexesOfCorrelatedRows, overrideAllRows, fromSelect, similarityFunctionType: number) {
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
                    for(let i=0; i<conditions.length; i++) {
                        const dataSheetPart = dataRow[conditions[i].dataSheet];
                        const relationSheetPart = relationRow[conditions[i].relationSheet];

                        if(dataSheetPart && relationSheetPart) {
                            const pairSimilarity = this.getSimilarityFunction(similarityFunctionType,
                                                                              dataSheetPart.toString(), relationSheetPart.toString());
                            similarities.push(pairSimilarity);
                        }
                        else {
                            similarities.push(0);
                        }
                    }

                    // Calculate final similarity based on conditions (if no conditions, loop will be omitted)
                    let finalSimilarity = similarities[0];
                    if(similarities.length > 1) {
                        for(let i=0; i<similarities.length-1; i++) {
                            if(logicalOperators[i] === 1) { // or
                                finalSimilarity = this.getMinSimilarityFromConditions(finalSimilarity, similarities, i);
                            }
                            else { // and
                                finalSimilarity = this.getMaxSimilarityFromConditions(finalSimilarity, similarities, i);
                            }
                        }
                    }

                    relationRowSimilarities.push(Math.max(finalSimilarity * 100, 0));
                }
            }

            i++;
            allSimilarities.push(relationRowSimilarities);
            await this.updateJobProgress(i, jobId, relationSheet.length, fromSelect);
        }

        return allSimilarities;
    }

    sortBySimilarity(arr) {
        return arr.sort((a, b) => (parseInt(a.similarity) < parseInt(b.similarity)) ? 1 : -1);
    }

    getMinSimilarityFromConditions(finalSimilarity, similarities, i) {
        let firstNumber = finalSimilarity === -1 ? similarities[i] : finalSimilarity;
        let secondNumber = similarities[i+1];

        return Math.max(firstNumber, secondNumber);
    }

    getMaxSimilarityFromConditions(finalSimilarity, similarities, i) {
        let firstNumber = finalSimilarity === -1 ? similarities[i] : finalSimilarity;
        let secondNumber = similarities[i+1];

        return Math.min(firstNumber, secondNumber);
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
                               indexesOfCorrelatedRows, overrideAllRows, similarityFunctionType: number, fromSelect = false) {
        let correlationMatrixTmp = [];
        let priorityIndex = 0;

        for(const priority of priorities) {
            // Get similarities for all rows for current priority
            // [[relation row 1 similarities], [relation row 2 similarities] ...]
            const logicalOperators = priority.logicalOperators.map((item) => (parseInt(item)));
            const similarityScores = await this.getSimilarityScores(jobId, priority.conditions, logicalOperators,
                                                                    correlationMatrix, dataSheet, relationSheet,
                                                                    indexesOfCorrelatedRows, overrideAllRows, fromSelect,
                                                                    similarityFunctionType);

            let relationRowIndex = 0;
            for(const relationRowSimilarities of similarityScores) {
                correlationMatrixTmp.push(relationRowSimilarities);
                relationRowIndex++;
            }

            priorityIndex++;
        }

        return correlationMatrixTmp;
    }

  async correlate(jobId, dataFile, relationFile, dataFileDelimiter, relationFileDelimiter, priorities, correlationMatrix, indexesOfCorrelatedRows, overrideAllRows,
            avoidOverrideForManuallyCorrelatedRows, manuallyCorrelatedRows, matchThreshold, userId, similarityFunctionType) {
      const dataSheet = await this.convertFileToArrayOfObjects(dataFile);
      const relationSheet = await this.convertFileToArrayOfObjects(relationFile);

      await this.addNewCorrelationJob(jobId, userId, relationSheet.length);

      // Get correlation matrix ([[relation row 1 similarities], [relation row 2 similarities] ...])
      let correlationMatrixTmp = await this.getCorrelationMatrix(jobId, JSON.parse(priorities), correlationMatrix,
          dataSheet, relationSheet,
          indexesOfCorrelatedRows, overrideAllRows, similarityFunctionType);
      let i = 0;
      let indexesOfCorrelatedRowsTmp = JSON.parse(indexesOfCorrelatedRows);

      // Get indexesOfCorrelatedRows based on overriding settings
      if(overrideAllRows && avoidOverrideForManuallyCorrelatedRows) {
          indexesOfCorrelatedRowsTmp = indexesOfCorrelatedRowsTmp.map((item, index) => {
              if(manuallyCorrelatedRows.includes(index)) {
                  return item;
              }
              else {
                  return -1;
              }
          });
      }

      // Update indexesOfCorrelatedRows based on availability
      // (record already matched can't be matched to another record - one-to-one relation)
      for(let el of correlationMatrixTmp) {
          let numberOfTrials = 0;
          let newMatch = -1;

          while(newMatch === -1) {
              const indexWithMaxValue = getIndexOfMaxValueInArray(el);

              if(!indexesOfCorrelatedRowsTmp.includes(indexWithMaxValue)) {
                  newMatch = indexWithMaxValue;
              }
              else {
                  el[indexWithMaxValue] = -1;
              }

              numberOfTrials++;
              if(numberOfTrials === 100) {
                  newMatch = -2;
              }
          }

          indexesOfCorrelatedRowsTmp[i] = (newMatch === -2 || el[newMatch] < matchThreshold) ? -1 : newMatch;
          i++;
      }

      return {
          indexesOfCorrelatedRowsTmp,
          correlationMatrixTmp
      }
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
