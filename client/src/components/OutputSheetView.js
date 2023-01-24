import React, {useContext, useEffect, useState} from 'react';
import {ViewContext} from "./CorrelationView";
import Select from 'react-select';
import {AppContext} from "../App";

const OutputSheetView = () => {
    const { dataSheet } = useContext(AppContext);
    const { outputSheet, showInSelectMenuColumns, outputSheetExportColumns, setOutputSheetExportColumns } = useContext(ViewContext);

    const [columnsNames, setColumnsNames] = useState([]);
    const [selectList, setSelectList] = useState([]);

    useEffect(() => {
        if(dataSheet?.length && showInSelectMenuColumns?.length) {
            setSelectList(dataSheet.map((item) => {
                const valAndLabel = Object.entries(item)
                    .filter((item, index) => (showInSelectMenuColumns[index]))
                    .map((item) => (item[1]))
                    .join(' - ');

                return {
                    value: valAndLabel,
                    label: valAndLabel
                }
            }));
        }
    }, [dataSheet, showInSelectMenuColumns]);

    useEffect(() => {
        if(outputSheet) {
            setColumnsNames(Object.entries(outputSheet[0]).map((item) => (item[0])));
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

    const getSimilarityColor = (val) => {
        if(val >= 90) {
            return 'red';
        }
        else if(val >= 60) {
            return 'orange';
        }
        else {
            return 'yellow';
        }
    }

    return <div className="sheet scroll">
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

                    <button className="btn btn--selectAll"
                            onClick={() => { handleOutputSheetExportChange(-1); }}>
                        Zaznacz wszystkie
                    </button>
                    <button className="btn btn--selectAll"
                            onClick={() => { handleOutputSheetExportChange(-2); }}>
                        Odznacz wszystkie
                    </button>
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
                const similarityValue = parseInt(Object.entries(item).slice(-1)[0][1]);

                return <tr className="sheet__body__row"
                           key={index}>
                    {Object.entries(item).map((item, index, array) => {
                        const cellValue = item[1];

                        if(index === array.length - 1) {
                            // Column with select
                            return <td className="sheet__body__row__cell"
                                key={index}>
                                {selectList ? <Select
                                    defaultValue={selectList[0]}
                                    options={selectList}
                                    placeholder="Wybierz rekord" /> : ''}
                            </td>
                        }
                        else {
                            return <td className="sheet__body__row__cell"
                                       key={index}>
                                {cellValue}
                            </td>
                        }
                    })}

                    <td className="sheet__body__row__cell" style={{
                        background: getSimilarityColor(similarityValue)
                    }}>
                        Podobieństwo:<br/>
                        {similarityValue} %
                    </td>
                </tr>
            })}
            </tbody>
        </table>
    </div>
};

export default OutputSheetView;
