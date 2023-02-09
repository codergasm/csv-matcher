import React, {useContext, useEffect, useState} from 'react';
import {ViewContext} from "./CorrelationView";
import Papa from "papaparse";

const OutputSheetView = () => {
    const { outputSheet, outputSheetExportColumns, setOutputSheetExportColumns } = useContext(ViewContext);

    const [columnsNames, setColumnsNames] = useState([]);

    useEffect(() => {
        if(outputSheet?.length) {
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

    return <div className="sheet scroll">
        <button className="btn btn--export" onClick={() => { exportOutputSheet(); }}>
            Eksportuj arkusz wyjściowy
        </button>

        <table className="sheet__table">
            <thead>
            <tr>
                {outputSheetExportColumns.map((item, index) => {
                    return <td className="check__cell"
                               key={index}>
                        <button className={outputSheetExportColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                onClick={() => { handleOutputSheetExportChange(index); }}>

                        </button>
                    </td>
                })}
            </tr>

            <tr>
                <td className="cell--legend" colSpan={columnsNames.length}>
                    Uwzględnij w eksporcie

                    {outputSheetExportColumns.findIndex((item) => (!item)) !== -1 ? <button className="btn btn--selectAll"
                                                                                            onClick={() => { handleOutputSheetExportChange(-1); }}>
                        Zaznacz wszystkie
                    </button> : <button className="btn btn--selectAll"
                                        onClick={() => { handleOutputSheetExportChange(-2); }}>
                        Odznacz wszystkie
                    </button>}
                </td>
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
                {outputSheet.map((item, index) => {
                    return <tr className="sheet__body__row"
                               key={index}>
                        {Object.entries(item).map((item, index, array) => {
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

export default OutputSheetView;
