import React, {useContext, useEffect, useRef, useState} from 'react';
import RelationSheetView from "./RelationSheetView";
import OutputSheetView from "./OutputSheetView";
import {AppContext} from "../pages/CorrelationPage";
import {correlateUsingSchema, getProgressByJobId, matching} from "../api/matching";
import {createRowShortcut, makeId} from "../helpers/others";
import ChooseAndSaveSchema from "./ChooseAndSaveSchema";
import {getSchemaById} from "../api/schemas";
import ButtonCorrelationViewPicker from "./ButtonCorrelationViewPicker";
import QuickBottomInfo from "./QuickBottomInfo";
import {TranslationContext} from "../App";
import {ApiContext} from "./LoggedUserWrapper";
import combineTwoSheets from "../helpers/combineTwoSheets";
import transposeMatrix from "../helpers/transposeMatrix";

const ViewContext = React.createContext(null);

const CorrelationView = ({user}) => {
    const { content } = useContext(TranslationContext);
    const { api, apiUserId } = useContext(ApiContext);
    const { dataSheet, relationSheet, dataFile, relationFile, currentSchemaId,
        dataSheetId, relationSheetId, dataSheetName, relationSheetName,
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
    const [correlationId, setCorrelationId] = useState(makeId(64));
    const [jobId, setJobId] = useState(null);
    const [progressCount, setProgressCount] = useState(0);
    const [dataSheetColumnsVisibility, setDataSheetColumnsVisibility] = useState([]);
    const [relationSheetColumnsVisibility, setRelationSheetColumnsVisibility] = useState([]);
    const [outputSheetColumnsVisibility, setOutputSheetColumnsVisibility] = useState([]);
    const [numberOfMatches, setNumberOfMatches] = useState(-1);
    const [temporaryNumberOfMatches, setTemporaryNumberOfMatches] = useState(-1);
    const [afterMatchClean, setAfterMatchClean] = useState(false);
    const [dataSheetCorrelationMatrix, setDataSheetCorrelationMatrix] = useState([]);
    const [relationSheetCorrelationMatrix, setRelationSheetCorrelationMatrix] = useState([]);

    // Export settings
    const [exportFormat, setExportFormat] = useState(0);
    const [duplicatedRecordsFormat, setDuplicatedRecordsFormat] = useState(0);
    const [columnsToSum, setColumnsToSum] = useState([]);
    const [exportBuildSystem, setExportBuildSystem] = useState(0);
    const [includeColumnWithMatchCounter, setIncludeColumnWithMatchCounter] = useState(false);

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
        return sheetSample.map((item) => {
            return Object.entries(item).map((item) => (item[1]));
        });
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
            if(!correlationMatrix[0]?.length) {
                setDataSheetCorrelationMatrix(dataSheet.map(() => {
                    return relationSheet.map(() => {
                        return -1;
                    });
                }));

                setRelationSheetCorrelationMatrix(relationSheet.map(() => {
                    return dataSheet.map(() => {
                        return -1;
                    });
                }));
            }

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
        const columnsContent = selectColumnWithMostContentInSheet(dataSheet);
        setShowInSelectMenuColumnsDataSheet(columnsContent[0].map(() => false));
    }

    const setDefaultShowInSelectMenuColumnsRelationSheet = () => {
        const columnsContent = selectColumnWithMostContentInSheet(relationSheet);
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
                    return joinTwoSheetsRelationSystemDuplicatesFormatWithoutCounter();
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

    const correlate = () => {
        setCorrelationStatus(1);

        let correlationIdTmp = correlationId;

        if(!correlationIdTmp) {
            correlationIdTmp = makeId(64);
            setCorrelationId(correlationIdTmp);
        }

        const jobIdTmp = makeId(64);
        setJobId(jobIdTmp);

        matching(correlationIdTmp, jobIdTmp,
            priorities,
            dataFile, relationFile,
            overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
            manuallyCorrelatedRows, api ? apiUserId : user.id, indexesOfCorrelatedRows,
            relationSheetCorrelationMatrix, schemaCorrelatedRows, matchType,api ? 'api' : '')
            .then((res) => {
               if(res) {
                   setIndexesOfCorrelatedRows(res?.data?.indexesOfCorrelatedRows);
                   setManuallyCorrelatedRows(res?.data?.manuallyCorrelatedRows);
                   setSchemaCorrelatedRows(res?.data?.schemaCorrelatedRows);

                   const matrix = res?.data?.correlationMatrix;
                   setDataSheetCorrelationMatrix(transposeMatrix(matrix));
                   setRelationSheetCorrelationMatrix(matrix);

                   setCorrelationStatus(2);
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
                includeColumnWithMatchCounter, setIncludeColumnWithMatchCounter,
                correlationId
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
                                                         showInSelectMenuColumnsCurrentSheet={showInSelectMenuColumnsDataSheet}
                                                         setShowInSelectMenuColumnsCurrentSheet={setShowInSelectMenuColumnsDataSheet}
                                                         showInSelectMenuColumnsSecondSheet={showInSelectMenuColumnsRelationSheet}
                                                         currentSheetColumnsVisibility={dataSheetColumnsVisibility}
                                                         setCurrentSheetColumnsVisibility={setDataSheetColumnsVisibility}
                                                         correlationMatrix={dataSheetCorrelationMatrix}
                                                         schemaCorrelatedRows={schemaCorrelatedRows.map((item) => (item[0]))}
                                                         user={user} /> : ''}

                {currentSheet === 1 ? <RelationSheetView sheetIndex={1}
                                                         ref={relationSheetWrapper}
                                                         currentSheet={relationSheet}
                                                         secondSheet={dataSheet}
                                                         manuallyCorrelatedRowsIndexes={manuallyCorrelatedRows.map((item) => (item[1]))}
                                                         showInSelectMenuColumnsCurrentSheet={showInSelectMenuColumnsRelationSheet}
                                                         setShowInSelectMenuColumnsCurrentSheet={setShowInSelectMenuColumnsRelationSheet}
                                                         showInSelectMenuColumnsSecondSheet={showInSelectMenuColumnsDataSheet}
                                                         currentSheetColumnsVisibility={relationSheetColumnsVisibility}
                                                         setCurrentSheetColumnsVisibility={setRelationSheetColumnsVisibility}
                                                         correlationMatrix={relationSheetCorrelationMatrix}
                                                         schemaCorrelatedRows={schemaCorrelatedRows.map((item) => (item[1]))}
                                                         user={user} /> : ''}

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
