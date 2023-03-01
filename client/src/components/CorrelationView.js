import React, {useContext, useEffect, useState} from 'react';
import DataSheetView from "./DataSheetView";
import RelationSheetView from "./RelationSheetView";
import OutputSheetView from "./OutputSheetView";
import {AppContext} from "../App";
import { stringSimilarity } from 'string-similarity-js';

const ViewContext = React.createContext(null);

const CorrelationView = () => {
    const { dataSheet, relationSheet } = useContext(AppContext);

    // 0 - data, 1 - relation, 2 - output
    const [currentSheet, setCurrentSheet] = useState(0);

    const [sheetComponent, setSheetComponent] = useState(<DataSheetView />);
    const [showInSelectMenuColumns, setShowInSelectMenuColumns] = useState([]);
    const [outputSheet, setOutputSheet] = useState([]);
    const [outputSheetExportColumns, setOutputSheetExportColumns] = useState([]);
    const [correlationMatrix, setCorrelationMatrix] = useState([[]]);

    // 0 - not correlating, 1 - in progress, 2 - finished
    const [correlationStatus, setCorrelationStatus] = useState(0);

    const [matchType, setMatchType] = useState(0);
    const [priorities, setPriorities] = useState([]);

    // Indexes of rows from data sheet correlated to 0, 1 ... n row in relation sheet
    const [indexesOfCorrelatedRows, setIndexesOfCorrelatedRows] = useState([]);

    const [manuallyCorrelatedRows, setManuallyCorrelatedRows] = useState([]);

    useEffect(() => {
        // Select column with most content for showInSelectMenuColumns
        const dataSheetSample = dataSheet.slice(0, 10);
        const columnsContent = dataSheetSample.map((item) => {
            return Object.entries(item).map((item) => (item[1]));
        });

        let columnWithMostContent = 0;
        let maxLength = 0;

        for(let i=0; i<columnsContent[0].length; i++) {
            let currentColumnContentLength = columnsContent.reduce((prev, curr) => {
                return prev + curr[i].length;
            }, 0);

            if(currentColumnContentLength > maxLength) {
                maxLength = currentColumnContentLength;
                columnWithMostContent = i;
            }
        }

        setShowInSelectMenuColumns([0].concat(columnsContent[0].map((item, index) => (index === columnWithMostContent))));
    }, [dataSheet]);

    useEffect(() => {
        setIndexesOfCorrelatedRows(relationSheet.map(() => (-1)));
    }, [relationSheet]);

    useEffect(() => {
        if(dataSheet?.length && relationSheet?.length) {
            setCorrelationMatrix(relationSheet.map(() => {
                return dataSheet.map(() => {
                    return -1;
                });
            }));

            setOutputSheetExportColumns(Object.entries(dataSheet[0]).map(() => (0))
                .concat(Object.entries(relationSheet[0]).map(() => (0))));
        }
    }, [dataSheet, relationSheet]);

    const findMax = (arr) => {
        let maxEl = arr[0];
        for(let i=0; i< arr.length; i++) {
            if(arr[i] > maxEl) {
                maxEl = arr[i];
            }
        }
        return maxEl;
    }

    const getDataSheetCorrelations = (inputArray) => {
        const maxIndex = findMax(inputArray);
        let outputArray = [];

        for(let i=0; i<=maxIndex; i++) {
            const index = inputArray.findIndex((item) => (item === i));
            outputArray.push(index);
        }

        return outputArray;
    }

    const joinTwoSheets = (arrayA, arrayB, mapping) => {
        const result = [];
        const dataSheetMapping = getDataSheetCorrelations(mapping);

        for(let i=0; i<arrayA.length; i++) {
            const a = arrayA[i];
            let b = {};
            let correlationInRelationSheetNotFound = false;

            if(dataSheetMapping[i] >= 0) {
                if(correlationMatrix[dataSheetMapping[i]][i] >= 80 || manuallyCorrelatedRows.includes(dataSheetMapping[i])) {
                    b = arrayB[dataSheetMapping[i]];
                }
                else {
                    b = arrayB[0];
                    correlationInRelationSheetNotFound = true;
                }
            }
            else {
                b = arrayB[0];
                correlationInRelationSheetNotFound = true;
            }

            const combined = { ...a };
            for(const key in b) {
                if(combined.hasOwnProperty(key)) {
                    combined[`rel_${key}`] = correlationInRelationSheetNotFound ? '' : b[key];
                }
                else {
                    combined[key] = correlationInRelationSheetNotFound ? '' : b[key];
                }
            }

            result.push(combined);
        }

        return result;
    }

    useEffect(() => {
        if(indexesOfCorrelatedRows && dataSheet && relationSheet) {
            setOutputSheet(joinTwoSheets(dataSheet, relationSheet, indexesOfCorrelatedRows));
        }
    }, [indexesOfCorrelatedRows, dataSheet, relationSheet]);

    useEffect(() => {
        switch(currentSheet) {
            case 0:
                setSheetComponent(<DataSheetView />);
                break;
            case 1:
                setSheetComponent(<RelationSheetView />);
                break;
            default:
                setSheetComponent(<OutputSheetView />);
                break;
        }
    }, [currentSheet]);

    useEffect(() => {
        if(correlationStatus === 2) {
            setCorrelationStatus(0);
        }
    }, [correlationStatus]);

    const getSimilarityScores = (conditions, logicalOperators) => {
        let allSimilarities = [];

        // Iterate over rows
        for(const relationRow of relationSheet) {
            let relationRowSimilarities = [];
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
            allSimilarities.push(relationRowSimilarities);
        }

        return allSimilarities;
    }

    const addManualCorrelation = (dataRowIndex, relationRowIndex) => {
        setManuallyCorrelatedRows(prevState => ([...prevState, relationRowIndex]));

        setIndexesOfCorrelatedRows(prevState => {
            return prevState.map((item, index) => {
                if(index === relationRowIndex) {
                    return dataRowIndex;
                }
                else {
                    return item;
                }
            });
        });
    }

    const correlate = () => {
        setCorrelationStatus(1);

        let priorityIndex = 0;
        let correlationMatrixTmp = [];

        for(const priority of priorities) {
            // Get similarities for all rows for current priority
            // [[relation row 1 similarities], [relation row 2 similarities] ...]
            const logicalOperators = priority.logicalOperators.map((item) => (parseInt(item)));
            const similarityScores = getSimilarityScores(priority.conditions, logicalOperators);

            for(const relationRowSimilarities of similarityScores) {
                correlationMatrixTmp.push(relationRowSimilarities);
            }

            priorityIndex++;
        }

        setIndexesOfCorrelatedRows(correlationMatrixTmp.map((item) => (getIndexWithMaxValue(item))));
        setCorrelationMatrix(correlationMatrixTmp);

        setCorrelationStatus(2);
    }

    useEffect(() => {
        console.log(correlationMatrix);
    }, [correlationMatrix]);

    const getIndexWithMaxValue = (arr) => {
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

    return <div className="container container--correlation">
        <div className="correlation__viewPicker flex">
            <button className={currentSheet === 0 ? "btn btn--correlationViewPicker btn--correlationViewPicker--current" : "btn btn--correlationViewPicker"}
                    onClick={() => { setCurrentSheet(0); }}>
                Arkusz 1
            </button>
            <button className={currentSheet === 1 ? "btn btn--correlationViewPicker btn--correlationViewPicker--current" : "btn btn--correlationViewPicker"}
                    onClick={() => { setCurrentSheet(1); }}>
                Arkusz 2
            </button>
            <button className={currentSheet === 2 ? "btn btn--correlationViewPicker btn--correlationViewPicker--current" : "btn btn--correlationViewPicker"}
                    onClick={() => { setCurrentSheet(2); }}>
                Arkusz wyjściowy
            </button>
        </div>

        <ViewContext.Provider value={{
            showInSelectMenuColumns, setShowInSelectMenuColumns,
            outputSheetExportColumns, setOutputSheetExportColumns,
            matchType, setMatchType,
            priorities, setPriorities,
            outputSheet, setOutputSheet,
            correlationStatus,
            correlationMatrix,
            indexesOfCorrelatedRows,
            addManualCorrelation, manuallyCorrelatedRows,
            correlate
        }}>
            {sheetComponent}
        </ViewContext.Provider>
    </div>
};

export default CorrelationView;
export { ViewContext }
