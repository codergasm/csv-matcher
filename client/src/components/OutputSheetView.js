import React, {useContext, useEffect, useState, forwardRef} from 'react';
import {ViewContext} from "./CorrelationView";
import Papa from "papaparse";
import getScrollParams from "../helpers/getScrollParams";
import CellsFormatModal from "./CellsFormatModal";
import ColumnsSettingsModal from "./ColumnsSettingsModal";
import {AppContext} from "../pages/CorrelationPage";
import {getSchemaById} from "../api/schemas";
import ExportSettingsModal from "./ExportSettingsModal";
import settingsIcon from '../static/img/settings.svg';
import getRelationNameById from "../helpers/getRelationNameById";
import { ROWS_PER_PAGE } from "../static/constans";
import {TranslationContext} from "../App";
import {ApiContext} from "./LoggedUserWrapper";
import SchemaNotCreatedModal from "./SchemaNotCreatedModal";
import SchemaChangedAndNotSavedModal from "./SchemaChangedAndNotSavedModal";
import {sendRequestToExternalApp} from "../api/api";
import IconButtonWithTooltip from "./IconButtonWithTooltip";
import configureInWindowIcon from "../static/img/configure-in-window.svg";
import formatCellsIcon from "../static/img/format-cells.svg";
import areArraysEqual from "../helpers/areArraysEqual";
import checkIcon from "../static/img/check.svg";
import checkAllIcon from "../static/img/select-all.svg";
import uncheckAllIcon from "../static/img/unselect-all.svg";

const OutputSheetView = forwardRef((props, ref) => {
    const { content } = useContext(TranslationContext);
    const { api, apiRequestId, apiUserId, apiUserRedirectionWebsite,
        apiOutputEndpoint, apiRequestCreateDateTime } = useContext(ApiContext);
    const { outputSheet, outputSheetExportColumns,
        exportFormat, indexesOfCorrelatedRows, matchType,
        outputSheetColumnsVisibility, setOutputSheetColumnsVisibility, setColumnsToSum } = useContext(ViewContext);
    const { currentSchemaId,  dataSheet, relationSheet, dataSheetName,
        relationSheetName, dataFile, relationFile, dataFileSize, relationFileSize,
        dataFileOwnerUserId, relationFileOwnerUserId, currentSchemaChangedAndNotSaved,
        isDataSheetColumnTypeNumber, isRelationSheetColumnTypeNumber,
        dataFileOwnerTeamId, relationFileOwnerTeamId } = useContext(AppContext);

    const [page, setPage] = useState(1);
    const [rowsToRender, setRowsToRender] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);
    const [finalExportColumns, setFinalExportColumns] = useState([]);
    const [minColumnWidth, setMinColumnWidth] = useState(0);
    const [columnsSettingsModalVisible, setColumnsSettingsModalVisible] = useState(0);
    const [cellsFormatModalVisible, setCellsFormatModalVisible] = useState(false);
    const [exportSettingsModalVisible, setExportSettingsModalVisible] = useState(false);
    const [cellsHeight, setCellsHeight] = useState(-1);
    const [isOutputSheetColumnTypeNumber, setIsOutputSheetColumnTypeNumber] = useState([]);
    const [modalsBeforeReturnToExternalAppVisible, setModalsBeforeReturnToExternalAppVisible] = useState(false);
    const [temporaryColumnsVisibility, setTemporaryColumnsVisibility] = useState([]);

    // 1 - normal export, 2 - api, export to external app
    const [typeOfExport, setTypeOfExport] = useState(1);

    useEffect(() => {
        setTemporaryColumnsVisibility(outputSheetColumnsVisibility);
    }, [outputSheetColumnsVisibility]);

    useEffect(() => {
        if(hasDataSheetCounter() && hasRelationSheetCounter()) {
            setFinalExportColumns([...outputSheetExportColumns, false, false]);
        }
        else if(hasDataSheetCounter() || hasRelationSheetCounter()) {
            setFinalExportColumns([...outputSheetExportColumns, false]);
        }
        else {
            setFinalExportColumns(outputSheetExportColumns);
        }

        setColumnsToSum(outputSheetExportColumns.map(() => {
            return 0;
        }));
    }, [outputSheetExportColumns]);

    useEffect(() => {
        if(isDataSheetColumnTypeNumber?.length && isRelationSheetColumnTypeNumber?.length) {
            setIsOutputSheetColumnTypeNumber(isDataSheetColumnTypeNumber.concat(isRelationSheetColumnTypeNumber));
        }
    }, [isDataSheetColumnTypeNumber, isRelationSheetColumnTypeNumber]);

    useEffect(() => {
        setColumnsToSum(isOutputSheetColumnTypeNumber);
    }, [isOutputSheetColumnTypeNumber]);

    useEffect(() => {
        if(columnsNames?.length) {
            if(!outputSheetColumnsVisibility?.length) {
                if(currentSchemaId > 0) {
                    getSchemaById(currentSchemaId)
                        .then((res) => {
                            if(res?.data) {
                                const columnsVisibilityFromDatabase = JSON.parse(res.data.columns_settings_object).outputSheetColumnsVisibility;

                                if(columnsNames.length === columnsVisibilityFromDatabase?.length) {
                                    setOutputSheetColumnsVisibility(columnsVisibilityFromDatabase);
                                }
                                else {
                                    setDefaultOutputSheetColumnsVisibility();
                                }
                            }
                            else {
                                setDefaultOutputSheetColumnsVisibility();
                            }
                        })
                        .catch(() => {
                            setDefaultOutputSheetColumnsVisibility();
                        });
                }
                else {
                    setDefaultOutputSheetColumnsVisibility();
                }
            }
            else {
                setDefaultOutputSheetColumnsVisibility();
            }
        }
    }, [columnsNames, currentSchemaId]);

    useEffect(() => {
        if(outputSheet?.length) {
            setRowsToRender(outputSheet.slice(0, ROWS_PER_PAGE));

            const dataSheetLength = Object.entries(dataSheet[0])?.length || 0;
            setColumnsNames(Object.keys(outputSheet[0])
                .map((item, index) => {
                    if(index === 0) {
                        return content.dataSheetIndex;
                    }
                    else if(index === dataSheetLength) {
                        return content.relationSheetIndex;
                    }
                    else {
                        return item;
                    }
                }));
        }
    }, [outputSheet]);

    useEffect(() => {
        setMinColumnWidth(100 / (outputSheetExportColumns.filter((item) => (item)).length));
    }, [outputSheetExportColumns]);

    const setDefaultOutputSheetColumnsVisibility = () => {
        setOutputSheetColumnsVisibility(outputSheetExportColumns);
    }

    const handleOutputSheetExportChange = (i) => {
        if(i === -2) {
            setFinalExportColumns(prevState => (prevState.map(() => (0))));
        }
        else if(i === -1) {
            setFinalExportColumns(prevState => (prevState.map(() => (1))));
        }
        else {
            setFinalExportColumns(prevState => (prevState.map((item, index) => {
                return index === i ? !item : item;
            })));
        }
    }

    const exportOutputSheetValidate = () => {
        if(currentSchemaId === -1 || currentSchemaChangedAndNotSaved) {
            setModalsBeforeReturnToExternalAppVisible(true);
            setTypeOfExport(1);
        }
        else {
            exportOutputSheet();
        }
    }

    const exportOutputSheet = () => {
        setModalsBeforeReturnToExternalAppVisible(false);

        if(exportFormat < 2) {
            // CSV file
            const numberOfDataSheetColumns = Object.entries(dataSheet[0]).length;
            const numberOfDataSheetColumnsInFinalExport = finalExportColumns.filter((item, index) => {
                return item && index < numberOfDataSheetColumns;
            }).length;

            const data = outputSheet.map((item) => {
                return Object.fromEntries(Object.entries(item)
                    .filter((item, index) => (finalExportColumns[index])));
            }).map((item) => {
                return Object.fromEntries(Object.entries(item).map((item, index) => {
                    if(index === 0) {
                        return [content.dataSheetIndex, item[1]];
                    }
                    else if(index === numberOfDataSheetColumnsInFinalExport) {
                        return [content.relationSheetIndex, item[1]];
                    }
                    else {
                        return item;
                    }
                }));
            });

            console.log(data);

            const csvData = Papa.unparse({
                fields: Object.keys(data[0]).map((item, index) => {
                    if(index === 0) {
                        return content.dataSheetIndex;
                    }
                    else if(index === numberOfDataSheetColumnsInFinalExport) {
                        return content.relationSheetIndex;
                    }
                    else {
                       return item;
                    }
                }),
                data: data
            }, {
                delimiter: exportFormat === 0 ? ',' : ';'
            });

            const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
            downloadFile(blob, 'data.csv');
        }
        else {
            // JSON file
            const fileContent = createExportJSON();
            const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8;" });
            downloadFile(blob, 'data.json');
        }
    }

    const getExportJsonOutputMatchedData = () => {
        if(matchType === 2) {
            return relationSheet.map((item, index) => {
                return {
                    sourceFileIndex: 1,
                    rowBeforeMatchingIndex: index,
                    rowValue: item,
                    matchedWithRows: indexesOfCorrelatedRows.filter((item) => {
                        return item[1] === index;
                    }).map((item) => {
                        return {
                            sourceFileIndex: 0,
                            rowBeforeMatchingIndex: item[0],
                            rowValue: dataSheet[item[0]]
                        }
                    })
                }
            });
        }
        else {
            return dataSheet.map((item, index) => {
               return {
                   sourceFileIndex: 0,
                   rowBeforeMatchingIndex: index,
                   rowValue: item,
                   matchedWithRows: indexesOfCorrelatedRows.filter((item) => {
                       return item[0] === index;
                   }).map((item) => {
                       return {
                           sourceFileIndex: 1,
                           rowBeforeMatchingIndex: item[1],
                           rowValue: relationSheet[item[1]]
                       }
                   })
               }
            });
        }
    }

    const createExportJSON = () => {
        const json = {
            inputSheets: [
                {
                    filename: dataSheetName,
                    filepath: dataFile,
                    filesize: dataFileSize,
                    rowCount: dataSheet.length,
                    ownerUserId: dataFileOwnerUserId,
                    ownerTeamId: dataFileOwnerTeamId,
                    fileRows: dataSheet
                },
                {
                    filename: relationSheetName,
                    filepath: relationFile,
                    filesize: relationFileSize,
                    rowCount: relationSheet.length,
                    ownerUserId: relationFileOwnerUserId,
                    ownerTeamId: relationFileOwnerTeamId,
                    fileRows: relationSheet
                }
            ],
            outputMatchedData: {
                relationType: getRelationNameById(matchType),
                rows: getExportJsonOutputMatchedData()
            }
        }

        return JSON.stringify(json);
    }

    const downloadFile = (blob, filename) => {
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const fetchNextRows = () => {
        setRowsToRender(prevState => {
            return [...prevState, ...outputSheet.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)];
        });
        setPage(prevState => (prevState+1));
    }

    const checkScrollToBottom = (e) => {
        const { visibleHeight, scrollHeight, scrolled } = getScrollParams(e);

        if(scrolled + visibleHeight >= scrollHeight) {
            if((page) * ROWS_PER_PAGE < outputSheet.length) {
                fetchNextRows();
            }
        }
    }

    const getColumnMinWidth = () => {
        const numberOfColumns = outputSheetExportColumns?.filter((item) => (item))?.length;

        if(numberOfColumns < 7) {
            return `calc(100% / ${numberOfColumns})`;
        }
        else {
            return `min(300px, ${minColumnWidth}%)`;
        }
    }

    const getStyleWithMinWidth = () => {
        return {
            minWidth: getColumnMinWidth()
        }
    }

    const getColumnMaxHeight = () => {
        return cellsHeight !== -1 ? `${cellsHeight}px` : 'unset';
    }

    const hasDataSheetCounter = () => {
        return Object.keys(outputSheet[0]).includes(content.matchCounterDataSheetName);
    }

    const hasRelationSheetCounter = () => {
        return Object.keys(outputSheet[0]).includes(content.matchCounterRelationSheetName);
    }

    const saveAndReturnToExternalAppValidate = () => {
        if(currentSchemaId === -1 || currentSchemaChangedAndNotSaved) {
            setModalsBeforeReturnToExternalAppVisible(true);
            setTypeOfExport(2);
        }
        else {
            saveAndReturnToExternalApp();
        }
    }

    const saveAndReturnToExternalApp = () => {
        const outputJsonMatchedRows = createExportJSON();
        const matchingRequestObject = {
            id: apiRequestId,
            createDateTime: apiRequestCreateDateTime,
            userId: apiUserId,
            relationType: matchType
        }

        sendRequestToExternalApp(apiOutputEndpoint, outputJsonMatchedRows, matchingRequestObject);
        window.location.href = apiUserRedirectionWebsite;
    }

    const notAllColumnsIncludeInExport = () => {
        return finalExportColumns.findIndex((item) => {
            return !item;
        }) !== -1;
    }

    const handleTemporaryColumnsVisibilityChange = (i) => {
        setTemporaryColumnsVisibility(prevState => {
            return prevState.map((item, index) => {
                if(index === i) {
                    return !item;
                }
                else {
                    return item;
                }
            });
        });
    }

    const confirmColumnsVisibilityChange = () => {
        setOutputSheetColumnsVisibility(temporaryColumnsVisibility);
    }

    return <div className="sheetWrapper sheetWrapper--outputSheet" ref={ref}>
        {exportSettingsModalVisible ? <ExportSettingsModal closeModal={() => { setExportSettingsModalVisible(false); }}
                                                           exportOutputSheet={exportOutputSheetValidate}
                                                           columnsNames={columnsNames} /> : ''}

        {cellsFormatModalVisible ? <CellsFormatModal cellsHeight={cellsHeight}
                                                     setCellsHeight={setCellsHeight}
                                                     closeModal={() => { setCellsFormatModalVisible(false); }} /> : ''}

        {columnsSettingsModalVisible ? <ColumnsSettingsModal closeModal={() => { setColumnsSettingsModalVisible(0); }}
                                                             columnsNames={columnsNames}
                                                             extraIndex={0}
                                                             hideFirstColumn={false}
                                                             columns={columnsSettingsModalVisible === 1 ? outputSheetColumnsVisibility : finalExportColumns}
                                                             setColumns={columnsSettingsModalVisible === 1 ? setOutputSheetColumnsVisibility : setFinalExportColumns}
                                                             header={columnsSettingsModalVisible === 1 ? content.columnVisibility : content.includeInExport} /> : ''}

        {modalsBeforeReturnToExternalAppVisible
            && currentSchemaId === -1 ? <SchemaNotCreatedModal handleSubmit={typeOfExport === 2 ? saveAndReturnToExternalApp : exportOutputSheet}
                                                               closeModal={() => { setModalsBeforeReturnToExternalAppVisible(false); }} /> : ''}

        {modalsBeforeReturnToExternalAppVisible
            && currentSchemaChangedAndNotSaved ? <SchemaChangedAndNotSavedModal handleSubmit={typeOfExport === 2 ? saveAndReturnToExternalApp : exportOutputSheet}
                                                                                closeModal={() => { setModalsBeforeReturnToExternalAppVisible(false); }} /> : ''}

        <div className="btnExportWrapper center">
            {api ? <button className="btn btn--export"
                           onClick={saveAndReturnToExternalAppValidate}>
                    {content.saveAndReturnToExternalApp}
            </button> : ''}
            <button className={api ? "btn btn--export btn--export--small" : "btn btn--export"}
                    onClick={exportOutputSheetValidate}>
                {content.exportOutputSheet}
            </button>
            <button className="btn btn--exportSettings"
                    onClick={() => { setExportSettingsModalVisible(true); }}>
                <img className="img" src={settingsIcon} alt="settings" />
            </button>
        </div>

        <div className="sheetInner">

            <div className="sheetInner__left">
                <div className="sheet__table__info sheet__table__info--data1">
                    <div className="cell--legend">
                        {content.visibility}

                        <div className="center">
                            <IconButtonWithTooltip title={content.configureInWindow}
                                                   onClick={() => { setColumnsSettingsModalVisible(1); }}
                                                   img={configureInWindowIcon} />

                            <IconButtonWithTooltip title={content.formatCellsVisibility}
                                                   onClick={() => { setCellsFormatModalVisible(true); }}
                                                   img={formatCellsIcon} />

                            {!areArraysEqual(outputSheetColumnsVisibility, temporaryColumnsVisibility) ? <IconButtonWithTooltip title={content.use}
                                                                                                                                 onClick={confirmColumnsVisibilityChange}
                                                                                                                                 img={checkIcon} /> : ''}
                        </div>
                    </div>
                </div>

                <div className="sheet__table__info sheet__table__info--data2">
                    <div className="cell--legend">
                        {content.includeInExport}

                        <div className="center">
                            {notAllColumnsIncludeInExport() ? <IconButtonWithTooltip title={content.checkAll}
                                                                                   onClick={() => { handleOutputSheetExportChange(-1); }}
                                                                                   img={checkAllIcon} /> : <IconButtonWithTooltip title={content.uncheckAll}
                                                                                                                                  onClick={() => { handleOutputSheetExportChange(-2); }}
                                                                                                                                  img={uncheckAllIcon} />}

                            <IconButtonWithTooltip title={content.configureInWindow}
                                                   onClick={() => { setColumnsSettingsModalVisible(2); }}
                                                   img={configureInWindowIcon} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="sheet scroll"
                 onScroll={checkScrollToBottom}>

                <div className="sheet__stickyRows">
                    <div className="line line--noFlex line--columnsToCheck">
                        {temporaryColumnsVisibility.map((item, index) => {
                            if(outputSheetColumnsVisibility[index]) {
                                return <div className={"check__cell check__cell--borderBottom"}
                                            style={{
                                                minWidth: getColumnMinWidth()
                                            }}
                                            key={index}>
                                    <button className={temporaryColumnsVisibility[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                            onClick={() => { handleTemporaryColumnsVisibilityChange(index); }}>

                                    </button>
                                </div>
                            }
                        })}
                    </div>

                    <div className="line line--noFlex line--columnsToCheck">
                        {finalExportColumns.map((item, index) => {
                            if(outputSheetColumnsVisibility[index]) {
                                return <div className="check__cell"
                                            style={{
                                                minWidth: getColumnMinWidth()
                                            }}
                                            key={index}>
                                    <button className={finalExportColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                            onClick={() => { handleOutputSheetExportChange(index); }}>

                                    </button>
                                </div>
                            }
                        })}

                        {hasDataSheetCounter() ? <div className="check__cell"
                                                      style={{
                                                          minWidth: '280px'
                                                      }}>
                            <button className={finalExportColumns[finalExportColumns.length-(hasRelationSheetCounter() ? 2 : 1)] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                    onClick={() => { handleOutputSheetExportChange(finalExportColumns.length - (hasRelationSheetCounter() ? 2 : 1)); }}>

                            </button>
                        </div> : ''}
                        {hasRelationSheetCounter() ? <div className="check__cell"
                                                          style={{
                                                              minWidth: '280px'
                                                          }}>
                            <button className={finalExportColumns[finalExportColumns.length-1] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                    onClick={() => { handleOutputSheetExportChange(finalExportColumns.length - 1); }}>

                            </button>
                        </div> : ''}
                    </div>

                    <div className="sheet__table">
                        <div className="line line--noFlex">
                            {columnsNames.filter((_, index) => (outputSheetColumnsVisibility[index]))
                                .map((item, index) => {
                                    return <div className="sheet__header__cell"
                                                style={getStyleWithMinWidth()}
                                                key={index}>
                                        {item}
                                    </div>
                                })}

                            {hasDataSheetCounter() ? <div className="sheet__header__cell"
                                                          style={{
                                                              minWidth: '280px'
                                                          }}>
                                {content.matchCounterDataSheetName}
                            </div> : ''}

                            {hasRelationSheetCounter() ? <div className="sheet__header__cell"
                                                              style={{
                                                                  minWidth: '280px'
                                                              }}>
                                {content.matchCounterRelationSheetName}
                            </div> : ''}
                        </div>
                    </div>
                </div>

                {rowsToRender.map((item, index) => {
                    return <div className="line line--tableRow"
                                key={index}>
                        {/* Columns */}
                        {Object.entries(item).map((item, index) => {
                            if(outputSheetColumnsVisibility[index]) {
                                const cellValue = item[1];

                                return <div className="sheet__body__row__cell"
                                            style={{
                                                minWidth: getColumnMinWidth(),
                                                maxHeight: getColumnMaxHeight()
                                            }}
                                            key={index}>
                                    {cellValue}
                                </div>
                            }
                        })}

                        {/* Match counters */}
                        {hasDataSheetCounter() ? <div className="sheet__body__row__cell"
                                                      style={{
                                                          minWidth: '280px',
                                                          maxHeight: getColumnMaxHeight()
                                                      }}>
                            {item[content.matchCounterDataSheetName]}
                        </div> : ''}
                        {hasRelationSheetCounter() ? <div className="sheet__body__row__cell"
                                                          style={{
                                                              minWidth: '280px',
                                                              maxHeight: getColumnMaxHeight()
                                                          }}>
                            {item[content.matchCounterRelationSheetName]}
                        </div> : ''}
                    </div>
                })}
            </div>
        </div>
    </div>
});

export default OutputSheetView;
