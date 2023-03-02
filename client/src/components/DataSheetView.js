import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppContext} from "../App";
import {ViewContext} from "./CorrelationView";
import ColumnsSettingsModal from "./ColumnsSettingsModal";

const ROWS_PER_PAGE = 20;

const DataSheetView = () => {
    const { dataSheet } = useContext(AppContext);
    const { showInSelectMenuColumns, setShowInSelectMenuColumns,
        outputSheetExportColumns, setOutputSheetExportColumns } = useContext(ViewContext);

    const [page, setPage] = useState(1);
    const [rowsToRender, setRowsToRender] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);
    const [columnsSettingsModalVisible, setColumnsSettingsModalVisible] = useState(0);
    const [columnsVisibility, setColumnsVisibility] = useState([]);
    const [minColumnWidth, setMinColumnWidth] = useState(0);

    let exportLegend = useRef(null);

    useEffect(() => {
        if(dataSheet) {
            setColumnsNames(Object.entries(dataSheet[0]).map((item) => (item[0] !== '0' ? item[0] : 'l.p.')));
            setRowsToRender(dataSheet.slice(0, 20));
        }
    }, [dataSheet]);

    useEffect(() => {
        if(columnsNames?.length) {
            setColumnsVisibility(columnsNames.map(() => true));
        }
    }, [columnsNames]);

    useEffect(() => {
        setMinColumnWidth(100 / (columnsVisibility.filter((item) => (item)).length));
    }, [columnsVisibility]);

    const handleSelectMenuColumnsChange = (i) => {
        if(i === -2) {
            setShowInSelectMenuColumns(prevState => (prevState.map(() => (0))));
        }
        else if(i === -1) {
            setShowInSelectMenuColumns(prevState => (prevState.map(() => (1))));
        }
        else {
            setShowInSelectMenuColumns(prevState => (prevState.map((item, index) => {
                return index === i ? !item : item;
            })));
        }
    }

    const handleExportColumnsChange = (i) => {
        if(i === -2) {
            setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                return index < columnsNames?.length ? 0 : item;
            })));
        }
        else if(i === -1) {
            setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                return index < columnsNames?.length ? 1 : item;
            })));
        }
        else {
            setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                return index === i ? !item : item;
            })));
        }
    }

    const fetchNextRows = () => {
        setRowsToRender(prevState => {
            return [...prevState, ...dataSheet.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)];
        });
        setPage(prevState => (prevState+1));
    }

    const checkScrollToBottom = (e) => {
        const visibleHeight = e.target.clientHeight;
        const scrollHeight = e.target.scrollHeight;

        const scrolled = e.target.scrollTop;

        if(scrolled + visibleHeight >= scrollHeight) {
            if((page + 1) * ROWS_PER_PAGE < dataSheet.length) {
                fetchNextRows();
            }
        }

        if(e.target.scrollTop === 0) {
            exportLegend.current.style.height = '40px';
        }
        else {
            exportLegend.current.style.height = '0';
        }
    }

    const getColumnsForModal = (n) => {
        if(n === 1) {
            return showInSelectMenuColumns;
        }
        else if(n === 2) {
            return outputSheetExportColumns.slice(1, columnsNames.length);
        }
        else {
            return columnsVisibility;
        }
    }

    const getSetColumnsForModal = (n) => {
        if(n === 1) {
            return setShowInSelectMenuColumns;
        }
        else if(n === 2) {
            return setOutputSheetExportColumns;
        }
        else {
            return setColumnsVisibility;
        }
    }

    const getSettingsModalHeader = (n) => {
        if(n === 1) {
            return 'Pokazuj w podpowiadajce';
        }
        else if(n === 2) {
            return 'Uwzględnij w eksporcie';
        }
        else {
            return 'Ustaw widoczność';
        }
    }

    return <div className="sheet scroll"
                onScroll={(e) => { checkScrollToBottom(e); }}>

        {columnsSettingsModalVisible ? <ColumnsSettingsModal closeModal={() => { setColumnsSettingsModalVisible(0); }}
                                                             columnsNames={columnsNames}
                                                             hideFirstColumn={columnsSettingsModalVisible === 2}
                                                             columns={getColumnsForModal(columnsSettingsModalVisible)}
                                                             setColumns={getSetColumnsForModal(columnsSettingsModalVisible)}
                                                             header={getSettingsModalHeader(columnsSettingsModalVisible)} /> : ''}


                <div className="sheet__table__info">
                    <div className="cell--legend">
                        Widoczność

                        <button className="btn btn--selectAll"
                                onClick={() => { setColumnsSettingsModalVisible(3); }}>
                            Konfiguruj w okienku
                        </button>
                    </div>
                </div>

                <div className="sheet__table__info">
                    <div className="cell--legend">
                        Pokazuj w podpowiadajce

                        {showInSelectMenuColumns.findIndex((item) => (!item)) !== -1 ? <button className="btn btn--selectAll"
                                                                                               onClick={() => { handleSelectMenuColumnsChange(-1); }}>
                            Zaznacz wszystkie
                        </button> : <button className="btn btn--selectAll"
                                onClick={() => { handleSelectMenuColumnsChange(-2); }}>
                            Odznacz wszystkie
                        </button>}

                        <button className="btn btn--selectAll"
                                onClick={() => { setColumnsSettingsModalVisible(1); }}>
                            Konfiguruj w okienku
                        </button>
                    </div>
                </div>

                <div className="sheet__table">
                    <div className="line">
                        {showInSelectMenuColumns.map((item, index) => {
                            if(columnsVisibility[index]) {
                                return <div className={index === 0 ? "check__cell check__cell--first check__cell--borderBottom" : "check__cell check__cell--borderBottom"}
                                            style={{
                                                minWidth: `min(300px, ${minColumnWidth}%)`
                                            }}
                                            key={index}>
                                    <button className={showInSelectMenuColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                            onClick={() => { handleSelectMenuColumnsChange(index); }}>

                                    </button>
                                </div>
                            }
                            else {
                                return '';
                            }
                        })}
                    </div>

                    <div className="line line--exportLegend" ref={exportLegend}>
                        <div className="cell--legend">
                            Uwzględnij w eksporcie

                            {outputSheetExportColumns.filter((_, index) => (index < columnsNames.length)).findIndex((item) => (!item)) !== -1 ? <button className="btn btn--selectAll"
                                                                                                    onClick={() => { handleExportColumnsChange(-1); }}>
                                Zaznacz wszystkie
                            </button> : <button className="btn btn--selectAll"
                                                onClick={() => { handleExportColumnsChange(-2); }}>
                                Odznacz wszystkie
                            </button>}

                            <button className="btn btn--selectAll"
                                    onClick={() => { setColumnsSettingsModalVisible(2); }}>
                                Konfiguruj w okienku
                            </button>
                        </div>
                    </div>
                    <div className="line">
                        {outputSheetExportColumns.map((item, index) => {
                            if((index < columnsNames?.length) && (columnsVisibility[index])) {
                                if(index === 0) {
                                    return <div className="check__cell check__cell--first"
                                                style={{
                                                    minWidth: `min(300px, ${minColumnWidth}%)`
                                                }}
                                                key={index}>
                                        <button className="btn btn--check btn--notVisible"
                                                disabled={true}>

                                        </button>
                                    </div>
                                }
                                else {
                                    return <div className="check__cell"
                                                style={{
                                                    minWidth: `min(300px, ${minColumnWidth}%)`
                                                }}
                                                key={index}>
                                        <button className={outputSheetExportColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                                onClick={() => { handleExportColumnsChange(index); }}>

                                        </button>
                                    </div>
                                }
                            }
                        })}
                    </div>

                    <div className="line">
                        {columnsNames.map((item, index) => {
                            if(columnsVisibility[index]) {
                                return <div className={index === 0 ? "sheet__header__cell sheet__header__cell--first" : "sheet__header__cell"}
                                            style={{
                                                minWidth: `min(300px, ${minColumnWidth}%)`
                                            }}
                                            key={index}>
                                    {item}
                                </div>
                            }
                            else {
                                return '';
                            }
                        })}
                    </div>
                </div>

        {rowsToRender.map((item, index) => {
            return <div className="line line--tableRow"
                       key={index}>
                {Object.entries(item).map((item, index) => {
                    const cellValue = item[1];

                    if(columnsVisibility[index]) {
                        return <div className={index === 0 ? "sheet__body__row__cell sheet__body__row__cell--first" : "sheet__body__row__cell"}
                                    style={{
                                        minWidth: `min(300px, ${minColumnWidth}%)`
                                    }}
                                    key={index}>
                            {cellValue}
                        </div>
                    }
                    else {
                        return '';
                    }
                })}
            </div>
        })}
    </div>
};

export default DataSheetView;
