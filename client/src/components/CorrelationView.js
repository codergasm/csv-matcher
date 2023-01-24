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

    const [matchType, setMatchType] = useState(0);
    const [priorities, setPriorities] = useState([]);

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

    const getSimilarityScores = (conditions, logicalOperators) => {
        let allSimilarities = [];

        // Iterate over rows
        for(const dataRow of dataSheet) {
            let dataRowSimilarities = [];
            for(const relationRow of relationSheet) {
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

                dataRowSimilarities.push(Math.max(finalSimilarity * 100, 0));
            }
            allSimilarities.push(dataRowSimilarities);
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

    const correlate = () => {
        let priorityIndex = 0;
        let outputSheetTmp = [];

        const relationSheetToMerge = getRelationSheetToMerge();

        for(const priority of priorities) {
            // Get similarities for all rows for current priority [[data row 1 similarities], [data row 2 similarities] ...]
            const logicalOperators = priority.logicalOperators.map((item) => (parseInt(item)));
            const similarityScores = getSimilarityScores(priority.conditions, logicalOperators);

            let dataSheetIndex = 0;
            for(const dataRowSimilarities of similarityScores) {
                const relationSheetIndex = dataRowSimilarities.indexOf(Math.max(...dataRowSimilarities));
                const maxSimilarity = dataRowSimilarities[relationSheetIndex];

                if(maxSimilarity >= 50) {
                    outputSheetTmp.push({
                        ...dataSheet[dataSheetIndex],
                        ...relationSheetToMerge[relationSheetIndex],
                        similarity: maxSimilarity
                    });
                }

                dataSheetIndex++;
            }
        }

        console.log(outputSheetTmp);
        setOutputSheet(outputSheetTmp);
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
            correlate
        }}>
            {sheetComponent}
        </ViewContext.Provider>
    </div>
};

export default CorrelationView;
export { ViewContext }
