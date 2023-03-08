import {HttpException, Injectable} from '@nestjs/common';
import { stringSimilarity } from "string-similarity-js";
import * as csv from "csvtojson";
import * as fs from "fs";
import * as papa from 'papaparse';

@Injectable()
export class AppService {
    async convertToArray(file, delimiter) {
        const fileContent = fs.readFileSync(file.path, 'utf-8');

        return papa.parse(fileContent, { header: true }).data;
    }

  async getSelectList(priorities, dataFile, relationFile, dataFileDelimiter, relationFileDelimiter,
                      isCorrelationMatrixEmpty, showInSelectMenuColumns) {
      // Convert files to array of objects
      const dataFileContent = fs.readFileSync(dataFile.path, 'utf-8');
      const relationFileContent = fs.readFileSync(relationFile.path, 'utf-8');

      const dataSheet = papa.parse(dataFileContent, { header: true }).data;
      const relationSheet = papa.parse(relationFileContent, { header: true }).data;

      showInSelectMenuColumns = JSON.parse(showInSelectMenuColumns);

      if(isCorrelationMatrixEmpty === 'true') {
          console.log('initial');
          try {
              return relationSheet.map((relationRowItem, relationRowIndex) => {
                  return dataSheet.map((dataRowItem, dataRowIndex) => {
                      return {
                          dataRowIndex,
                          relationRowIndex,
                          similarity: -1
                      }
                  });
              });
          }
          catch(e) {
              console.log(e);
              throw new HttpException(e, 500, {cause: new Error('error')});
          }
      }
      else {
          const correlationMatrix = this.getCorrelationMatrix(JSON.parse(priorities), null,
              dataSheet, relationSheet,
              [], true);

          try {
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

    getSimilarityScores(conditions, logicalOperators, correlationMatrix, dataSheet,
                        relationSheet, indexesOfCorrelatedRows, overrideAllRows) {
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

                        if(typeof dataSheetPart === 'string' && typeof relationSheetPart === 'string') {
                            const pairSimilarity = stringSimilarity(dataSheetPart, relationSheetPart);
                            similarities.push(pairSimilarity);
                        }
                    }

                    // Calculate final similarity based on conditions - default first similarity
                    // (if no conditions, loop will be omitted)
                    let finalSimilarity = similarities[0];

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

                    relationRowSimilarities.push(Math.max(finalSimilarity * 100, 0));
                }
            }

            allSimilarities.push(relationRowSimilarities);
            i++;
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

    getCorrelationMatrix(priorities, correlationMatrix, dataSheet, relationSheet, indexesOfCorrelatedRows, overrideAllRows) {
        let correlationMatrixTmp = [];
        let priorityIndex = 0;

        for(const priority of priorities) {
            // Get similarities for all rows for current priority
            // [[relation row 1 similarities], [relation row 2 similarities] ...]

            const logicalOperators = priority.logicalOperators.map((item) => (parseInt(item)));
            const similarityScores = this.getSimilarityScores(priority.conditions, logicalOperators, correlationMatrix, dataSheet, relationSheet,
                indexesOfCorrelatedRows, overrideAllRows);

            let relationRowIndex = 0;
            for(const relationRowSimilarities of similarityScores) {
                correlationMatrixTmp.push(relationRowSimilarities);

                // if(correlationMatrix[relationRowIndex]) {
                //     correlationMatrixTmp.push(correlationMatrix[relationRowIndex][0] < relationRowSimilarities[0]
                //         ? relationRowSimilarities : correlationMatrix[relationRowIndex]);
                // }
                // else {
                //     correlationMatrixTmp.push(relationRowSimilarities);
                // }
                relationRowIndex++;
            }

            priorityIndex++;
        }

        return correlationMatrixTmp;
    }

  async correlate(dataFile, relationFile, dataFileDelimiter, relationFileDelimiter, priorities, correlationMatrix, indexesOfCorrelatedRows, overrideAllRows,
            avoidOverrideForManuallyCorrelatedRows, manuallyCorrelatedRows, matchThreshold) {
      // Convert files to array of objects
      const dataFileContent = fs.readFileSync(dataFile.path, 'utf-8');
      const relationFileContent = fs.readFileSync(relationFile.path, 'utf-8');

      const dataSheet = papa.parse(dataFileContent, { header: true }).data;
      const relationSheet = papa.parse(relationFileContent, { header: true }).data;

      let correlationMatrixTmp = this.getCorrelationMatrix(JSON.parse(priorities), correlationMatrix,
          dataSheet, relationSheet,
          indexesOfCorrelatedRows, overrideAllRows)
      let i = 0;
      let indexesOfCorrelatedRowsTmp = JSON.parse(indexesOfCorrelatedRows).map((item) => (item));

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

          // if(indexesOfCorrelatedRowsTmp[i] === -1 || overrideAllRows) {
          //     if(overrideAllRows && (newMatch !== -2 && el[newMatch] >= matchThreshold)) {
          //         if(!(avoidOverrideForManuallyCorrelatedRows && manuallyCorrelatedRows.includes(i))) {
          //             indexesOfCorrelatedRowsTmp[i] = newMatch;
          //         }
          //     }
          //     else if(!overrideAllRows) {
          //
          //     }
          // }

          indexesOfCorrelatedRowsTmp[i] = (newMatch === -2 || el[newMatch] < matchThreshold) ? -1 : newMatch;

          i++;
      }

      return {
          indexesOfCorrelatedRowsTmp,
          correlationMatrixTmp
      }
  }
}
