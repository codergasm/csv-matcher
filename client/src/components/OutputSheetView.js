import React, {useContext, useEffect, useState} from 'react';
import {ViewContext} from "./CorrelationView";
import Papa from "papaparse";

const ROWS_PER_PAGE = 20;

const OutputSheetView = () => {
    const { outputSheet, outputSheetExportColumns, setOutputSheetExportColumns } = useContext(ViewContext);

    const [page, setPage] = useState(1);
    const [rowsToRender, setRowsToRender] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);

    useEffect(() => {
        if(outputSheet?.length) {
            setRowsToRender(outputSheet.slice(0, ROWS_PER_PAGE));
            setColumnsNames(Object.entries(outputSheet[0]).map((item) => (item[0])))
        }
    }, [outputSheet]);

    const handleOutputSheetExportChange = (i) => {
        if(i === -2) {
            setOutputSheetExportColumns(prevState => (prevState.map(() => (0))));
        }
        else if(i === -1) {
            setOutputSheetExportColumns(prevState => (prevState.map(() => (1))));
        }
        else {
            setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                return index === i ? !item : item;
            })));
        }
    }

    const exportOutputSheet = () => {
        const data = outputSheet.map((item) => {
            return Object.fromEntries(Object.entries(item)
                .filter((item, index) => (outputSheetExportColumns[index])));
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
        const visibleHeight = e.target.clientHeight;
        const scrollHeight = e.target.scrollHeight;

        const scrolled = e.target.scrollTop;

        if(scrolled + visibleHeight >= scrollHeight) {
            if((page + 1) * ROWS_PER_PAGE < outputSheet.length) {
                fetchNextRows();
            }
        }
    }

    return <div className="sheetWrapper">
        <button className="btn btn--export"
                onClick={() => { exportOutputSheet(); }}>
            Eksportuj arkusz wyjściowy
        </button>

        <div className="sheet scroll"
             onScroll={(e) => { checkScrollToBottom(e); }}>
            <div className="line line--exportLegend">
                <div className="cell--legend">
                    Uwzględnij w eksporcie

                    {outputSheetExportColumns.findIndex((item) => (!item)) !== -1 ? <button className="btn btn--selectAll"
                                                                                            onClick={() => { handleOutputSheetExportChange(-1); }}>
                        Zaznacz wszystkie
                    </button> : <button className="btn btn--selectAll"
                                        onClick={() => { handleOutputSheetExportChange(-2); }}>
                        Odznacz wszystkie
                    </button>}
                </div>
            </div>

            <div className="sheet__table">
                <div className="line">
                    {outputSheetExportColumns.map((item, index) => {
                        return <div className="check__cell"
                                    key={index}>
                            <button className={outputSheetExportColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                    onClick={() => { handleOutputSheetExportChange(index); }}>

                            </button>
                        </div>
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
                    {Object.entries(item).map((item, index, array) => {
                        const cellValue = item[1];

                        return <div className="sheet__body__row__cell"
                                   key={index}>
                            {cellValue}
                        </div>
                    })}
                </div>
            })}
        </div>
    </div>
};

export default OutputSheetView;
