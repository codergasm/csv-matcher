import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../App";
import {ViewContext} from "./CorrelationView";

const DataSheetView = () => {
    const { dataSheet } = useContext(AppContext);
    const { showInSelectMenuColumns, setShowInSelectMenuColumns,
        exportColumns, setExportColumns } = useContext(ViewContext);

    const [columnsNames, setColumnsNames] = useState([]);

    useEffect(() => {
        if(dataSheet) {
            setColumnsNames(Object.entries(dataSheet[0]).map((item) => (item[0])));
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
            setExportColumns(prevState => (prevState.map(() => (0))));
        }
        else if(i === -1) {
            setExportColumns(prevState => (prevState.map(() => (1))));
        }
        else {
            setExportColumns(prevState => (prevState.map((item, index) => {
                return index === i ? !item : item;
            })));
        }
    }

    return <div className="sheet scroll">
        <table className="sheet__table">
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

                        {exportColumns.findIndex((item) => (!item)) !== -1 ? <button className="btn btn--selectAll"
                                                                                     onClick={() => { handleExportColumnsChange(-1); }}>
                            Zaznacz wszystkie
                        </button> : <button className="btn btn--selectAll"
                                            onClick={() => { handleExportColumnsChange(-2); }}>
                            Odznacz wszystkie
                        </button>}
                    </td>
                </tr>
                <tr>
                    {exportColumns.map((item, index) => {
                        return <td className="check__cell"
                                   key={index}>
                            <button className={exportColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                    onClick={() => { handleExportColumnsChange(index); }}>

                            </button>
                        </td>
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
            <tbody>
                {dataSheet.map((item, index) => {
                    return <tr className="sheet__body__row"
                               key={index}>
                        {Object.entries(item).map((item, index) => {
                            const cellValue = item[1];

                            return <td className="sheet__body__row__cell"
                                       key={index}>
                                {cellValue}
                            </td>
                        })}
                    </tr>
                })}
            </tbody>
        </table>
    </div>
};

export default DataSheetView;
