import React, {useContext, useEffect, useState} from 'react';
import DataSheetView from "./DataSheetView";
import RelationSheetView from "./RelationSheetView";
import OutputSheetView from "./OutputSheetView";
import {AppContext} from "../pages/CorrelationPage";
import {correlateUsingSchema, getProgressByJobId, getSelectList, matching} from "../api/matching";
import {createRowShortcut, makeId} from "../helpers/others";
import ChooseAndSaveSchema from "./ChooseAndSaveSchema";
import {getSchemaById} from "../api/schemas";
import ButtonCorrelationViewPicker from "./ButtonCorrelationViewPicker";
import QuickBottomInfo from "./QuickBottomInfo";

const ViewContext = React.createContext(null);

const CorrelationView = ({user}) => {
    const { dataSheet, relationSheet, dataFile, relationFile, currentSchemaId,
        dataSheetId, relationSheetId, dataSheetName, relationSheetName,
        dataDelimiter, relationDelimiter } = useContext(AppContext);

    // 0 - data, 1 - relation, 2 - output
    const [currentSheet, setCurrentSheet] = useState(0);

    const [sheetComponent, setSheetComponent] = useState(<DataSheetView />);
    const [showInSelectMenuColumnsDataSheet, setShowInSelectMenuColumnsDataSheet] = useState([]);
    const [showInSelectMenuColumnsRelationSheet, setShowInSelectMenuColumnsRelationSheet] = useState([]);
    const [outputSheet, setOutputSheet] = useState([]);
    const [outputSheetExportColumns, setOutputSheetExportColumns] = useState([]);
    const [correlationMatrix, setCorrelationMatrix] = useState([[]]);

    // 0 - not correlating, 1 - in progress, 2 - finished
    const [correlationStatus, setCorrelationStatus] = useState(0);

    const [matchType, setMatchType] = useState(0);
    const [matchFunction, setMatchFunction] = useState(0);
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
    const [dataSheetColumnsVisibility, setDataSheetColumnsVisibility] = useState([]);
    const [relationSheetColumnsVisibility, setRelationSheetColumnsVisibility] = useState([]);
    const [outputSheetColumnsVisibility, setOutputSheetColumnsVisibility] = useState([]);
    const [numberOfMatches, setNumberOfMatches] = useState(-1);
    const [afterMatchClean, setAfterMatchClean] = useState(false);

    useEffect(() => {
        if(numberOfMatches !== -1) {
            setTimeout(() => {
                setNumberOfMatches(-1);
            }, 5500);
        }
    }, [numberOfMatches]);

    useEffect(() => {
        switch(currentSheet) {
            case 0:
                setSheetComponent(<DataSheetView />);
                break;
            case 1:
                setSheetComponent(<RelationSheetView index={1}
                                                     currentSheet={relationSheet}
                                                     secondSheet={dataSheet}
                                                     showInSelectMenuColumnsSecondSheet={showInSelectMenuColumnsDataSheet}
                                                     currentSheetColumnsVisibility={relationSheetColumnsVisibility}
                                                     setCurrentSheetColumnsVisibility={setRelationSheetColumnsVisibility}
                                                     showInSelectMenuColumnsCurrentSheet={showInSelectMenuColumnsRelationSheet}
                                                     setShowInSelectMenuColumnsCurrentSheet={setShowInSelectMenuColumnsRelationSheet} />);
                break;
            default:
                setSheetComponent(<OutputSheetView />);
                break;
        }
    }, [currentSheet, dataSheetColumnsVisibility, relationSheetColumnsVisibility]);

    useEffect(() => {
        // Change matching and columns settings every time currentSchemaId change
        if(dataSheetId > 0 && relationSheetId > 0 && currentSchemaId > 0) {
            getSchemaById(currentSchemaId)
                .then((res) => {
                    if(res?.data) {
                        setMatchType(res.data.match_type);
                        setMatchFunction(res.data.match_function);
                        setPriorities(JSON.parse(res.data.automatic_matcher_settings_object));
                    }
                });

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

    const selectColumnWithMostContentInSheet = (sheet) => {
        const sheetSample = sheet.slice(0, 10);
        const columnsContent = sheetSample.map((item) => {
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

        return { columnsContent, columnWithMostContent }
    }

    useEffect(() => {
        if(dataSheet?.length) {
            if(currentSchemaId > 0) {
                getSchemaById(currentSchemaId)
                    .then((res) => {
                        if(res?.data) {
                            const columnsSettingsObject = JSON.parse(res.data.columns_settings_object);
                            const showInSelectMenuColumnsDataSheetFromDatabase = columnsSettingsObject.showInSelectMenuColumnsDataSheet;

                            if(Object.entries(dataSheet[0]).length === showInSelectMenuColumnsDataSheetFromDatabase.length) {
                                setShowInSelectMenuColumnsDataSheet(showInSelectMenuColumnsDataSheetFromDatabase);
                            }
                            else {
                                setDefaultShowInSelectMenuColumnsDataSheet();
                            }
                        }
                    });
            }
            else {
                setDefaultShowInSelectMenuColumnsDataSheet();
            }
        }
    }, [dataSheet, currentSchemaId]);

    useEffect(() => {
        if(relationSheet?.length) {
            if(currentSchemaId > 0) {
                getSchemaById(currentSchemaId)
                    .then((res) => {
                        if(res?.data) {
                            const columnsSettingsObject = JSON.parse(res.data.columns_settings_object);
                            const showInSelectMenuColumnsRelationSheetFromDatabase = columnsSettingsObject.showInSelectMenuColumnsRelationSheet;

                            if(Object.entries(relationSheet[0]).length === showInSelectMenuColumnsRelationSheetFromDatabase.length) {
                                setShowInSelectMenuColumnsRelationSheet(showInSelectMenuColumnsRelationSheetFromDatabase);
                            }
                            else {
                                setDefaultShowInSelectMenuColumnsRelationSheet();
                            }
                        }
                    });
            }
            else {
                setDefaultShowInSelectMenuColumnsRelationSheet();
            }
        }
    }, [relationSheet, currentSchemaId]);

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

            if(currentSchemaId > 0) {
                getSchemaById(currentSchemaId)
                    .then((res) => {
                        if(res?.data) {
                            const columnsSettingsObject = JSON.parse(res.data.columns_settings_object);
                            const outputSheetExportColumnsFromDatabase = columnsSettingsObject.outputSheetExportColumns;

                            if(Object.entries(dataSheet[0]).length + Object.entries(relationSheet[0]).length
                                === outputSheetExportColumnsFromDatabase.length) {
                                setOutputSheetExportColumns(outputSheetExportColumnsFromDatabase);
                            }
                            else {
                                setDefaultOutputSheetExportColumns();
                            }
                        }
                    })
                    .catch(() => {
                        setDefaultOutputSheetExportColumns();
                    })
            }
            else {
                setDefaultOutputSheetExportColumns();
            }
        }
    }, [dataSheet, relationSheet, currentSchemaId]);

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

    const setDefaultShowInSelectMenuColumnsDataSheet = () => {
        const { columnsContent, columnWithMostContent } = selectColumnWithMostContentInSheet(dataSheet);
        setShowInSelectMenuColumnsDataSheet(columnsContent[0].map((item, index) => (index === columnWithMostContent)));
    }

    const setDefaultShowInSelectMenuColumnsRelationSheet = () => {
        const { columnsContent, columnWithMostContent } = selectColumnWithMostContentInSheet(relationSheet);
        setShowInSelectMenuColumnsRelationSheet(columnsContent[0].map((item, index) => (index === columnWithMostContent)));
    }

    const setDefaultOutputSheetExportColumns = () => {
        setOutputSheetExportColumns(Object.entries(dataSheet[0]).map(() => (1))
            .concat(Object.entries(relationSheet[0]).map(() => (1))));
    }

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
        if(correlationStatus === 2) {
            setCorrelationStatus(0);
            setProgressCount(0);
        }
    }, [correlationStatus]);

    useEffect(() => {
        // After correlation - get select list for each relation sheet row
        if(correlationMatrix[0]?.length) {
            setSelectListLoading(true);

            if(selectList?.length && !afterMatchClean) {
                getSelectList(jobId, priorities, dataFile, relationFile,
                    dataDelimiter, relationDelimiter,
                    false, showInSelectMenuColumnsDataSheet,
                    dataSheet.length, relationSheet.length, matchFunction)
                    .then((res) => {
                        if(res?.data) {
                            if(selectList?.length) {
                                const newSelectList = res.data;

                                const selectListToUpdate = selectList.map((item, index) => {
                                    if(indexesInSelectListToOverride.includes(index) || 1) {
                                        return newSelectList[index];
                                    }
                                    else {
                                        return item;
                                    }
                                });

                                const matches = selectListToUpdate.filter((item) => {
                                    if(item) {
                                        return parseInt(item[0]?.similarity) >= matchThreshold;
                                    }
                                    return false;
                                });
                                setNumberOfMatches(matches?.length);
                                setSelectList(selectListToUpdate);
                            }
                            else {
                                setSelectList(res.data);
                            }

                            setCorrelationStatus(2);
                        }
                    });
            }
            else {
                setAfterMatchClean(false);
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
                if(item === dataRowIndex) {
                    return -1;
                }
                else if(index === relationRowIndex) {
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
            manuallyCorrelatedRows, matchThreshold, user.id, matchFunction)
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
                showInSelectMenuColumnsDataSheet, setShowInSelectMenuColumnsDataSheet,
                showInSelectMenuColumnsRelationSheet, setShowInSelectMenuColumnsRelationSheet,
                outputSheetExportColumns, setOutputSheetExportColumns,
                dataSheetColumnsVisibility, setDataSheetColumnsVisibility,
                relationSheetColumnsVisibility, setRelationSheetColumnsVisibility,
                outputSheetColumnsVisibility, setOutputSheetColumnsVisibility,
                matchType, setMatchType,
                matchFunction, setMatchFunction,
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
                currentSheet, setCurrentSheet,
                correlate, progressCount,
                setIndexesOfCorrelatedRows, setCorrelationMatrix,
                setManuallyCorrelatedRows, setAfterMatchClean
            }}>
        <div className="container container--correlation">
            <div className="homepage homepage--correlation">
                <ChooseAndSaveSchema user={user} />

                <div className="correlation__viewPicker flex">
                    <ButtonCorrelationViewPicker index={0}
                                                 fileName={dataSheetName}>
                        Arkusz 1
                    </ButtonCorrelationViewPicker>
                    <ButtonCorrelationViewPicker index={1}
                                                 fileName={relationSheetName}>
                        Arkusz 2
                    </ButtonCorrelationViewPicker>
                    <ButtonCorrelationViewPicker index={2}>
                        Arkusz wyjściowy
                    </ButtonCorrelationViewPicker>
                </div>

                {sheetComponent}
            </div>

            {numberOfMatches !== -1 ? <QuickBottomInfo time={5000}>
                Wykonane dopasowania: {numberOfMatches}
            </QuickBottomInfo> : ''}
        </div>
    </ViewContext.Provider>
};

export default CorrelationView;
export { ViewContext }
