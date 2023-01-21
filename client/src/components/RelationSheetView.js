import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../App";
import {ViewContext} from "./CorrelationView";
import AutoMatchModal from "./AutoMatchModal";

const RelationSheetView = () => {
    const { dataSheet, relationSheet } = useContext(AppContext);
    const { relationSheetExportColumns, setRelationSheetExportColumns } = useContext(ViewContext);

    const [dataSheetColumnsNames, setDataSheetColumnsNames] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);
    const [autoMatchModalVisible, setAutoMatchModalVisible] = useState(false);

    useEffect(() => {
        if(relationSheet && dataSheet) {
            setColumnsNames(Object.entries(relationSheet[0]).map((item) => (item[0])));
            setDataSheetColumnsNames(Object.entries(dataSheet[0]).map((item) => (item[0])));
        }
    }, [relationSheet, dataSheet]);

    const handleExportColumnsChange = (i) => {
        if(i === -2) {
            setRelationSheetExportColumns(prevState => (prevState.map(() => (0))));
        }
        else if(i === -1) {
            setRelationSheetExportColumns(prevState => (prevState.map(() => (1))));
        }
        else {
            setRelationSheetExportColumns(prevState => (prevState.map((item, index) => {
                return index === i ? !item : item;
            })));
        }
    }

    return <div className="sheetWrapper">
        {autoMatchModalVisible ? <AutoMatchModal dataSheetColumns={dataSheetColumnsNames}
                                                 relationSheetColumns={columnsNames} /> : ''}

        <button className="btn btn--autoMatch"
                onClick={() => { setAutoMatchModalVisible(true); }}>
            Automatycznie dopasuj
        </button>

        <div className="sheet scroll">
            <table className="sheet__table">
                <thead>

                <tr>
                    <td className="cell--legend" colSpan={columnsNames.length}>
                        Uwzględnij w eksporcie

                        <button className="btn btn--selectAll"
                                onClick={() => { handleExportColumnsChange(-1); }}>
                            Zaznacz wszystkie
                        </button>
                        <button className="btn btn--selectAll"
                                onClick={() => { handleExportColumnsChange(-2); }}>
                            Odznacz wszystkie
                        </button>
                    </td>
                </tr>
                <tr>
                    {relationSheetExportColumns.map((item, index) => {
                        return <td className="check__cell"
                                   key={index}>
                            <button className={relationSheetExportColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
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
                {relationSheet.map((item, index) => {
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
    </div>
};

export default RelationSheetView;
