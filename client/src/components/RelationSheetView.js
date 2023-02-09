import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../App";
import {ViewContext} from "./CorrelationView";
import AutoMatchModal from "./AutoMatchModal";
import arrowDown from '../static/img/arrow-down.svg';

const RelationSheetView = () => {
    const { dataSheet, relationSheet } = useContext(AppContext);
    const { outputSheetExportColumns, setOutputSheetExportColumns, correlationMatrix, manuallyCorrelatedRows,
        showInSelectMenuColumns, outputSheet, addManualCorrelation, indexesOfCorrelatedRows } = useContext(ViewContext);

    const [dataSheetColumnsNames, setDataSheetColumnsNames] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);
    const [autoMatchModalVisible, setAutoMatchModalVisible] = useState(false);
    const [selectList, setSelectList] = useState([]);
    const [currentSelectMenu, setCurrentSelectMenu] = useState([]);
    const [currentSelectMenuFiltered, setCurrentSelectMenuFiltered] = useState([]);
    const [showSelectMenu, setShowSelectMenu] = useState(-1);
    const [searchInputValue, setSearchInputValue] = useState('');

    useEffect(() => {
        document.addEventListener('click', (e) => {
            setShowSelectMenu(-1);
        });

        document.addEventListener('keyup', (e) => {
           if(e.key === 'Escape') {
               setShowSelectMenu(-1);
           }
        });
    }, []);

    useEffect(() => {
        setSearchInputValue('');

        if(showSelectMenu !== -1) {
            setCurrentSelectMenu(selectList[showSelectMenu]);
            document.querySelector('.select__input').focus();
        }
    }, [showSelectMenu]);

    useEffect(() => {
        setCurrentSelectMenuFiltered(currentSelectMenu);
    }, [currentSelectMenu]);

    useEffect(() => {
        const searchValue = searchInputValue.toLowerCase();

        setCurrentSelectMenuFiltered(currentSelectMenu.filter((item) => {
            return item.value.toLowerCase().includes(searchValue);
        }));
    }, [searchInputValue]);

    useEffect(() => {
        if(correlationMatrix[0]?.length) {
            setSelectList(correlationMatrix.map((relationRowItem, relationRowIndex) => {
                return relationRowItem.map((dataRowItem, dataRowIndex) => {
                    const value = Object.entries(dataSheet[dataRowIndex])
                        .filter((_, index) => (showInSelectMenuColumns[index]))
                        .map((item) => (item[1]))
                        .join(' - ');
                    const similarity = correlationMatrix[relationRowIndex][dataRowIndex]
                        .toFixed(0);

                    return {
                        dataRowIndex,
                        relationRowIndex,
                        value,
                        similarity
                    }
                }).sort((a, b) => (parseInt(a.similarity) < parseInt(b.similarity)) ? 1 : -1);
            }));
        }
    }, [correlationMatrix]);

    useEffect(() => {
        if(relationSheet && dataSheet) {
            setColumnsNames(Object.entries(relationSheet[0]).map((item) => (item[0])));
            setDataSheetColumnsNames(Object.entries(dataSheet[0]).map((item) => (item[0])));
        }
    }, [relationSheet, dataSheet]);

    useEffect(() => {
        if(outputSheet?.length) {
            setAutoMatchModalVisible(false);
        }
    }, [outputSheet]);

    const handleExportColumnsChange = (i) => {
        if(i === -2) {
            setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                return index >= dataSheetColumnsNames?.length ? 0 : item;
            })));
        }
        else if(i === -1) {
            setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                return index >= dataSheetColumnsNames?.length ? 1 : item;
            })));
        }
        else {
            setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                return index === i ? !item : item;
            })));
        }
    }

    const getSimilarityColor = (val, relationRow) => {
        if(manuallyCorrelatedRows.includes(relationRow)) {
            return 'purple';
        }
        else  {
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
    }

    return <div className="sheetWrapper">
        {autoMatchModalVisible ? <AutoMatchModal dataSheetColumns={dataSheetColumnsNames}
                                                 closeModal={() => { setAutoMatchModalVisible(false); }}
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
                        if(index >= dataSheetColumnsNames?.length) {
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
                    <td className="sheet__header__cell">
                        Rekord z ark. 1, z którym powiązano rekord
                    </td>
                </tr>
                </thead>

                <tbody>
                {relationSheet.map((item, index) => {
                    let correlatedRow = {};

                    if(selectList[index]?.length) {
                        correlatedRow = selectList[index].find((item) => (item.dataRowIndex === indexesOfCorrelatedRows[index]));
                    }

                    return <tr className="sheet__body__row"
                               key={index}>
                        {Object.entries(item).map((item, index) => {
                            const cellValue = item[1];

                            return <td className="sheet__body__row__cell"
                                       key={index}>
                                {cellValue}
                            </td>
                        })}

                        <td className="sheet__body__row__cell">
                            {selectList[index]?.length ? <button className="select__btn"
                                                                 onClick={(e) => {
                                                                     e.stopPropagation();
                                                                     e.preventDefault();
                                                                     setShowSelectMenu(prevState => (prevState === index ? prevState : index));
                                                                 }}>
                                {showSelectMenu !== index ? <span className="select__menu__item"
                                                                  key={index}>
                                        <span className="select__menu__item__value">
                                            {correlatedRow.value}
                                        </span>
                                        <span className="select__menu__item__similarity" style={{
                                            background: getSimilarityColor(correlatedRow.similarity, correlatedRow.relationRowIndex),
                                            color: manuallyCorrelatedRows.includes(correlatedRow.relationRowIndex) ? '#fff' : '#000'
                                        }}>
                                            {correlatedRow.similarity} %
                                        </span>
                                </span> : <input className="select__input"
                                                 value={searchInputValue}
                                                 onChange={(e) => { setSearchInputValue(e.target.value); }} />}

                                <img className="select__btn__img"
                                     src={arrowDown}
                                     alt="arrow-down" />
                            </button> : ''}

                            {showSelectMenu === index ? <div className="select__menu scroll">
                                {currentSelectMenuFiltered?.map((item, index) => {
                                    return <button className="select__menu__item"
                                                   onClick={() => { addManualCorrelation(item.dataRowIndex, item.relationRowIndex); }}
                                                key={index}>
                                        <span className="select__menu__item__value">
                                            {item.value}
                                        </span>
                                        <span className="select__menu__item__similarity" style={{
                                            background: getSimilarityColor(item.similarity, -1)
                                        }}>
                                            {item.similarity} %
                                        </span>
                                    </button>
                                })}
                            </div> : ''}
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    </div>
};

export default RelationSheetView;
