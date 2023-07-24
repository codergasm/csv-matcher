import React, {useContext, useEffect, useState, forwardRef} from 'react';
import {ViewContext} from "./CorrelationView";
import Papa from "papaparse";
import getScrollParams from "../helpers/getScrollParams";
import ButtonSimple from "./ButtonSimple";
import CellsFormatModal from "./CellsFormatModal";
import ColumnsSettingsModal from "./ColumnsSettingsModal";
import {AppContext} from "../pages/CorrelationPage";
import {getSchemaById} from "../api/schemas";
import ExportSettingsModal from "./ExportSettingsModal";
import settingsIcon from '../static/img/settings.svg';

const ROWS_PER_PAGE = 20;

const OutputSheetView = forwardRef((props, ref) => {
    const { outputSheet, outputSheetExportColumns, setOutputSheetExportColumns,
        outputSheetColumnsVisibility, setOutputSheetColumnsVisibility, setColumnsToSum } = useContext(ViewContext);
    const { currentSchemaId, dataSheet } = useContext(AppContext);

    const [page, setPage] = useState(1);
    const [rowsToRender, setRowsToRender] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);
    const [finalExportColumns, setFinalExportColumns] = useState([]);
    const [minColumnWidth, setMinColumnWidth] = useState(0);
    const [columnsSettingsModalVisible, setColumnsSettingsModalVisible] = useState(0);
    const [cellsFormatModalVisible, setCellsFormatModalVisible] = useState(false);
    const [exportSettingsModalVisible, setExportSettingsModalVisible] = useState(false);
    const [cellsHeight, setCellsHeight] = useState(-1);

    useEffect(() => {
        setFinalExportColumns(outputSheetExportColumns);
        setColumnsToSum(outputSheetExportColumns.map((item, index) => {
            return 0;
        }));
    }, [outputSheetExportColumns]);

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
        }
    }, [columnsNames, currentSchemaId]);

    useEffect(() => {
        if(outputSheet?.length) {
            setRowsToRender(outputSheet.slice(0, ROWS_PER_PAGE));

            const dataSheetLength = Object.entries(dataSheet[0])?.length || 0;
            setColumnsNames(Object.entries(outputSheet[0])
                .map((item) => (item[0]))
                .map((item, index) => {
                    if(index === 0) {
                        return 'l.p. arkusza 1';
                    }
                    else if(index === dataSheetLength) {
                        return 'l.p. arkusza 2';
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
        setOutputSheetColumnsVisibility(columnsNames.map((item, index) => (index < 10)));
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

    const exportOutputSheet = () => {
        const data = outputSheet.map((item) => {
            return Object.fromEntries(Object.entries(item)
                .filter((item, index) => (finalExportColumns[index])));
        });

        const csvData = Papa.unparse({
            fields: Object.keys(data[0]),
            data: data
        });

        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "data.csv");
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
            if((page + 1) * ROWS_PER_PAGE < outputSheet.length) {
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

    return <div className="sheetWrapper" ref={ref}>
        {exportSettingsModalVisible ? <ExportSettingsModal closeModal={() => { setExportSettingsModalVisible(false); }}
                                                           exportOutputSheet={exportOutputSheet}
                                                           columnsNames={columnsNames} /> : ''}

        {cellsFormatModalVisible ? <CellsFormatModal cellsHeight={cellsHeight}
                                                     setCellsHeight={setCellsHeight}
                                                     closeModal={() => { setCellsFormatModalVisible(false); }} /> : ''}

        {columnsSettingsModalVisible ? <ColumnsSettingsModal closeModal={() => { setColumnsSettingsModalVisible(0); }}
                                                             columnsNames={columnsNames}
                                                             extraIndex={0}
                                                             hideFirstColumn={false}
                                                             columns={columnsSettingsModalVisible === 1 ? outputSheetColumnsVisibility : outputSheetExportColumns}
                                                             setColumns={columnsSettingsModalVisible === 1 ? setOutputSheetColumnsVisibility : setOutputSheetExportColumns}
                                                             header={columnsSettingsModalVisible === 1 ? 'Widoczność kolumn' : 'Uwzględnij w eksporcie'} /> : ''}

        <div className="btnExportWrapper center">
            <button className="btn btn--export"
                    onClick={exportOutputSheet}>
                Eksportuj arkusz wyjściowy
            </button>
            <button className="btn btn--exportSettings"
                    onClick={() => { setExportSettingsModalVisible(true); }}>
                <img className="img" src={settingsIcon} alt="ustawienia-eksportu" />
            </button>
        </div>

        <div className="sheet scroll"
             onScroll={(e) => { checkScrollToBottom(e); }}>
            <div className="sheet__table__info">
                <div className="cell--legend">
                    Widoczność

                    <ButtonSimple onClick={() => { setColumnsSettingsModalVisible(1); }}>
                        Konfiguruj w okienku
                    </ButtonSimple>
                    <ButtonSimple onClick={() => { setCellsFormatModalVisible(true); }}>
                        Formatuj widoczność komórek
                    </ButtonSimple>
                </div>
            </div>

            <div className="line line--exportLegend">
                <div className="cell--legend">
                    Uwzględnij w eksporcie

                    {finalExportColumns.findIndex((item) => (!item)) !== -1 ? <button className="btn btn--selectAll"
                                                                                            onClick={() => { handleOutputSheetExportChange(-1); }}>
                        Zaznacz wszystkie
                    </button> : <button className="btn btn--selectAll"
                                        onClick={() => { handleOutputSheetExportChange(-2); }}>
                        Odznacz wszystkie
                    </button>}

                    <ButtonSimple onClick={() => { setColumnsSettingsModalVisible(2); }}>
                        Konfiguruj w okienku
                    </ButtonSimple>
                </div>
            </div>

            <div className="sheet__table">
                <div className="line line--noFlex">
                    {outputSheetExportColumns.map((item, index) => {
                        if(item && outputSheetColumnsVisibility[index]) {
                            return <div className="check__cell"
                                        style={getStyleWithMinWidth()}
                                        key={index}>
                                <button className={finalExportColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                        onClick={() => { handleOutputSheetExportChange(index); }}>

                                </button>
                            </div>
                        }
                        else {
                            return '';
                        }
                    })}
                </div>

                <div className="line line--noFlex">
                    {columnsNames.filter((_, index) => (outputSheetExportColumns[index] && outputSheetColumnsVisibility[index]))
                        .map((item, index) => {
                            return <div className="sheet__header__cell"
                                        style={getStyleWithMinWidth()}
                                        key={index}>
                                {item}
                            </div>
                    })}
                </div>
            </div>

            {rowsToRender.map((item, index) => {
                return <div className="line line--tableRow"
                           key={index}>
                    {Object.entries(item).filter((_, index) => (outputSheetExportColumns[index] && outputSheetColumnsVisibility[index]))
                        .map((item, index, array) => {
                            const cellValue = item[1];

                            return <div className="sheet__body__row__cell"
                                        style={{
                                            minWidth: getColumnMinWidth(),
                                            maxHeight: getColumnMaxHeight()
                                        }}
                                        key={index}>
                                {cellValue}
                            </div>
                    })}
                </div>
            })}
        </div>
    </div>
});

export default OutputSheetView;
