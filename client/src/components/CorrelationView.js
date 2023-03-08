import React, {useContext, useEffect, useState} from 'react';
import DataSheetView from "./DataSheetView";
import RelationSheetView from "./RelationSheetView";
import OutputSheetView from "./OutputSheetView";
import {AppContext} from "../App";
import {getSelectList, matching} from "../helpers/matching";

const ViewContext = React.createContext(null);

const CorrelationView = () => {
    const { dataSheet, relationSheet, dataFile, relationFile,
        dataDelimiter, relationDelimiter } = useContext(AppContext);

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
    const [overrideAllRows, setOverrideAllRows] = useState(false);
    const [avoidOverrideForManuallyCorrelatedRows, setAvoidOverrideForManuallyCorrelatedRows] = useState(false);
    const [matchThreshold, setMatchThreshold] = useState(90);
    const [selectList, setSelectList] = useState([]);
    const [indexesInSelectListToOverride, setIndexesInSelectListToOverride] = useState([]);
    const [selectListLoading, setSelectListLoading] = useState(false);

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

        setShowInSelectMenuColumns(columnsContent[0].map((item, index) => (index === columnWithMostContent)));
    }, [dataSheet]);

    useEffect(() => {
        setIndexesOfCorrelatedRows(relationSheet.map(() => (-1)));
    }, [relationSheet]);

    useEffect(() => {
        const n = Object.entries(dataSheet[0]).length;

        if(outputSheetExportColumns[0] || outputSheetExportColumns[n]) {
            setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                if(index === n || index === 0) {
                    return false;
                }
                else {
                    return item;
                }
            })));
        }
    }, [outputSheetExportColumns]);

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

                if(correlationMatrix[dataSheetMapping[i]][i] >= matchThreshold || manuallyCorrelatedRows.includes(dataSheetMapping[i])) {
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

    useEffect(() => {
        if(correlationMatrix[0]?.length && showInSelectMenuColumns?.length) {

            setSelectListLoading(true);
            console.log('getting new selectList');
            getSelectList(priorities, dataFile, relationFile,
                dataDelimiter, relationDelimiter,
                correlationMatrix[0][0] === -1, showInSelectMenuColumns)
                .then((res) => {
                    console.log('GOT IT');
                    console.log(res);
                    if(res?.data) {
                        if(selectList?.length) {
                            const newSelectList = res.data;

                            setSelectList(prevState => {
                                return prevState.map((item, index) => {
                                   if(indexesInSelectListToOverride.includes(index)) {
                                       return newSelectList[index];
                                   }
                                   else {
                                       return item;
                                   }
                                });
                            })
                        }
                        else {
                            setSelectList(res.data);
                        }
                    }
                });
        }
    }, [showInSelectMenuColumns, correlationMatrix]);

    useEffect(() => {
        setSelectListLoading(false);
    }, [selectList]);

    useEffect(() => {
        console.log(correlationMatrix);
    }, [correlationMatrix]);

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
        setIndexesInSelectListToOverride([]);
        setCorrelationStatus(1);
        setSelectListLoading(true);

        matching(priorities, correlationMatrix,
            dataFile, relationFile,
            dataDelimiter, relationDelimiter,
            indexesOfCorrelatedRows,
            overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
            manuallyCorrelatedRows, matchThreshold)
            .then((res) => {
               if(res?.data) {
                   const newIndexesOfCorrelatedRows = res.data.indexesOfCorrelatedRowsTmp;
                   const newCorrelationMatrix = res.data.correlationMatrixTmp;
                   const prevIndexesOfCorrelatedRows = [...indexesOfCorrelatedRows];

                   if(!overrideAllRows) {
                       // dopasuj tylko te, ktore jeszcze nie maja dopasowania
                       setCorrelationMatrix(prevState => {
                           return prevState.map((item, index) => {
                              if(prevIndexesOfCorrelatedRows[index] === -1) {
                                  return newCorrelationMatrix[index];
                              }
                              else {
                                  return item;
                              }
                           });
                       });

                       setIndexesOfCorrelatedRows(prevState => {
                           return prevState.map((item, index) => {
                               if(item === -1) {
                                   setIndexesInSelectListToOverride(prevState => ([...prevState, index]));
                                   return newIndexesOfCorrelatedRows[index];
                               }
                               else {
                                   return item;
                               }
                           });
                       });
                   }
                   else if(overrideAllRows && !avoidOverrideForManuallyCorrelatedRows) {
                       // nadpisz wszystkie rekordy jesli znajdziesz nowe dopasowanie
                       setCorrelationMatrix(prevState => {
                           return prevState.map((item, index) => {
                               if(newIndexesOfCorrelatedRows[index] !== -1) {
                                   return newCorrelationMatrix[index];
                               }
                               else {
                                   return item;
                               }
                           });
                       });

                       setIndexesOfCorrelatedRows(prevState => {
                           return prevState.map((item, index) => {
                               if(newIndexesOfCorrelatedRows[index] !== -1) {
                                   setIndexesInSelectListToOverride(prevState => ([...prevState, index]));
                                   return newIndexesOfCorrelatedRows[index];
                               }
                               else {
                                   return item;
                               }
                           });
                       });
                   }
                   else {
                       // nadpisz wszystkie automatycznie dopasowane rekordy jesli znajdziesz nowe dopasowanie
                       setCorrelationMatrix(prevState => {
                           return prevState.map((item, index) => {
                               if(newIndexesOfCorrelatedRows[index] !== -1 && !manuallyCorrelatedRows.includes(index)) {
                                   return newCorrelationMatrix[index];
                               }
                               else {
                                   return item;
                               }
                           });
                       });

                       setIndexesOfCorrelatedRows(prevState => {
                           return prevState.map((item, index) => {
                               if(newIndexesOfCorrelatedRows[index] !== -1 && !manuallyCorrelatedRows.includes(index)) {
                                   setIndexesInSelectListToOverride(prevState => ([...prevState, index]));
                                   return newIndexesOfCorrelatedRows[index];
                               }
                               else {
                                   return item;
                               }
                           });
                       });
                   }

                   setCorrelationStatus(2);
               }
            })
            .catch((err) => {
                console.log(err);
            });
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
            overrideAllRows, setOverrideAllRows,
            avoidOverrideForManuallyCorrelatedRows, setAvoidOverrideForManuallyCorrelatedRows,
            matchThreshold, setMatchThreshold,
            selectList, setSelectList,
            selectListLoading,
            correlate
        }}>
            {sheetComponent}
        </ViewContext.Provider>
    </div>
};

export default CorrelationView;
export { ViewContext }
