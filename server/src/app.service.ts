import {HttpException, Injectable} from '@nestjs/common';
import { stringSimilarity } from "string-similarity-js";
import * as fs from "fs";
import * as papa from 'papaparse';
import {Repository} from "typeorm";
import {CorrelationJobsEntity} from "./entities/correlation_jobs.entity";
import {InjectRepository} from "@nestjs/typeorm";

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

  async getSelectList(jobId, priorities, dataFile, relationFile, dataFileDelimiter, relationFileDelimiter,
                      isCorrelationMatrixEmpty, showInSelectMenuColumns, dataSheetLength, relationSheetLength) {
      if(isCorrelationMatrixEmpty === 'true') {
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
      else {
          // Convert files to array of objects
          const dataFileContent = fs.readFileSync(dataFile.path, 'utf-8');
          const relationFileContent = fs.readFileSync(relationFile.path, 'utf-8');
          const dataSheet = papa.parse(dataFileContent, { header: true }).data;
          const relationSheet = papa.parse(relationFileContent, { header: true }).data;

          // Get correlation matrix ([[relation row 1 similarities], [relation row 2 similarities] ...])
          const correlationMatrix = await this.getCorrelationMatrix(jobId, JSON.parse(priorities), null,
              dataSheet, relationSheet,
              [], true, true);

          // Finish correlation process in database
          await this.correlationJobs
              .createQueryBuilder()
              .update({
                  rowCount: relationSheet.length,
                  status: 'finished'
              })
              .where({
                  id: jobId
              })
              .execute();

          try {
              // Convert correlation matrix
              return correlationMatrix.map((relationRowItem, relationRowIndex) => {
                  return relationRowItem.map((dataRowItem, dataRowIndex) => {
                      const similarity = correlationMatrix[relationRowIndex][dataRowIndex]
                          .toFixed(0);

                      return {
                          dataRowIndex,
                          relationRowIndex,
                          similarity: isNaN(similarity) ? 0 : similarity
                      }
                  }).sort((a, b) => (parseInt(a.similarity) < parseInt(b.similarity)) ? 1 : -1);
              });
          }
          catch(e) {
              throw new HttpException(e, 500);
          }
      }
  }

    async getSimilarityScores(jobId, conditions, logicalOperators, correlationMatrix, dataSheet,
                        relationSheet, indexesOfCorrelatedRows, overrideAllRows, fromSelect) {
        let allSimilarities = [];
        let i = 0;

        // Iterate over rows
        for(const relationRow of relationSheet) {
            let relationRowSimilarities = [];

            if((indexesOfCorrelatedRows[i] !== -1) && (!overrideAllRows) && correlationMatrix) {
                // Already have match - don't override if option 'no override' selected
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
                            const pairSimilarity = stringSimilarity(dataSheetPart.toString(), relationSheetPart.toString());
                            similarities.push(pairSimilarity);
                        }
                        else {
                            similarities.push(0);
                        }
                    }

                    // Calculate final similarity based on conditions - default first similarity
                    // (if no conditions, loop will be omitted)
                    let finalSimilarity = similarities[0];

                    if(similarities.length > 1) {
                        for(let i=0; i<similarities.length-1; i++) {
                            if(logicalOperators[i] === 1) { // or
                                let firstNumber = finalSimilarity === -1 ? similarities[i] : finalSimilarity;
                                let secondNumber = similarities[i+1];

                                finalSimilarity = Math.max(firstNumber, secondNumber);
                            }
                            else { // and
                                let firstNumber = finalSimilarity === -1 ? similarities[i] : finalSimilarity;
                                let secondNumber = similarities[i+1];

                                finalSimilarity = Math.min(firstNumber, secondNumber);
                            }
                        }
                    }

                    relationRowSimilarities.push(Math.max(finalSimilarity * 100, 0));
                }
            }

            allSimilarities.push(relationRowSimilarities);
            i++;

            if(!(i % 20) && jobId) {
                await this.correlationJobs
                    .createQueryBuilder()
                    .update({
                        rowCount: fromSelect ? ((relationSheet.length / 2) + (i / 2)) : (i / 2)
                    })
                    .where({
                        id: jobId
                    })
                    .execute();
            }
        }

        return allSimilarities;
    }

    getIndexWithMaxValue(arr) {
        let maxVal = 0;
        let indexWithMaxValue = 0;
        let arrIndex = 0;

        for(const el of arr) {
            if(el > maxVal) {
                maxVal = el;
                indexWithMaxValue = arrIndex;
            }
            arrIndex++;
        }

        return indexWithMaxValue;
    }

    async getCorrelationMatrix(jobId, priorities, correlationMatrix, dataSheet, relationSheet,
                               indexesOfCorrelatedRows, overrideAllRows, fromSelect = false) {
        let correlationMatrixTmp = [];
        let priorityIndex = 0;

        for(const priority of priorities) {
            // Get similarities for all rows for current priority
            // [[relation row 1 similarities], [relation row 2 similarities] ...]
            const logicalOperators = priority.logicalOperators.map((item) => (parseInt(item)));
            const similarityScores = await this.getSimilarityScores(jobId, priority.conditions, logicalOperators, correlationMatrix, dataSheet, relationSheet,
                indexesOfCorrelatedRows, overrideAllRows, fromSelect);

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
            avoidOverrideForManuallyCorrelatedRows, manuallyCorrelatedRows, matchThreshold) {
      // Convert files to array of objects
      const dataFileContent = fs.readFileSync(dataFile.path, 'utf-8');
      const relationFileContent = fs.readFileSync(relationFile.path, 'utf-8');
      const dataSheet = papa.parse(dataFileContent, { header: true }).data;
      const relationSheet = papa.parse(relationFileContent, { header: true }).data;

      // Insert new job to database (progress tracking)
      await this.correlationJobs.save({
          id: jobId,
          creation_datetime: new Date(),
          totalRows: relationSheet.length,
          rowCount: 0,
          status: 'running'
      });

      // Get correlation matrix ([[relation row 1 similarities], [relation row 2 similarities] ...])
      let correlationMatrixTmp = await this.getCorrelationMatrix(jobId, JSON.parse(priorities), correlationMatrix,
          dataSheet, relationSheet,
          indexesOfCorrelatedRows, overrideAllRows)
      let i = 0;
      let indexesOfCorrelatedRowsTmp = JSON.parse(indexesOfCorrelatedRows).map((item) => (item));

      // Get indexesOfCorrelatedRows based on overriding settings
      if(overrideAllRows && avoidOverrideForManuallyCorrelatedRows) {
          indexesOfCorrelatedRowsTmp = JSON.parse(indexesOfCorrelatedRows).map((item, index) => {
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
              const indexWithMaxValue = this.getIndexWithMaxValue(el);

              if(!indexesOfCorrelatedRowsTmp.includes(indexWithMaxValue)) {
                  newMatch = indexWithMaxValue;
              }
              else {
                  el = el.map((item, index) => {
                      if(index === indexWithMaxValue) {
                          return -1;
                      }
                      else {
                          return item;
                      }
                  });
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
}
