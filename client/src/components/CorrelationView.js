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
import transposeMatrix from "../helpers/transposeMatrix";
import {TranslationContext} from "../App";
import {ApiContext} from "./LoggedUserWrapper";
import combineTwoSheets from "../helpers/combineTwoSheets";
import cleanCorrelationMatrix from "../helpers/cleanCorrelationMatrix";

const ViewContext = React.createContext(null);

const CorrelationView = ({user}) => {
    const { content } = useContext(TranslationContext);
    const { api, apiUserId } = useContext(ApiContext);
    const { dataSheet, relationSheet, dataFile, relationFile, currentSchemaId,
        dataSheetId, relationSheetId, dataSheetName, relationSheetName,
        dataDelimiter, relationDelimiter,
        setCurrentSchemaChangedAndNotSaved } = useContext(AppContext);

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
    const [temporaryNumberOfMatches, setTemporaryNumberOfMatches] = useState(-1);
    const [afterMatchClean, setAfterMatchClean] = useState(false);
    const [selectListIndicators, setSelectListIndicators] = useState([]);

    // Export settings
    const [exportFormat, setExportFormat] = useState(0);
    const [duplicatedRecordsFormat, setDuplicatedRecordsFormat] = useState(0);
    const [columnsToSum, setColumnsToSum] = useState([]);
    const [exportBuildSystem, setExportBuildSystem] = useState(0);
    const [includeColumnWithMatchCounter, setIncludeColumnWithMatchCounter] = useState(false);

    useEffect(() => {
        console.log(manuallyCorrelatedRows);
    }, [manuallyCorrelatedRows]);

    useEffect(() => {
        console.log(schemaCorrelatedRows);
    }, [schemaCorrelatedRows]);

    useEffect(() => {
        if(temporaryNumberOfMatches !== -1) {
            setTimeout(() => {
                setTemporaryNumberOfMatches(-1);
            }, 5500);
        }
    }, [temporaryNumberOfMatches]);

    useEffect(() => {
        if(currentSchemaId !== -1) {
            setCurrentSchemaChangedAndNotSaved(true);
        }

        if(indexesOfCorrelatedRows) {
            setNumberOfMatches(indexesOfCorrelatedRows.length);
        }
    }, [indexesOfCorrelatedRows]);

    useEffect(() => {
        if(dataSheet && relationSheet) {
            setSelectListIndicators(relationSheet.map(() => {
                return dataSheet.map(() => {
                    return [0, 0];
                });
            }));
        }
    }, [dataSheet, relationSheet]);

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
                        setSchemaCorrelatedRows(res.data);
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
            setCorrelationMatrix(cleanCorrelationMatrix(dataSheet, relationSheet));

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
        // setShowInSelectMenuColumnsDataSheet(columnsContent[0].map((item, index) => (index === columnWithMostContent)));
        setShowInSelectMenuColumnsDataSheet(columnsContent[0].map(() => false));
    }

    const setDefaultShowInSelectMenuColumnsRelationSheet = () => {
        const { columnsContent, columnWithMostContent } = selectColumnWithMostContentInSheet(relationSheet);
        // setShowInSelectMenuColumnsRelationSheet(columnsContent[0].map((item, index) => (index === columnWithMostContent)));
        setShowInSelectMenuColumnsRelationSheet(columnsContent[0].map(() => false));
    }

    const setDefaultOutputSheetExportColumns = () => {
        setOutputSheetExportColumns(Object.entries(dataSheet[0]).map(() => (1))
            .concat(Object.entries(relationSheet[0]).map(() => (1))));
    }

    const joinTwoEmptySheets = () => {
        const dataSheetColumns = Object.keys(dataSheet[0]);
        const relationSheetColumns = Object.keys(relationSheet[0]);

        return [Object.fromEntries([...dataSheetColumns.map((item) => {
            return [item, ''];
        }), ...relationSheetColumns.map((item) => {
            return [item, ''];
        })])];
    }

    const joinTwoSheetsMatchesSystemDuplicatesFormatWithoutCounter = () => {
        let result = [];

        for(const pair of indexesOfCorrelatedRows) {
            const dataRowIndex = pair[0];
            const relationRowIndex = pair[1];

            let combined = combineTwoSheets(dataSheet[dataRowIndex], relationSheet[relationRowIndex]);
            result.push(combined);
        }

        return result;
    }

    const joinTwoSheetsMatchesSystemDuplicatesFormatWithDataSheetCounter = () => {
        let result = [];

        for(const pair of indexesOfCorrelatedRows) {
            const dataRowIndex = pair[0];
            const relationRowIndex = pair[1];
            const numberOfMatches = indexesOfCorrelatedRows.filter((item) => (item[0] === dataRowIndex)).length;
            let combined = {
                ...combineTwoSheets(dataSheet[dataRowIndex], relationSheet[relationRowIndex]),
                [content.matchCounterDataSheetName]: numberOfMatches
            };

            result.push(combined);
        }

        return result;
    }

    const joinTwoSheetsMatchesSystemDuplicatesFormatWithRelationSheetCounter = () => {
        let result = [];

        for(const pair of indexesOfCorrelatedRows) {
            const dataRowIndex = pair[0];
            const relationRowIndex = pair[1];
            const numberOfMatches = indexesOfCorrelatedRows.filter((item) => (item[1] === relationRowIndex)).length;
            let combined = {
                ...combineTwoSheets(dataSheet[dataRowIndex], relationSheet[relationRowIndex]),
                [content.matchCounterRelationSheetName]: numberOfMatches
            };

            result.push(combined);
        }

        return result;
    }

    const joinTwoSheetsMatchesSystemDuplicatesFormatWithBothCounters = () => {
        let result = [];

        for(const pair of indexesOfCorrelatedRows) {
            const dataRowIndex = pair[0];
            const relationRowIndex = pair[1];
            const numberOfMatchesDataSheet = indexesOfCorrelatedRows.filter((item) => (item[0] === dataRowIndex)).length;
            const numberOfMatchesRelationSheet = indexesOfCorrelatedRows.filter((item) => (item[1] === relationRowIndex)).length;
            let combined = {
                ...combineTwoSheets(dataSheet[dataRowIndex], relationSheet[relationRowIndex]),
                [content.matchCounterDataSheetName]: numberOfMatchesDataSheet,
                [content.matchCounterRelationSheetName]: numberOfMatchesRelationSheet
            };

            result.push(combined);
        }

        return result;
    }

    const joinTwoSheetsDataSystemDuplicatesFormatWithoutCounter = () => {
        let result = [];

        dataSheet.forEach((item, index) => {
            let combined = {...item};
            const dataRowIndex = index;
            const relationRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[0] === dataRowIndex))
                .map((item) => (item[1]));

            if(relationRowIndexes?.length) {
                for(const relationRowIndex of relationRowIndexes) {
                    result.push(combineTwoSheets(combined, relationSheet[relationRowIndex]));
                }
            }
            else {
                const relationSheetColumns = Object.keys(relationSheet[0]);
                const relationSheetEmptyObject = Object.fromEntries(relationSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push(combineTwoSheets(combined, relationSheetEmptyObject));
            }
        });

        return result;
    }

    const joinTwoSheetsDataSystemDuplicatesFormatWithDataSheetCounter = () => {
        let result = [];

        dataSheet.forEach((item, index) => {
            let combined = {...item};
            const dataRowIndex = index;
            const relationRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[0] === dataRowIndex))
                .map((item) => (item[1]));

            if(relationRowIndexes?.length) {
                for(const relationRowIndex of relationRowIndexes) {
                    result.push({
                        ...combineTwoSheets(combined, relationSheet[relationRowIndex]),
                        [content.matchCounterDataSheetName]: relationRowIndexes.length
                    });
                }
            }
            else {
                const relationSheetColumns = Object.keys(relationSheet[0]);
                const relationSheetEmptyObject = Object.fromEntries(relationSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push(combineTwoSheets(combined, relationSheetEmptyObject));
            }
        });

        return result;
    }

    const joinTwoSheetsDataSystemDuplicatesFormatWithRelationSheetCounter = () => {
        let result = [];

        dataSheet.forEach((item, index) => {
            let combined = {...item};
            const dataRowIndex = index;
            const relationRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[0] === dataRowIndex))
                .map((item) => (item[1]));

            if(relationRowIndexes?.length) {
                for(const relationRowIndex of relationRowIndexes) {
                    const numberOfMatches = indexesOfCorrelatedRows.filter((item) => (item[1] === relationRowIndex)).length;

                    result.push({
                        ...combineTwoSheets(combined, relationSheet[relationRowIndex]),
                        [content.matchCounterRelationSheetName]: numberOfMatches
                    });
                }
            }
            else {
                const relationSheetColumns = Object.keys(relationSheet[0]);
                const relationSheetEmptyObject = Object.fromEntries(relationSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push(combineTwoSheets(combined, relationSheetEmptyObject));
            }
        });

        return result;
    }

    const joinTwoSheetsDataSystemDuplicatesFormatWithBothCounters = () => {
        let result = [];

        dataSheet.forEach((item, index) => {
            let combined = {...item};
            const dataRowIndex = index;
            const relationRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[0] === dataRowIndex))
                .map((item) => (item[1]));

            if(relationRowIndexes?.length) {
                for(const relationRowIndex of relationRowIndexes) {
                    const numberOfMatches = indexesOfCorrelatedRows.filter((item) => (item[1] === relationRowIndex)).length;

                    result.push({
                        ...combineTwoSheets(combined, relationSheet[relationRowIndex]),
                        [content.matchCounterDataSheetName]: relationRowIndexes.length,
                        [content.matchCounterRelationSheetName]: numberOfMatches
                    });
                }
            }
            else {
                const relationSheetColumns = Object.keys(relationSheet[0]);
                const relationSheetEmptyObject = Object.fromEntries(relationSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push(combineTwoSheets(combined, relationSheetEmptyObject));
            }
        });

        return result;
    }

    ///

    const joinTwoSheetsRelationSystemDuplicatesFormatWithoutCounter = () => {
        let result = [];

        relationSheet.forEach((item, index) => {
            let combined = {...item};
            const relationRowIndex = index;
            const dataRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[1] === relationRowIndex))
                .map((item) => (item[0]));

            if(dataRowIndexes?.length) {
                for(const dataRowIndex of dataRowIndexes) {
                    result.push(combineTwoSheets(dataSheet[dataRowIndex], combined));
                }
            }
            else {
                const dataSheetColumns = Object.keys(dataSheet[0]);
                const dataSheetEmptyObject = Object.fromEntries(dataSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push(combineTwoSheets(dataSheetEmptyObject, combined));
            }
        });

        return result;
    }

    const joinTwoSheetsRelationSystemDuplicatesFormatWithRelationSheetCounter = () => {
        let result = [];

        relationSheet.forEach((item, index) => {
            let combined = {...item};
            const relationRowIndex = index;
            const dataRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[1] === relationRowIndex))
                .map((item) => (item[0]));

            if(dataRowIndexes?.length) {
                for(const dataRowIndex of dataRowIndexes) {
                    result.push({
                        ...combineTwoSheets(dataSheet[dataRowIndex], combined),
                        [content.matchCounterRelationSheetName]: dataRowIndexes.length
                    });
                }
            }
            else {
                const dataSheetColumns = Object.keys(dataSheet[0]);
                const dataSheetEmptyObject = Object.fromEntries(dataSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push(combineTwoSheets(dataSheetEmptyObject, combined));
            }
        });

        return result;
    }

    const joinTwoSheetsRelationSystemDuplicatesFormatWithDataSheetCounter = () => {
        let result = [];

        relationSheet.forEach((item, index) => {
            let combined = {...item};
            const relationRowIndex = index;
            const dataRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[1] === relationRowIndex))
                .map((item) => (item[0]));

            if(dataRowIndexes?.length) {
                for(const dataRowIndex of dataRowIndexes) {
                    const numberOfMatches = indexesOfCorrelatedRows.filter((item) => (item[1] === dataRowIndex)).length;

                    result.push({
                        ...combineTwoSheets(dataSheet[dataRowIndex], combined),
                        [content.matchCounterDataSheetName]: numberOfMatches
                    });
                }
            }
            else {
                const dataSheetColumns = Object.keys(dataSheet[0]);
                const dataSheetEmptyObject = Object.fromEntries(dataSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push(combineTwoSheets(dataSheetEmptyObject, combined));
            }
        });

        return result;
    }

    const joinTwoSheetsRelationSystemDuplicatesFormatWithBothCounters = () => {
        let result = [];

        relationSheet.forEach((item, index) => {
            let combined = {...item};
            const relationRowIndex = index;
            const dataRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[1] === relationRowIndex))
                .map((item) => (item[0]));

            if(dataRowIndexes?.length) {
                for(const dataRowIndex of dataRowIndexes) {
                    const numberOfMatches = indexesOfCorrelatedRows.filter((item) => (item[1] === dataRowIndex)).length;

                    result.push({
                        ...combineTwoSheets(combined, relationSheet[relationRowIndex]),
                        [content.matchCounterRelationSheetName]: dataRowIndexes.length,
                        [content.matchCounterDataSheetName]: numberOfMatches
                    });
                }
            }
            else {
                const dataSheetColumns = Object.keys(dataSheet[0]);
                const dataSheetEmptyObject = Object.fromEntries(dataSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push(combineTwoSheets(combined, dataSheetEmptyObject));
            }
        });

        return result;
    }

    const joinTwoSheetsMatchesSystemCommaOrSumFormatWithoutCounter = (sum = false) => {
        let result = [];

        dataSheet.forEach((item, index) => {
            let combined = {...item};
            const dataRowIndex = index;
            const relationRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[0] === dataRowIndex))
                .map((item) => (item[1]));

            if(relationRowIndexes?.length) {
                let columnIndex = Object.entries(dataSheet[0]).length;

                for(const columnName of Object.keys(relationSheet[0])) {
                    if(sum && columnsToSum[columnIndex]) {
                        let newColumn = 0;

                        for(const relationRowIndex of relationRowIndexes) {
                            newColumn += parseFloat(relationSheet[relationRowIndex][columnName]);
                        }

                        combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    }
                    else {
                        let newColumn = '';

                        for(const relationRowIndex of relationRowIndexes) {
                            newColumn += `${relationSheet[relationRowIndex][columnName]}, `;
                        }

                        newColumn = newColumn.slice(0, -2);
                        combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    }

                    columnIndex++;
                }

                result.push(combined);
            }
            else {
                return null;
            }
        });

        return result.filter((item) => (item));
    }

    const joinTwoSheetsMatchesSystemCommaOrSumFormatWithDataSheetCounter = (sum = false) => {
        let result = [];

        dataSheet.forEach((item, index) => {
            let combined = {...item};
            const dataRowIndex = index;
            const relationRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[0] === dataRowIndex))
                .map((item) => (item[1]));

            if(relationRowIndexes?.length) {
                const numberOfMatches = indexesOfCorrelatedRows.filter((item) => (item[0] === dataRowIndex)).length
                let columnIndex = Object.entries(dataSheet[0]).length;

                for(const columnName of Object.keys(relationSheet[0])) {
                    if(sum && columnsToSum[columnIndex]) {
                        let newColumn = 0;

                        for(const relationRowIndex of relationRowIndexes) {
                            newColumn += parseFloat(relationSheet[relationRowIndex][columnName]);
                        }

                        combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    }
                    else {
                        let newColumn = '';

                        for(const relationRowIndex of relationRowIndexes) {
                            newColumn += `${relationSheet[relationRowIndex][columnName]}, `;
                        }

                        newColumn = newColumn.slice(0, -2);
                        combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    }

                    columnIndex++;
                }

                result.push({
                    ...combined,
                    [content.matchCounterDataSheetName]: numberOfMatches
                });
            }
            else {
                return null;
            }
        });

        return result.filter((item) => (item));
    }

    const joinTwoSheetsMatchesSystemCommaOrSumFormatWithRelationSheetCounter = (sum = false) => {
        let result = [];

        relationSheet.forEach((item, index) => {
            let combined = {...item};
            const relationRowIndex = index;
            const dataRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[1] === relationRowIndex))
                .map((item) => (item[0]));

            if(dataRowIndexes?.length) {
                const numberOfMatches = indexesOfCorrelatedRows.filter((item) => (item[1] === relationRowIndex)).length

                let columnIndex = 0;
                for(const columnName of Object.keys(dataSheet[0])) {
                    if(sum && columnsToSum[columnIndex]) {
                        let newColumn = 0;

                        for(const dataRowIndex of dataRowIndexes) {
                            newColumn += parseFloat(dataSheet[dataRowIndex][columnName]);
                        }

                        combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    }
                    else {
                        let newColumn = '';

                        for(const dataRowIndex of dataRowIndexes) {
                            newColumn += `${dataSheet[dataRowIndex][columnName]}, `;
                        }

                        newColumn = newColumn.slice(0, -2);
                        combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    }

                    columnIndex++;
                }

                result.push({
                    ...combined,
                    [content.matchCounterRelationSheetName]: numberOfMatches
                });
            }
            else {
                return null;
            }
        });

        return result.filter((item) => (item));
    }

    const joinTwoSheetsMatchesSystemCommaOrSumFormatWithBothCounters = (sum = false) => {
        let result = [];

        relationSheet.forEach((item, index) => {
            let combined = {...item};
            const relationRowIndex = index;
            const dataRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[1] === relationRowIndex))
                .map((item) => (item[0]));

            if(dataRowIndexes?.length) {
                const numberOfMatchesRelationSheet = indexesOfCorrelatedRows.filter((item) => (item[1] === relationRowIndex)).length
                let columnIndex = 0;

                for(const columnName of Object.keys(dataSheet[0])) {
                    if(sum && columnsToSum[columnIndex]) {
                        let newColumn = 0;

                        for(const dataRowIndex of dataRowIndexes) {
                            newColumn += parseFloat(dataSheet[dataRowIndex][columnName]);
                        }

                        combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    }
                    else {
                        let newColumn = '';

                        for(const dataRowIndex of dataRowIndexes) {
                            newColumn += `${dataSheet[dataRowIndex][columnName]}, `;
                        }

                        newColumn = newColumn.slice(0, -2);
                        combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    }

                    columnIndex++;
                }

                result.push({
                    ...combined,
                    [content.matchCounterDataSheetName]: numberOfMatchesRelationSheet
                });
            }
            else {
                return null;
            }
        });

        return result.filter((item) => (item));
    }

    const joinTwoSheetsDataSystemCommaOrSumFormatWithoutCounter = (sum = false) => {
        let result = [];

        dataSheet.forEach((item, index) => {
            let combined = {...item};
            const dataRowIndex = index;
            const relationRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[0] === dataRowIndex))
                .map((item) => (item[1]));

            if(relationRowIndexes?.length) {
                let columnIndex = Object.entries(dataSheet[0]).length;

                for(const columnName of Object.keys(relationSheet[0])) {
                    if(sum && columnsToSum[columnIndex]) {
                        let newColumn = 0;

                        for(const relationRowIndex of relationRowIndexes) {
                            newColumn += parseFloat(relationSheet[relationRowIndex][columnName]);
                        }

                        combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    }
                    else {
                        let newColumn = '';

                        for(const relationRowIndex of relationRowIndexes) {
                            newColumn += `${relationSheet[relationRowIndex][columnName]}, `;
                        }

                        newColumn = newColumn.slice(0, -2);
                        combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    }

                    columnIndex++;
                }

                result.push(combined);
            }
            else {
                const relationSheetColumns = Object.keys(relationSheet[0]);
                const relationSheetEmptyObject = Object.fromEntries(relationSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push(combineTwoSheets(combined, relationSheetEmptyObject));
            }
        });

        return result;
    }

    const joinTwoSheetsDataSystemCommaOrSumFormatWithDataSheetCounter = (sum = false) => {
        let result = [];

        dataSheet.forEach((item, index) => {
            let combined = {...item};
            const dataRowIndex = index;
            const relationRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[0] === dataRowIndex))
                .map((item) => (item[1]));

            if(relationRowIndexes?.length) {
                let columnIndex = Object.entries(dataSheet[0]).length;

                for(const columnName of Object.keys(relationSheet[0])) {
                    if(sum && columnsToSum[columnIndex]) {
                        let newColumn = 0;

                        for(const relationRowIndex of relationRowIndexes) {
                            newColumn += parseFloat(relationSheet[relationRowIndex][columnName]);
                        }

                        combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    }
                    else {
                        let newColumn = '';

                        for(const relationRowIndex of relationRowIndexes) {
                            newColumn += `${relationSheet[relationRowIndex][columnName]}, `;
                        }

                        newColumn = newColumn.slice(0, -2);
                        combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    }

                    columnIndex++;
                }

                result.push({
                    ...combined,
                    [content.matchCounterDataSheetName]: relationRowIndexes.length
                });
            }
            else {
                const relationSheetColumns = Object.keys(relationSheet[0]);
                const relationSheetEmptyObject = Object.fromEntries(relationSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push({
                    ...combineTwoSheets(combined, relationSheetEmptyObject),
                    ...{ [content.matchCounterDataSheetName]: relationRowIndexes.length }
                });
            }
        });

        return result;
    }

    const joinTwoSheetsDataSystemCommaOrSumFormatWithRelationSheetCounter = (sum = false) => {
        let result = [];

        dataSheet.forEach((item, index) => {
            let combined = {...item};
            const dataRowIndex = index;
            const relationRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[0] === dataRowIndex))
                .map((item) => (item[1]));

            if(relationRowIndexes?.length) {
                let columnIndex = Object.entries(dataSheet[0]).length;
                let numberOfMatches = [];

                for(const columnName of Object.keys(relationSheet[0])) {
                    let newColumn;

                    if(sum && columnsToSum[columnIndex]) {
                        newColumn = 0;

                        for(const relationRowIndex of relationRowIndexes) {
                            numberOfMatches.push(indexesOfCorrelatedRows.filter((item) => (item[1] === relationRowIndex)).length);
                            newColumn += parseFloat(relationSheet[relationRowIndex][columnName]);
                        }
                    }
                    else {
                        newColumn = '';

                        for(const relationRowIndex of relationRowIndexes) {
                            numberOfMatches.push(indexesOfCorrelatedRows.filter((item) => (item[1] === relationRowIndex)).length);
                            newColumn += `${relationSheet[relationRowIndex][columnName]}, `;
                        }

                        newColumn = newColumn.slice(0, -2);
                    }

                    combined = combineTwoSheets(combined, { [columnName]: newColumn });
                    columnIndex++;
                }

                result.push({
                    ...combined,
                    [content.matchCounterRelationSheetName]: numberOfMatches[0]
                });
            }
            else {
                const relationSheetColumns = Object.keys(relationSheet[0]);
                const relationSheetEmptyObject = Object.fromEntries(relationSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push({
                    ...combineTwoSheets(combined, relationSheetEmptyObject),
                    ...{ [content.matchCounterRelationSheetName]: 0 }
                });
            }
        });

        return result;
    }

    const joinTwoSheetsDataSystemCommaOrSumFormatWithBothCounters = (sum = false) => {
        let result = [];

        dataSheet.forEach((item, index) => {
            let combined = {...item};
            const dataRowIndex = index;
            const relationRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[0] === dataRowIndex))
                .map((item) => (item[1]));

            if(relationRowIndexes?.length) {
                let columnIndex = Object.entries(dataSheet[0]).length;
                let numberOfMatches = [];

                for(const columnName of Object.keys(relationSheet[0])) {
                    let newColumn;

                    if(sum && columnsToSum[columnIndex]) {
                        newColumn = 0;

                        for(const relationRowIndex of relationRowIndexes) {
                            numberOfMatches.push(indexesOfCorrelatedRows.filter((item) => (item[1] === relationRowIndex)).length);
                            newColumn += parseFloat(relationSheet[relationRowIndex][columnName]);
                        }
                    }
                    else {
                        newColumn = '';

                        for(const relationRowIndex of relationRowIndexes) {
                            numberOfMatches.push(indexesOfCorrelatedRows.filter((item) => (item[1] === relationRowIndex)).length);
                            newColumn += `${relationSheet[relationRowIndex][columnName]}, `;
                        }

                        newColumn = newColumn.slice(0, -2);
                    }

                    combined = combineTwoSheets(combined, { [columnName]: newColumn });

                    columnIndex++;
                }

                result.push({
                    ...combined,
                    [content.matchCounterDataSheetName]: relationRowIndexes.length,
                    [content.matchCounterRelationSheetName]: numberOfMatches[0]
                });
            }
            else {
                const relationSheetColumns = Object.keys(relationSheet[0]);
                const relationSheetEmptyObject = Object.fromEntries(relationSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push({
                    ...combineTwoSheets(combined, relationSheetEmptyObject),
                    ...{ [content.matchCounterDataSheetName]: 0 },
                    ...{ [content.matchCounterRelationSheetName]: 0 }
                });
            }
        });

        return result;
    }

    const joinTwoSheetsRelationSystemCommaOrSumFormatWithoutCounter = (sum = false) => {
        let result = [];

        relationSheet.forEach((item, index) => {
            let combined = {...item};
            const relationRowIndex = index;
            const dataRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[1] === relationRowIndex))
                .map((item) => (item[0]));

            if(dataRowIndexes?.length) {
                let columnIndex = 0;

                for(const columnName of Object.keys(dataSheet[0])) {
                    if(sum && columnsToSum[columnIndex]) {
                        let newColumn = 0;

                        for(const dataRowIndex of dataRowIndexes) {
                            newColumn += parseFloat(dataSheet[dataRowIndex][columnName]);
                        }

                        combined = combineTwoSheets({ [columnName]: newColumn }, combined);
                    }
                    else {
                        let newColumn = '';

                        for(const dataRowIndex of dataRowIndexes) {
                            newColumn += `${dataSheet[dataRowIndex][columnName]}, `;
                        }

                        newColumn = newColumn.slice(0, -2);
                        combined = combineTwoSheets({ [columnName]: newColumn }, combined);
                    }

                    columnIndex++;
                }

                result.push(combined);
            }
            else {
                const dataSheetColumns = Object.keys(dataSheet[0]);
                const dataSheetEmptyObject = Object.fromEntries(dataSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push(combineTwoSheets(dataSheetEmptyObject, combined));
            }
        });

        return result;
    }

    const joinTwoSheetsRelationSystemCommaOrSumFormatWithRelationSheetCounter = (sum = false) => {
        let result = [];

        relationSheet.forEach((item, index) => {
            let combined = {...item};
            const relationRowIndex = index;
            const dataRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[1] === relationRowIndex))
                .map((item) => (item[0]));

            if(dataRowIndexes?.length) {
                let columnIndex = 0;

                for(const columnName of Object.keys(dataSheet[0])) {
                    if(sum && columnsToSum[columnIndex]) {
                        let newColumn = 0;

                        for(const dataRowIndex of dataRowIndexes) {
                            newColumn += parseFloat(dataSheet[dataRowIndex][columnName]);
                        }

                        combined = combineTwoSheets({ [columnName]: newColumn }, combined);
                    }
                    else {
                        let newColumn = '';

                        for(const dataRowIndex of dataRowIndexes) {
                            newColumn += `${dataSheet[dataRowIndex][columnName]}, `;
                        }

                        newColumn = newColumn.slice(0, -2);
                        combined = combineTwoSheets({ [columnName]: newColumn }, combined);
                    }

                    columnIndex++;
                }

                result.push({
                    ...combined,
                    [content.matchCounterRelationSheetName]: dataRowIndexes.length
                });
            }
            else {
                const dataSheetColumns = Object.keys(dataSheet[0]);
                const dataSheetEmptyObject = Object.fromEntries(dataSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push({
                    ...combineTwoSheets(dataSheetEmptyObject, combined),
                    ...{ [content.matchCounterRelationSheetName]: dataRowIndexes.length }
                });
            }
        });

        return result;
    }

    const joinTwoSheetsRelationSystemCommaOrSumFormatWithDataSheetCounter = (sum = false) => {
        let result = [];

        relationSheet.forEach((item, index) => {
            let combined = {...item};
            const relationRowIndex = index;
            const dataRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[1] === relationRowIndex))
                .map((item) => (item[0]));

            if(dataRowIndexes?.length) {
                let columnIndex = 0;
                let numberOfMatches = [];

                for(const columnName of Object.keys(dataSheet[0])) {
                    let newColumn;

                    if(sum && columnsToSum[columnIndex]) {
                        newColumn = 0;

                        for(const dataRowIndex of dataRowIndexes) {
                            numberOfMatches.push(indexesOfCorrelatedRows.filter((item) => (item[0] === dataRowIndex)).length);
                            newColumn += parseFloat(dataSheet[dataRowIndex][columnName]);
                        }
                    }
                    else {
                        newColumn = '';

                        for(const dataRowIndex of dataRowIndexes) {
                            numberOfMatches.push(indexesOfCorrelatedRows.filter((item) => (item[0] === dataRowIndex)).length);
                            newColumn += `${dataSheet[dataRowIndex][columnName]}, `;
                        }

                        newColumn = newColumn.slice(0, -2);
                    }

                    combined = combineTwoSheets({ [columnName]: newColumn }, combined);

                    columnIndex++;
                }

                result.push({
                    ...combined,
                    [content.matchCounterDataSheetName]: numberOfMatches[0]
                });
            }
            else {
                const dataSheetColumns = Object.keys(dataSheet[0]);
                const dataSheetEmptyObject = Object.fromEntries(dataSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push({
                    ...combineTwoSheets(dataSheetEmptyObject, combined),
                    ...{ [content.matchCounterDataSheetName]: 0 }
                });
            }
        });

        return result;
    }

    const joinTwoSheetsRelationSystemCommaOrSumFormatWithBothCounters = (sum = false) => {
        let result = [];

        relationSheet.forEach((item, index) => {
            let combined = {...item};
            const relationRowIndex = index;
            const dataRowIndexes = indexesOfCorrelatedRows
                .filter((item) => (item[1] === relationRowIndex))
                .map((item) => (item[0]));

            if(dataRowIndexes?.length) {
                let columnIndex = 0;
                let numberOfMatches = [];

                for(const columnName of Object.keys(dataSheet[0])) {
                    let newColumn;

                    if(sum && columnsToSum[columnIndex]) {
                        newColumn = 0;

                        for(const dataRowIndex of dataRowIndexes) {
                            numberOfMatches.push(indexesOfCorrelatedRows.filter((item) => (item[0] === dataRowIndex)).length);
                            newColumn += parseFloat(dataSheet[dataRowIndex][columnName]);
                        }
                    }
                    else {
                        newColumn = '';

                        for(const dataRowIndex of dataRowIndexes) {
                            numberOfMatches.push(indexesOfCorrelatedRows.filter((item) => (item[0] === dataRowIndex)).length);
                            newColumn += `${dataSheet[dataRowIndex][columnName]}, `;
                        }

                        newColumn = newColumn.slice(0, -2);
                    }

                    combined = combineTwoSheets({ [columnName]: newColumn }, combined);
                    columnIndex++;
                }

                result.push({
                    ...combined,
                    [content.matchCounterRelationSheetName]: dataRowIndexes.length,
                    [content.matchCounterDataSheetName]: numberOfMatches[0]
                });
            }
            else {
                const dataSheetColumns = Object.keys(dataSheet[0]);
                const dataSheetEmptyObject = Object.fromEntries(dataSheetColumns.map((item) => {
                    return [item, ''];
                }));
                result.push({
                    ...combineTwoSheets(dataSheetEmptyObject, combined),
                    ...{ [content.matchCounterDataSheetName]: 0 },
                    ...{ [content.matchCounterRelationSheetName]: 0 }
                });
            }
        });

        return result;
    }

    const joinTwoFullSheets = () => {
        let result = [];

        if(exportBuildSystem === 0) {
            // Export only matches
            if(duplicatedRecordsFormat === 0) {
                // Duplicates
                if(matchType === 0) {
                    return joinTwoSheetsMatchesSystemDuplicatesFormatWithoutCounter();
                }
                else if(matchType === 1) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsMatchesSystemDuplicatesFormatWithDataSheetCounter();
                    }
                    else {
                        return joinTwoSheetsMatchesSystemDuplicatesFormatWithoutCounter();
                    }
                }
                else if(matchType === 2) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsMatchesSystemDuplicatesFormatWithRelationSheetCounter();
                    }
                    else {
                        return joinTwoSheetsMatchesSystemDuplicatesFormatWithoutCounter();
                    }
                }
                else if(matchType === 3) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsMatchesSystemDuplicatesFormatWithBothCounters();
                    }
                    else {
                        return joinTwoSheetsMatchesSystemDuplicatesFormatWithoutCounter();
                    }
                }
            }
            else if(duplicatedRecordsFormat === 1 || duplicatedRecordsFormat === 2) {
                const isSum = duplicatedRecordsFormat === 2;

                if(matchType === 0) {
                    return joinTwoSheetsMatchesSystemDuplicatesFormatWithoutCounter(isSum);
                }
                else if(matchType === 1) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsMatchesSystemCommaOrSumFormatWithDataSheetCounter(isSum);
                    }
                    else {
                        return joinTwoSheetsMatchesSystemCommaOrSumFormatWithoutCounter(isSum);
                    }
                }
                else if(matchType === 2) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsMatchesSystemCommaOrSumFormatWithRelationSheetCounter(isSum);
                    }
                    else {
                        return joinTwoSheetsMatchesSystemCommaOrSumFormatWithoutCounter(isSum);
                    }
                }
                else if(matchType === 3) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsMatchesSystemCommaOrSumFormatWithBothCounters(isSum);
                    }
                    else {
                        return joinTwoSheetsMatchesSystemCommaOrSumFormatWithoutCounter(isSum);
                    }
                }
            }
        }
        else if(exportBuildSystem === 1) {
            // Export all data sheet columns
            if(duplicatedRecordsFormat === 0) {
                // Duplicates
                if(matchType === 0) {
                    return joinTwoSheetsDataSystemDuplicatesFormatWithoutCounter();
                }
                else if(matchType === 1) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsDataSystemDuplicatesFormatWithDataSheetCounter();
                    }
                    else {
                        return joinTwoSheetsDataSystemDuplicatesFormatWithoutCounter();
                    }
                }
                else if(matchType === 2) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsDataSystemDuplicatesFormatWithRelationSheetCounter();
                    }
                    else {
                        return joinTwoSheetsDataSystemDuplicatesFormatWithoutCounter();
                    }
                }
                else if(matchType === 3) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsDataSystemDuplicatesFormatWithBothCounters();
                    }
                    else {
                        return joinTwoSheetsDataSystemDuplicatesFormatWithoutCounter();
                    }
                }
            }
            else if(duplicatedRecordsFormat === 1 || duplicatedRecordsFormat === 2) {
                const isSum = duplicatedRecordsFormat === 2;

                if(matchType === 0) {
                    return joinTwoSheetsDataSystemDuplicatesFormatWithoutCounter();
                }
                else if(matchType === 1) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsDataSystemCommaOrSumFormatWithDataSheetCounter(isSum);
                    }
                    else {
                        return joinTwoSheetsDataSystemCommaOrSumFormatWithoutCounter(isSum);
                    }
                }
                else if(matchType === 2) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsDataSystemCommaOrSumFormatWithRelationSheetCounter(isSum);
                    }
                    else {
                        return joinTwoSheetsDataSystemCommaOrSumFormatWithoutCounter(isSum);
                    }
                }
                else if(matchType === 3) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsDataSystemCommaOrSumFormatWithBothCounters(isSum);
                    }
                    else {
                        return joinTwoSheetsDataSystemCommaOrSumFormatWithoutCounter(isSum);
                    }
                }
            }
        }
        else if(exportBuildSystem === 2) {
            // Export all relation sheet columns
            if(duplicatedRecordsFormat === 0) {
                // Duplicates
                if(matchType === 0) {
                    return joinTwoSheetsDataSystemDuplicatesFormatWithoutCounter();
                }
                else if(matchType === 1) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsRelationSystemDuplicatesFormatWithDataSheetCounter();
                    }
                    else {
                        return joinTwoSheetsRelationSystemDuplicatesFormatWithoutCounter();
                    }
                }
                else if(matchType === 2) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsRelationSystemDuplicatesFormatWithRelationSheetCounter();
                    }
                    else {
                        return joinTwoSheetsRelationSystemDuplicatesFormatWithoutCounter();
                    }
                }
                else if(matchType === 3) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsRelationSystemDuplicatesFormatWithBothCounters();
                    }
                    else {
                        return joinTwoSheetsRelationSystemDuplicatesFormatWithoutCounter();
                    }
                }
            }
            else if(duplicatedRecordsFormat === 1 || duplicatedRecordsFormat === 2) {
                const isSum = duplicatedRecordsFormat === 2;

                if(matchType === 0) {
                    return joinTwoSheetsRelationSystemDuplicatesFormatWithoutCounter();
                }
                else if(matchType === 1) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsRelationSystemCommaOrSumFormatWithDataSheetCounter(isSum);
                    }
                    else {
                        return joinTwoSheetsRelationSystemCommaOrSumFormatWithoutCounter(isSum);
                    }
                }
                else if(matchType === 2) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsRelationSystemCommaOrSumFormatWithRelationSheetCounter(isSum);
                    }
                    else {
                        return joinTwoSheetsRelationSystemCommaOrSumFormatWithoutCounter(isSum);
                    }
                }
                else if(matchType === 3) {
                    if(includeColumnWithMatchCounter) {
                        return joinTwoSheetsRelationSystemCommaOrSumFormatWithBothCounters(isSum);
                    }
                    else {
                        return joinTwoSheetsRelationSystemCommaOrSumFormatWithoutCounter(isSum);
                    }
                }
            }
        }

        return result;
    }

    const joinTwoSheets = () => {
        if(!indexesOfCorrelatedRows?.length) {
            return joinTwoEmptySheets();
        }
        else {
            return joinTwoFullSheets();
        }
    }

    useEffect(() => {
        if(indexesOfCorrelatedRows && dataSheet && relationSheet) {
            setOutputSheet(joinTwoSheets());
        }
    }, [indexesOfCorrelatedRows, dataSheet, relationSheet,
        columnsToSum, exportBuildSystem, duplicatedRecordsFormat, includeColumnWithMatchCounter]);

    useEffect(() => {
        if(correlationStatus === 2) {
            setCorrelationStatus(0);
            setProgressCount(0);
        }
    }, [correlationStatus]);

    const isCorrelationMatrixEmpty = () => {
        return !correlationMatrix.length || correlationMatrix[0][0] === -1;
    }

    useEffect(() => {
        // After correlation - get select list for each sheet row
        if(correlationMatrix[0]?.length) {

            setRelationSheetSelectListLoading(true);
            setDataSheetSelectListLoading(true);

            if(relationSheetSelectList?.length && !afterMatchClean) {
                getSelectList(jobId, priorities, dataFile, relationFile,
                    dataDelimiter, relationDelimiter,
                    isCorrelationMatrixEmpty(), showInSelectMenuColumnsDataSheet,
                    dataSheet.length, relationSheet.length, selectListIndicators, api ? 'api' : '')
                    .then((res) => {
                        setTemporaryNumberOfMatches(indexesOfCorrelatedRows.length);

                        if(res?.data) {
                            // Select list for relation sheet
                            if(res?.data?.relationSheetSelectList?.length) {
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
                            if(res?.data?.dataSheetSelectList?.length) {
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

    const areRowsAvailable = (dataRow, relationRow, indexesTaken) => {
        const dataRowAvailable = !indexesTaken.map((item) => (item[0]))
            .includes(dataRow);
        const relationRowAvailable = !indexesTaken.map((item) => (item[1]))
            .includes(relationRow);

        return dataRowAvailable && relationRowAvailable;
    }

    const removeAutoMatchRowsFromManuallyCorrelatedRows = (excludedRows) => {
        const rowsToCheck = excludedRows.map((item) => (item.toString()));

        setManuallyCorrelatedRows(prevState => {
            return prevState.filter((item) => {
                return !rowsToCheck.includes(item.toString());
            });
        });
    }

    const removeAutoMatchRowsFromSchemaCorrelatedRows = (excludedRows) => {
        const rowsToCheck = excludedRows.map((item) => (item.toString()));

        setSchemaCorrelatedRows(prevState => {
            return prevState.filter((item) => {
                return !rowsToCheck.includes(item.toString());
            });
        });
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
            overrideAllRows ? (avoidOverrideForManuallyCorrelatedRows ? manuallyCorrelatedRows : []) : indexesOfCorrelatedRows,
            overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
            manuallyCorrelatedRows, api ? apiUserId : user.id, matchType, api ? 'api' : '')
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

                       setIndexesOfCorrelatedRows(prevState => {
                           return [
                               ...newIndexesOfCorrelatedRowsWithoutAlreadyMatchedRows,
                               ...prevState
                           ]
                       });
                   }
                   else if(overrideAllRows) {
                       // nadpisz (wszystkie/wszystkie automatyczne) rekordy jeśli znajdziesz nowe dopasowanie
                       setCorrelationMatrix(newCorrelationMatrix);

                       let allIndexesOfCorrelatedRows = [];
                       let excludedIndexesOfCorrelatedRows = [];
                       const correlatedDataSheetIndexes = newIndexesOfCorrelatedRows.map((item) => (item[0]));
                       const correlatedRelationSheetIndexes = newIndexesOfCorrelatedRows.map((item) => (item[1]));

                       if(matchType === 0) {
                           allIndexesOfCorrelatedRows = indexesOfCorrelatedRows.filter((item) => {
                                return !correlatedDataSheetIndexes.includes(item[0]) && !correlatedRelationSheetIndexes.includes(item[1]);
                           }).concat(newIndexesOfCorrelatedRows);

                           excludedIndexesOfCorrelatedRows = indexesOfCorrelatedRows.filter((item) => {
                               return correlatedDataSheetIndexes.includes(item[0]) || correlatedRelationSheetIndexes.includes(item[1]);
                           });
                       }
                       else if(matchType === 1) {
                           allIndexesOfCorrelatedRows = indexesOfCorrelatedRows.filter((item) => {
                               return !correlatedRelationSheetIndexes.includes(item[1]);
                           }).concat(newIndexesOfCorrelatedRows);

                           excludedIndexesOfCorrelatedRows = indexesOfCorrelatedRows.filter((item) => {
                               return correlatedRelationSheetIndexes.includes(item[1]);
                           });
                       }
                       else if(matchType === 2) {
                           allIndexesOfCorrelatedRows = indexesOfCorrelatedRows.filter((item) => {
                               return !correlatedDataSheetIndexes.includes(item[0]);
                           }).concat(newIndexesOfCorrelatedRows);

                           excludedIndexesOfCorrelatedRows = indexesOfCorrelatedRows.filter((item) => {
                               return correlatedDataSheetIndexes.includes(item[0]);
                           });
                       }
                       else {
                           allIndexesOfCorrelatedRows = indexesOfCorrelatedRows.concat(newIndexesOfCorrelatedRows);
                       }

                       if(!avoidOverrideForManuallyCorrelatedRows) {
                           removeAutoMatchRowsFromManuallyCorrelatedRows(excludedIndexesOfCorrelatedRows);
                       }

                       removeAutoMatchRowsFromSchemaCorrelatedRows(excludedIndexesOfCorrelatedRows);
                       setIndexesOfCorrelatedRows(allIndexesOfCorrelatedRows);
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
                    <ButtonCorrelationViewPicker index={2}
                                                 numberOfRecords={numberOfMatches !== -1 ? numberOfMatches.toString() : '0'}>
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

            {temporaryNumberOfMatches > 0 ? <QuickBottomInfo time={5000}>
                {content.matchesDone}: {temporaryNumberOfMatches}
            </QuickBottomInfo> : ''}
        </div>
    </ViewContext.Provider>
};

export default CorrelationView;
export { ViewContext }
