import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../App";
import {ViewContext} from "./CorrelationView";
import InfiniteScroll from 'react-infinite-scroll-component';

const ROWS_PER_PAGE = 20;

const DataSheetView = () => {
    const { dataSheet } = useContext(AppContext);
    const { showInSelectMenuColumns, setShowInSelectMenuColumns,
        outputSheetExportColumns, setOutputSheetExportColumns } = useContext(ViewContext);

    const [page, setPage] = useState(1);
    const [rowsToRender, setRowsToRender] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);

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

    return <div className="sheet">
        <table className="sheet__table" id="scrollableTable">
            <thead>
                <tr>
                    <td className="cell--legend" colSpan={columnsNames.length}>
                        Pokazuj w podpowiadajce

                        {showInSelectMenuColumns.findIndex((item) => (!item)) !== -1 ? <button className="btn btn--selectAll"
                                                                                               onClick={() => { handleSelectMenuColumnsChange(-1); }}>
                            Zaznacz wszystkie
                        </button> : <button className="btn btn--selectAll"
                                onClick={() => { handleSelectMenuColumnsChange(-2); }}>
                            Odznacz wszystkie
                        </button>}
                    </td>
                </tr>
                <tr>
                    {showInSelectMenuColumns.map((item, index) => {
                        return <td className="check__cell"
                                   key={index}>
                            <button className={showInSelectMenuColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                    onClick={() => { handleSelectMenuColumnsChange(index); }}>

                            </button>
                        </td>
                    })}
                </tr>

                <tr>
                    <td className="cell--legend" colSpan={columnsNames.length}>
                        Uwzględnij w eksporcie

                        {outputSheetExportColumns.findIndex((item) => (!item)) !== -1 ? <button className="btn btn--selectAll"
                                                                                     onClick={() => { handleExportColumnsChange(-1); }}>
                            Zaznacz wszystkie
                        </button> : <button className="btn btn--selectAll"
                                            onClick={() => { handleExportColumnsChange(-2); }}>
                            Odznacz wszystkie
                        </button>}
                    </td>
                </tr>
                <tr>
                    {outputSheetExportColumns.map((item, index) => {
                        if(index < columnsNames?.length) {
                            return <td className="check__cell"
                                       key={index}>
                                <button className={outputSheetExportColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                        onClick={() => { handleExportColumnsChange(index); }}>

                                </button>
                            </td>
                        }
                    })}
                </tr>

                <tr>
                    {columnsNames.map((item, index) => {
                        return <td className="sheet__header__cell"
                                   key={index}>
                            {item}
                        </td>
                    })}
                </tr>
            </thead>
        </table>

        <InfiniteScroll
            dataLength={page * ROWS_PER_PAGE}
            next={fetchNextRows}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            height={400}
            className="scroll"
            endMessage={''}
        >
            {rowsToRender.map((item, index) => {
                return <div className="sheet__body__row"
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
        </InfiniteScroll>
    </div>
};

export default DataSheetView;
