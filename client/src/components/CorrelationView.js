import React, {useContext, useEffect, useRef, useState} from 'react';
import RelationSheetView from "./RelationSheetView";
import OutputSheetView from "./OutputSheetView";
import {AppContext} from "../pages/CorrelationPage";
import {correlateUsingSchema, getProgressByJobId, getSelectList, matching} from "../api/matching";
import {createRowShortcut, makeId} from "../helpers/others";
import ChooseAndSaveSchema from "./ChooseAndSaveSchema";
import {getSchemaById} from "../api/schemas";
import ButtonCorrelationViewPicker from "./ButtonCorrelationViewPicker";
import QuickBottomInfo from "./QuickBottomInfo";
import getMaximumInArray from "../helpers/getMaximumInArray";
import transposeMatrix from "../helpers/transposeMatrix";

const ViewContext = React.createContext(null);

const CorrelationView = ({user}) => {
    const { dataSheet, relationSheet, dataFile, relationFile, currentSchemaId,
        dataSheetId, relationSheetId, dataSheetName, relationSheetName,
        dataDelimiter, relationDelimiter } = useContext(AppContext);

    let dataSheetWrapper = useRef(null);
    let relationSheetWrapper = useRef(null);
    let outputSheetWrapper = useRef(null);

    // 0 - data, 1 - relation, 2 - output
    const [currentSheet, setCurrentSheet] = useState(0);

    const [showInSelectMenuColumnsDataSheet, setShowInSelectMenuColumnsDataSheet] = useState([]);
    const [showInSelectMenuColumnsRelationSheet, setShowInSelectMenuColumnsRelationSheet] = useState([]);
    const [outputSheet, setOutputSheet] = useState([]);
    const [outputSheetExportColumns, setOutputSheetExportColumns] = useState([]);
    const [correlationMatrix, setCorrelationMatrix] = useState([[]]);

    // 0 - not correlating, 1 - in progress, 2 - finished
    const [correlationStatus, setCorrelationStatus] = useState(0);

    const [matchType, setMatchType] = useState(0);
    const [priorities, setPriorities] = useState([]);
    const [matchSchemaArray, setMatchSchemaArray] = useState([]);

    // Array of two elements arrays [dataRowIndex, relationRowIndex]
    const [indexesOfCorrelatedRows, setIndexesOfCorrelatedRows] = useState([]);

    const [manuallyCorrelatedRows, setManuallyCorrelatedRows] = useState([]);
    const [schemaCorrelatedRows, setSchemaCorrelatedRows] = useState([]);
    const [overrideAllRows, setOverrideAllRows] = useState(false);
    const [avoidOverrideForManuallyCorrelatedRows, setAvoidOverrideForManuallyCorrelatedRows] = useState(false);
    const [matchThreshold, setMatchThreshold] = useState(90);
    const [relationSheetSelectList, setRelationSheetSelectList] = useState([]);
    const [dataSheetSelectList, setDataSheetSelectList] = useState([]);
    const [indexesInRelationSheetSelectListToOverride, setIndexesInRelationSheetSelectListToOverride] = useState([]);
    const [indexesInDataSheetSelectListToOverride, setIndexesInDataSheetSelectListToOverride] = useState([]);
    const [relationSheetSelectListLoading, setRelationSheetSelectListLoading] = useState(false);
    const [dataSheetSelectListLoading, setDataSheetSelectListLoading] = useState(false);
    const [jobId, setJobId] = useState(null);
    const [progressCount, setProgressCount] = useState(0);
    const [dataSheetColumnsVisibility, setDataSheetColumnsVisibility] = useState([]);
    const [relationSheetColumnsVisibility, setRelationSheetColumnsVisibility] = useState([]);
    const [outputSheetColumnsVisibility, setOutputSheetColumnsVisibility] = useState([]);
    const [numberOfMatches, setNumberOfMatches] = useState(-1);
    const [afterMatchClean, setAfterMatchClean] = useState(false);
    const [selectListIndicators, setSelectListIndicators] = useState([]);

    // Export settings
    const [exportFormat, setExportFormat] = useState(0);
    const [duplicatedRecordsFormat, setDuplicatedRecordsFormat] = useState(0);
    const [columnsToSum, setColumnsToSum] = useState([]);
    const [exportBuildSystem, setExportBuildSystem] = useState(0);
    const [includeColumnWithMatchCounter, setIncludeColumnWithMatchCounter] = useState(false);

    useEffect(() => {
        if(numberOfMatches !== -1) {
            setTimeout(() => {
                setNumberOfMatches(-1);
            }, 5500);
        }
    }, [numberOfMatches]);

    useEffect(() => {
        if(indexesOfCorrelatedRows) {
            setNumberOfMatches(indexesOfCorrelatedRows?.length);
        }
    }, [indexesOfCorrelatedRows]);

    useEffect(() => {
        // Change matching and columns settings every time currentSchemaId change
        if(dataSheetId > 0 && relationSheetId > 0 && currentSchemaId > 0) {
            getSchemaById(currentSchemaId)
                .then((res) => {
                    if(res?.data) {
                        setMatchType(res.data.match_type);
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

    const joinTwoSheets = () => {
        const result = [];

        if(exportBuildSystem === 0) {
            for(const pair of indexesOfCorrelatedRows) {
                const dataRowIndex = pair[0];
                const relationRowIndex = pair[1];
                let combined = {...dataSheet[dataRowIndex], ...relationSheet[relationRowIndex]};

                result.push(combined);
            }
        }
        else if(exportBuildSystem === 1) {
            dataSheet.forEach((item, index) => {
               let combined = {...item};
               const dataRowIndex = index;
               const relationRowIndexes = indexesOfCorrelatedRows.filter((item) => (item[0] === dataRowIndex));

               if(relationRowIndexes?.length) {
                   if(duplicatedRecordsFormat === 0) {
                       // Export duplicates
                       for(const relationRowIndex of relationRowIndexes) {
                           combined = {...combined, ...relationSheet[relationRowIndex]};
                           result.push(combined);
                       }
                   }
                   else if(duplicatedRecordsFormat === 1) {
                       // Separate with comma
                   }
                   else {
                       // Sum number values
                   }
               }
               else {
                   result.push(combined);
               }
            });
        }
        else {
            relationSheet.forEach((item, index) => {
                let combined = {...item};
                const relationRowIndex = index;
                const dataRowIndexes = indexesOfCorrelatedRows.filter((item) => (item[1] === relationRowIndex));

                if(dataRowIndexes?.length) {
                    if(duplicatedRecordsFormat === 0) {
                        // Export duplicates
                        for(const dataRowIndex of dataRowIndexes) {
                            combined = {...combined, ...dataSheet[dataRowIndex]};
                            result.push(combined);
                        }
                    }
                    else if(duplicatedRecordsFormat === 1) {
                        // Separate with comma
                    }
                    else {
                        // Sum number values
                    }
                }
                else {
                    result.push(combined);
                }
            });
        }

        return result;
    }

    useEffect(() => {
        if(indexesOfCorrelatedRows && dataSheet && relationSheet) {
            setOutputSheet(joinTwoSheets());
        }
    }, [indexesOfCorrelatedRows, dataSheet, relationSheet]);

    useEffect(() => {
        if(correlationStatus === 2) {
            setCorrelationStatus(0);
            setProgressCount(0);
        }
    }, [correlationStatus]);

    useEffect(() => {
        // After correlation - get select list for each sheet row
        if(correlationMatrix[0]?.length) {
            setRelationSheetSelectListLoading(true);
            setDataSheetSelectListLoading(true);

            if(relationSheetSelectList?.length && !afterMatchClean) {
                getSelectList(jobId, priorities, dataFile, relationFile,
                    dataDelimiter, relationDelimiter,
                    false, showInSelectMenuColumnsDataSheet,
                    dataSheet.length, relationSheet.length, selectListIndicators)
                    .then((res) => {
                        if(res?.data) {
                            // Select list for relation sheet
                            if(relationSheetSelectList?.length) {
                                const newSelectList = res.data.relationSheetSelectList;

                                const selectListToUpdate = relationSheetSelectList.map((item, index) => {
                                    if(indexesInRelationSheetSelectListToOverride.includes(index) || 1) {
                                        return newSelectList[index];
                                    }
                                    else {
                                        return item;
                                    }
                                });

                                setRelationSheetSelectList(selectListToUpdate);
                            }
                            else {
                                setRelationSheetSelectList(res.data);
                            }

                            // Select list for data sheet
                            if(dataSheetSelectList?.length) {
                                const newSelectList = res.data.dataSheetSelectList;

                                const selectListToUpdate = dataSheetSelectList.map((item, index) => {
                                    if(indexesInDataSheetSelectListToOverride.includes(index) || 1) {
                                        return newSelectList[index];
                                    }
                                    else {
                                        return item;
                                    }
                                });

                                setDataSheetSelectList(selectListToUpdate);
                            }
                            else {
                                setDataSheetSelectList(res.data);
                            }

                            setCorrelationStatus(2);
                        }
                    });
            }
            else {
                setAfterMatchClean(false);
                setRelationSheetSelectList(relationSheet.map((relationRowItem, relationRowIndex) => {
                    return dataSheet.map((dataRowItem, dataRowIndex) => {
                        return {
                            dataRowIndex,
                            relationRowIndex,
                            similarity: -1
                        }
                    });
                }));

                setDataSheetSelectList(dataSheet.map((dataRowItem, dataRowIndex) => {
                    return relationSheet.map((relationRowItem, relationRowIndex) => {
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
        setRelationSheetSelectListLoading(false);
    }, [relationSheetSelectList]);

    useEffect(() => {
        setDataSheetSelectListLoading(false);
    }, [dataSheetSelectList]);

    useEffect(() => {
        if(indexesOfCorrelatedRows) {
            setMatchSchemaArray(indexesOfCorrelatedRows.map((item) => {
                return [
                    createRowShortcut(dataSheet[item[0]]),
                    createRowShortcut(relationSheet[item[1]])
                ]
            }));
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
        if(matchType === 0) {
            setIndexesOfCorrelatedRows(prevState => {
                return [...prevState.filter((item) => {
                    return item[0] !== dataRowIndex && item[1] !== relationRowIndex;
                }), [dataRowIndex, relationRowIndex]];
            });

            setManuallyCorrelatedRows(prevState => ([...prevState.filter((item) => {
                return item[0] !== dataRowIndex && item[1] !== relationRowIndex;
            }), [dataRowIndex, relationRowIndex]]));
        }
        else if(matchType === 1) {
            setIndexesOfCorrelatedRows(prevState => {
                return [...prevState.filter((item) => {
                    return item[1] !== relationRowIndex;
                }), [dataRowIndex, relationRowIndex]];
            });

            setManuallyCorrelatedRows(prevState => {
                return [...prevState.filter((item) => {
                    return item[1] !== relationRowIndex;
                }), [dataRowIndex, relationRowIndex]];
            });
        }
        else if(matchType === 2) {
            setIndexesOfCorrelatedRows(prevState => {
                return [...prevState.filter((item) => {
                    return item[0] !== dataRowIndex;
                }), [dataRowIndex, relationRowIndex]];
            });

            setManuallyCorrelatedRows(prevState => {
                return [...prevState.filter((item) => {
                    return item[0] !== dataRowIndex;
                }), [dataRowIndex, relationRowIndex]];
            });
        }
        else {
            setIndexesOfCorrelatedRows(prevState => {
                return [...prevState, [dataRowIndex, relationRowIndex]];
            });

            setManuallyCorrelatedRows(prevState => {
                return [...prevState, [dataRowIndex, relationRowIndex]];
            });
        }
    }

    const areRowsAvailable = (dataRow, relationRow, indexesOfCorrelatedRows) => {
        const dataRowAvailable = !indexesOfCorrelatedRows.map((item) => (item[0]))
            .includes(dataRow);
        const relationRowAvailable = !indexesOfCorrelatedRows.map((item) => (item[1]))
            .includes(relationRow);

        return dataRowAvailable && relationRowAvailable;
    }

    const correlate = () => {
        setIndexesInRelationSheetSelectListToOverride([]);
        setIndexesInDataSheetSelectListToOverride([]);
        setCorrelationStatus(1);
        setRelationSheetSelectListLoading(true);
        setDataSheetSelectListLoading(true);

        const jobIdTmp = makeId(64);
        setJobId(jobIdTmp);

        matching(jobIdTmp, priorities, correlationMatrix,
            dataFile, relationFile,
            dataDelimiter, relationDelimiter,
            indexesOfCorrelatedRows,
            overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
            manuallyCorrelatedRows, user.id, matchType)
            .then((res) => {
               if(res?.data) {
                   const { newIndexesOfCorrelatedRows, newCorrelationMatrix, newSelectListIndicators }
                    = res.data;

                   const prevIndexesOfCorrelatedRows = [...indexesOfCorrelatedRows];

                   setSelectListIndicators(newSelectListIndicators);

                   if(!overrideAllRows) {
                       // dopasuj tylko te, które jeszcze nie mają dopasowania
                       setCorrelationMatrix(newCorrelationMatrix);

                       const newIndexesOfCorrelatedRowsWithoutAlreadyMatchedRows = newIndexesOfCorrelatedRows.filter((item) => {
                           return areRowsAvailable(item[0], item[1], prevIndexesOfCorrelatedRows);
                       });

                       setIndexesOfCorrelatedRows(newIndexesOfCorrelatedRowsWithoutAlreadyMatchedRows);
                   }
                   else if(overrideAllRows && !avoidOverrideForManuallyCorrelatedRows) {
                       // nadpisz wszystkie rekordy jeśli znajdziesz nowe dopasowanie
                       setCorrelationMatrix(newCorrelationMatrix);
                       setIndexesOfCorrelatedRows(newIndexesOfCorrelatedRows);
                   }
                   else {
                       // nadpisz wszystkie automatycznie dopasowane rekordy jeśli znajdziesz nowe dopasowanie
                       setCorrelationStatus(newCorrelationMatrix);

                       const newIndexesOfCorrelatedRowsWithoutAlreadyMatchedManuallyRows = newIndexesOfCorrelatedRows.filter((item) => {
                           return areRowsAvailable(item[0], item[1], manuallyCorrelatedRows);
                       });

                       setIndexesOfCorrelatedRows(newIndexesOfCorrelatedRowsWithoutAlreadyMatchedManuallyRows);
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
                priorities, setPriorities,
                matchSchemaArray, setMatchSchemaArray,
                outputSheet, setOutputSheet,
                correlationStatus,
                correlationMatrix, setCorrelationMatrix,
                indexesOfCorrelatedRows, setIndexesOfCorrelatedRows,
                addManualCorrelation, manuallyCorrelatedRows,
                schemaCorrelatedRows,
                overrideAllRows, setOverrideAllRows,
                avoidOverrideForManuallyCorrelatedRows, setAvoidOverrideForManuallyCorrelatedRows,
                currentSheet, setCurrentSheet,
                correlate, progressCount,
                setManuallyCorrelatedRows, setAfterMatchClean,
                exportFormat, setExportFormat,
                duplicatedRecordsFormat, setDuplicatedRecordsFormat,
                columnsToSum, setColumnsToSum,
                exportBuildSystem, setExportBuildSystem,
                includeColumnWithMatchCounter, setIncludeColumnWithMatchCounter
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

                {currentSheet === 0 ? <RelationSheetView sheetIndex={0}
                                                         ref={dataSheetWrapper}
                                                         currentSheet={dataSheet}
                                                         secondSheet={relationSheet}
                                                         manuallyCorrelatedRowsIndexes={manuallyCorrelatedRows.map((item) => (item[0]))}
                                                         schemaCorrelatedRowsIndexes={schemaCorrelatedRows.map((item) => (item[0]))}
                                                         indexesOfCorrelatedRowsIndexes={indexesOfCorrelatedRows.map((item) => (item[0]))}
                                                         indexesOfCorrelatedRowsSecondSheetIndexes={indexesOfCorrelatedRows.map((item) => (item[1]))}
                                                         selectList={dataSheetSelectList}
                                                         selectListIndicators={transposeMatrix(selectListIndicators)}
                                                         selectListLoading={dataSheetSelectListLoading}
                                                         showInSelectMenuColumnsCurrentSheet={showInSelectMenuColumnsDataSheet}
                                                         setShowInSelectMenuColumnsCurrentSheet={setShowInSelectMenuColumnsDataSheet}
                                                         showInSelectMenuColumnsSecondSheet={showInSelectMenuColumnsRelationSheet}
                                                         currentSheetColumnsVisibility={dataSheetColumnsVisibility}
                                                         user={user}
                                                         setCurrentSheetColumnsVisibility={setDataSheetColumnsVisibility} /> : ''}

                {currentSheet === 1 ? <RelationSheetView sheetIndex={1}
                                                         ref={relationSheetWrapper}
                                                         currentSheet={relationSheet}
                                                         secondSheet={dataSheet}
                                                         manuallyCorrelatedRowsIndexes={manuallyCorrelatedRows.map((item) => (item[1]))}
                                                         schemaCorrelatedRowsIndexes={schemaCorrelatedRows.map((item) => (item[1]))}
                                                         indexesOfCorrelatedRowsIndexes={indexesOfCorrelatedRows.map((item) => (item[1]))}
                                                         indexesOfCorrelatedRowsSecondSheetIndexes={indexesOfCorrelatedRows.map((item) => (item[0]))}
                                                         selectList={relationSheetSelectList}
                                                         selectListIndicators={selectListIndicators}
                                                         selectListLoading={relationSheetSelectListLoading}
                                                         showInSelectMenuColumnsCurrentSheet={showInSelectMenuColumnsRelationSheet}
                                                         setShowInSelectMenuColumnsCurrentSheet={setShowInSelectMenuColumnsRelationSheet}
                                                         showInSelectMenuColumnsSecondSheet={showInSelectMenuColumnsDataSheet}
                                                         currentSheetColumnsVisibility={relationSheetColumnsVisibility}
                                                         user={user}
                                                         setCurrentSheetColumnsVisibility={setRelationSheetColumnsVisibility} /> : ''}

                {currentSheet === 2 ? <OutputSheetView ref={outputSheetWrapper} /> : ''}
            </div>

            {numberOfMatches !== -1 ? <QuickBottomInfo time={5000}>
                Wykonane dopasowania: {numberOfMatches}
            </QuickBottomInfo> : ''}
        </div>
    </ViewContext.Provider>
};

export default CorrelationView;
export { ViewContext }
