import React, {useContext, useEffect, useState} from 'react';
import DataSheetView from "./DataSheetView";
import RelationSheetView from "./RelationSheetView";
import OutputSheetView from "./OutputSheetView";
import {AppContext} from "../App";
import { stringSimilarity } from 'string-similarity-js';
import { zip } from 'pythonic';

const ViewContext = React.createContext(null);

const CorrelationView = () => {
    const { dataSheet, relationSheet } = useContext(AppContext);

    // 0 - data, 1 - relation, 2 - output
    const [currentSheet, setCurrentSheet] = useState(0);
    const [sheetComponent, setSheetComponent] = useState(<DataSheetView />);
    const [showInSelectMenuColumns, setShowInSelectMenuColumns] = useState([]);
    const [exportColumns, setExportColumns] = useState([]);
    const [relationSheetExportColumns, setRelationSheetExportColumns] = useState([]);
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
        const columns = Object.entries(dataSheet[0]);
        setShowInSelectMenuColumns(columns.map(() => (0)));
        setExportColumns(columns.map(() => (0)));
        setRelationSheetExportColumns(columns.map(() => (0)));
    }, [dataSheet]);

    useEffect(() => {
        if(outputSheet?.length) {
            setOutputSheetExportColumns(Object.entries(outputSheet[0]).map(() => (0)));
        }
    }, [outputSheet]);

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

                // Calculate final similarity based on conditions
                let finalSimilarity = -1;
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

    const getRelationSheetToMerge = () => {
        const dataSheetColumns = Object.entries(dataSheet[0]).map((item) => (item[0]));
        const relationSheetColumns = Object.entries(relationSheet[0]).map((item) => (item[0]));

        let newRelationSheetColumns = [];
        let sameColumnInDataSheet = false;

        for(const relationColumn of relationSheetColumns) {
            sameColumnInDataSheet = false;

            for(const dataColumn of dataSheetColumns) {
                if(dataColumn === relationColumn) {
                    sameColumnInDataSheet = true;
                    break;
                }
            }

            if(!sameColumnInDataSheet) {
                newRelationSheetColumns.push(relationColumn);
            }
            else {
                newRelationSheetColumns.push(`rel_${relationColumn}`);
            }
        }

        return relationSheet.map((item) => {
            return Object.fromEntries(Object.entries(item).map((item, index) => {
                return [newRelationSheetColumns[index], item[1]];
            }));
        });
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
        let outputSheetTmp = [];
        let correlationMatrixTmp = [];

        const relationSheetToMerge = getRelationSheetToMerge();

        for(const priority of priorities) {
            // Get similarities for all rows for current priority
            // [[data row 1 similarities], [data row 2 similarities] ...]
            const logicalOperators = priority.logicalOperators.map((item) => (parseInt(item)));
            const similarityScores = getSimilarityScores(priority.conditions, logicalOperators);

            let relationSheetIndex = 0;

            for(const relationRowSimilarities of similarityScores) {
                const dataSheetIndex = relationRowSimilarities.indexOf(Math.max(...relationRowSimilarities));
                const maxSimilarity = relationRowSimilarities[dataSheetIndex];

                if(maxSimilarity >= 50) {
                    outputSheetTmp.push({
                        ...dataSheet[dataSheetIndex],
                        ...relationSheetToMerge[relationSheetIndex],
                        similarity: maxSimilarity
                    });
                }

                correlationMatrixTmp.push(relationRowSimilarities);

                relationSheetIndex++;
            }

            priorityIndex++;
        }

        setOutputSheet(outputSheetTmp);
        setIndexesOfCorrelatedRows(correlationMatrixTmp.map((item) => (getIndexWithMaxValue(item))));
        setCorrelationMatrix(correlationMatrixTmp);

        setCorrelationStatus(2);
    }

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
            exportColumns, setExportColumns,
            relationSheetExportColumns, setRelationSheetExportColumns,
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
