import React, {useContext, useEffect, useState} from 'react';
import DataSheetView from "./DataSheetView";
import RelationSheetView from "./RelationSheetView";
import OutputSheetView from "./OutputSheetView";
import {AppContext} from "../pages/CorrelationPage";
import {correlateUsingSchema, getProgressByJobId, getSelectList, matching} from "../api/matching";
import {createRowShortcut, makeId} from "../helpers/others";
import ChooseAndSaveSchema from "./ChooseAndSaveSchema";
import {getSchemaById} from "../api/schemas";

const ViewContext = React.createContext(null);

const CorrelationView = ({user}) => {
    const { dataSheet, relationSheet, dataFile, relationFile, currentSchemaId,
        dataSheetId, relationSheetId,
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
    const [matchSchemaArray, setMatchSchemaArray] = useState([]);

    // Indexes of rows from data sheet correlated to 0, 1 ... n row in relation sheet
    const [indexesOfCorrelatedRows, setIndexesOfCorrelatedRows] = useState([]);

    const [manuallyCorrelatedRows, setManuallyCorrelatedRows] = useState([]);
    const [schemaCorrelatedRows, setSchemaCorrelatedRows] = useState([]);
    const [overrideAllRows, setOverrideAllRows] = useState(false);
    const [avoidOverrideForManuallyCorrelatedRows, setAvoidOverrideForManuallyCorrelatedRows] = useState(false);
    const [matchThreshold, setMatchThreshold] = useState(90);
    const [selectList, setSelectList] = useState([]);
    const [indexesInSelectListToOverride, setIndexesInSelectListToOverride] = useState([]);
    const [selectListLoading, setSelectListLoading] = useState(false);
    const [jobId, setJobId] = useState(null);
    const [progressCount, setProgressCount] = useState(0);

    useEffect(() => {
        // Change matching every time currentSchemaId change
        if(dataSheetId > 0 && relationSheetId > 0 && currentSchemaId > 0) {
            getSchemaById(currentSchemaId)
                .then((res) => {
                    if(res?.data) {
                        setPriorities(JSON.parse(res.data.automatic_matcher_settings_object));
                    }
                })

            correlateUsingSchema(dataSheetId, relationSheetId, currentSchemaId)
                .then((res) => {
                    if(res?.data) {
                        setIndexesOfCorrelatedRows(res.data);
                        setSchemaCorrelatedRows(res.data.map((item, index) => {
                            if(index !== -1) return index;
                            else return null;
                        }).filter((item) => (item !== null)));
                    }
                });
        }
    }, [currentSchemaId, dataSheetId, relationSheetId]);

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

            setOutputSheetExportColumns(Object.entries(dataSheet[0]).map(() => (1))
                .concat(Object.entries(relationSheet[0]).map(() => (1))));
        }
    }, [dataSheet, relationSheet]);

    useEffect(() => {
        let intervalId;
        if(correlationStatus === 1) {
            intervalId = setInterval(() => {
                getProgressByJobId(jobId)
                    .then((res) => {
                       setProgressCount(res.data.rowCount);
                    });
            }, 5000);
        }

        return () => clearInterval(intervalId);
    }, [correlationStatus]);

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
                if(correlationMatrix[dataSheetMapping[i]][i] >= matchThreshold ||
                    schemaCorrelatedRows.includes(dataSheetMapping[i]) ||
                    manuallyCorrelatedRows.includes(dataSheetMapping[i])) {
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
            setProgressCount(0);
        }
    }, [correlationStatus]);

    const isCorrelationMatrixEmpty = () => {
        return correlationMatrix.findIndex((item) => {
            return item ? item.findIndex((item) => {
               return item !== -1;
            }) === -1 : true;
        }) === -1;
    }

    useEffect(() => {
        console.log(correlationMatrix);
    }, [correlationMatrix]);

    useEffect(() => {
        console.log(indexesOfCorrelatedRows);
    }, [indexesOfCorrelatedRows]);

    useEffect(() => {
        console.log(selectList);
    }, [selectList]);

    useEffect(() => {
        // After correlation - get select list for each relation sheet row
        if(correlationMatrix[0]?.length) {
            setSelectListLoading(true);

            if(selectList?.length) {
                getSelectList(jobId, priorities, dataFile, relationFile,
                    dataDelimiter, relationDelimiter,
                    false, showInSelectMenuColumns,
                    dataSheet.length, relationSheet.length)
                    .then((res) => {
                        if(res?.data) {
                            if(selectList?.length) {
                                const newSelectList = res.data;

                                setSelectList(prevState => {
                                    return prevState.map((item, index) => {
                                        if(indexesInSelectListToOverride.includes(index) || 1) {
                                            return newSelectList[index];
                                        }
                                        else {
                                            return item;
                                        }
                                    });
                                });
                            }
                            else {
                                setSelectList(res.data);
                            }

                            setCorrelationStatus(2);
                        }
                    });
            }
            else {
                setSelectList(relationSheet.map((relationRowItem, relationRowIndex) => {
                    return dataSheet.map((dataRowItem, dataRowIndex) => {
                        return {
                            dataRowIndex,
                            relationRowIndex,
                            similarity: -1
                        }
                    });
                }));
                setCorrelationStatus(2);
            }
        }
    }, [correlationMatrix]);

    useEffect(() => {
        setSelectListLoading(false);
    }, [selectList]);

    useEffect(() => {
        if(indexesOfCorrelatedRows) {
            setMatchSchemaArray(indexesOfCorrelatedRows.map((item, index) => {
                if(item !== -1) {
                    return [
                        createRowShortcut(dataSheet[item]),
                        createRowShortcut(relationSheet[index])
                    ]
                }
                else {
                    return null;
                }
            }).filter((item) => (item !== null)));
        }
    }, [indexesOfCorrelatedRows]);

    useEffect(() => {
        if(manuallyCorrelatedRows?.length) {
            setSchemaCorrelatedRows(prevState => (prevState.filter((item) => {
                return !manuallyCorrelatedRows.includes(item);
            })));
        }
    }, [manuallyCorrelatedRows]);

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

        const jobIdTmp = makeId(64);
        setJobId(jobIdTmp);

        matching(jobIdTmp, priorities, correlationMatrix,
            dataFile, relationFile,
            dataDelimiter, relationDelimiter,
            indexesOfCorrelatedRows,
            overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
            manuallyCorrelatedRows, matchThreshold, user.id)
            .then((res) => {
               if(res?.data) {
                   const newIndexesOfCorrelatedRows = res.data.indexesOfCorrelatedRowsTmp;
                   const newCorrelationMatrix = res.data.correlationMatrixTmp;
                   const prevIndexesOfCorrelatedRows = [...indexesOfCorrelatedRows];

                   if(!overrideAllRows) {
                       // dopasuj tylko te, które jeszcze nie mają dopasowania
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
                       // nadpisz wszystkie rekordy jeśli znajdziesz nowe dopasowanie
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
                       // nadpisz wszystkie automatycznie dopasowane rekordy jeśli znajdziesz nowe dopasowanie
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
               }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return <ViewContext.Provider value={{
                showInSelectMenuColumns, setShowInSelectMenuColumns,
                outputSheetExportColumns, setOutputSheetExportColumns,
                matchType, setMatchType,
                priorities, setPriorities,
                matchSchemaArray, setMatchSchemaArray,
                outputSheet, setOutputSheet,
                correlationStatus,
                correlationMatrix,
                indexesOfCorrelatedRows,
                addManualCorrelation, manuallyCorrelatedRows,
                schemaCorrelatedRows,
                overrideAllRows, setOverrideAllRows,
                avoidOverrideForManuallyCorrelatedRows, setAvoidOverrideForManuallyCorrelatedRows,
                matchThreshold, setMatchThreshold,
                selectList, setSelectList,
                selectListLoading,
                correlate, progressCount
            }}>
        <div className="container container--correlation">
            <div className="homepage homepage--correlation">
                <ChooseAndSaveSchema user={user} />

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

                {sheetComponent}
            </div>
        </div>
    </ViewContext.Provider>
};

export default CorrelationView;
export { ViewContext }
