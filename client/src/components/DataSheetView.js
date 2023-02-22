import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppContext} from "../App";
import {ViewContext} from "./CorrelationView";

const ROWS_PER_PAGE = 20;

const DataSheetView = () => {
    const { dataSheet } = useContext(AppContext);
    const { showInSelectMenuColumns, setShowInSelectMenuColumns,
        outputSheetExportColumns, setOutputSheetExportColumns } = useContext(ViewContext);

    const [page, setPage] = useState(1);
    const [rowsToRender, setRowsToRender] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);

    let exportLegend = useRef(null);

    useEffect(() => {
        if(dataSheet) {
            setColumnsNames(Object.entries(dataSheet[0]).map((item) => (item[0])));
            setRowsToRender(dataSheet.slice(0, 20));
        }
    }, [dataSheet]);

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

    return <div className="sheet scroll"
                onScroll={(e) => { checkScrollToBottom(e); }}>
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
                    </div>
                </div>

                <div className="sheet__table">
                    <div className="line">
                        {showInSelectMenuColumns.map((item, index) => {
                            return <div className="check__cell check__cell--borderBottom"
                                       key={index}>
                                <button className={showInSelectMenuColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                        onClick={() => { handleSelectMenuColumnsChange(index); }}>

                                </button>
                            </div>
                        })}
                    </div>

                    <div className="line line--exportLegend" ref={exportLegend}>
                        <div className="cell--legend">
                            Uwzględnij w eksporcie

                            {outputSheetExportColumns.findIndex((item) => (!item)) !== -1 ? <button className="btn btn--selectAll"
                                                                                                    onClick={() => { handleExportColumnsChange(-1); }}>
                                Zaznacz wszystkie
                            </button> : <button className="btn btn--selectAll"
                                                onClick={() => { handleExportColumnsChange(-2); }}>
                                Odznacz wszystkie
                            </button>}
                        </div>
                    </div>
                    <div className="line">
                        {outputSheetExportColumns.map((item, index) => {
                            if(index < columnsNames?.length) {
                                return <div className="check__cell"
                                           key={index}>
                                    <button className={outputSheetExportColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                            onClick={() => { handleExportColumnsChange(index); }}>

                                    </button>
                                </div>
                            }
                        })}
                    </div>

                    <div className="line">
                        {columnsNames.map((item, index) => {
                            return <div className="sheet__header__cell"
                                       key={index}>
                                {item}
                            </div>
                        })}
                    </div>
                </div>

        {rowsToRender.map((item, index) => {
            return <div className="line line--tableRow"
                       key={index}>
                {Object.entries(item).map((item, index) => {
                    const cellValue = item[1];

                    return <div className="sheet__body__row__cell"
                               key={index}>
                        {cellValue}
                    </div>
                })}
            </div>
        })}
    </div>
};

export default DataSheetView;
