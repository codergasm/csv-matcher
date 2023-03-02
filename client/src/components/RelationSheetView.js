import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../App";
import {ViewContext} from "./CorrelationView";
import AutoMatchModal from "./AutoMatchModal";
import arrowDown from '../static/img/arrow-down.svg';
import ColumnsSettingsModal from "./ColumnsSettingsModal";
import { Tooltip } from 'react-tippy';

const ROWS_PER_PAGE = 20;

const RelationSheetView = () => {
    const { dataSheet, relationSheet } = useContext(AppContext);
    const { outputSheetExportColumns, setOutputSheetExportColumns, correlationMatrix, manuallyCorrelatedRows,
        showInSelectMenuColumns, outputSheet, addManualCorrelation, indexesOfCorrelatedRows } = useContext(ViewContext);

    const [page, setPage] = useState(1);
    const [rowsToRender, setRowsToRender] = useState([]);
    const [dataSheetColumnsNames, setDataSheetColumnsNames] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);
    const [autoMatchModalVisible, setAutoMatchModalVisible] = useState(false);
    const [selectList, setSelectList] = useState([]);
    const [currentSelectMenu, setCurrentSelectMenu] = useState([]);
    const [currentSelectMenuFiltered, setCurrentSelectMenuFiltered] = useState([]);
    const [showSelectMenu, setShowSelectMenu] = useState(-1);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [columnsSettingsModalVisible, setColumnsSettingsModalVisible] = useState(0);
    const [columnsVisibility, setColumnsVisibility] = useState([]);
    const [minColumnWidth, setMinColumnWidth] = useState(0);

    useEffect(() => {
        setRowsToRender(relationSheet.slice(0, ROWS_PER_PAGE));
    }, [relationSheet]);

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
        if(relationSheet?.length && dataSheet?.length) {
            setSelectList(relationSheet.map((relationSheetItem, relationRowIndex) => {
                return dataSheet.map((dataSheetItem, dataRowIndex) => {
                    const value = Object.entries(dataSheet[dataRowIndex])
                        .filter((_, index) => (showInSelectMenuColumns[index]))
                        .map((item) => (item[1]))
                        .join(' - ');

                    return {
                        relationRowIndex,
                        dataRowIndex,
                        similarity: '-1',
                        value
                    }
                });
            }));
        }
    }, [relationSheet, dataSheet]);

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
                        similarity: isNaN(similarity) ? 0 : similarity
                    }
                }).sort((a, b) => (parseInt(a.similarity) < parseInt(b.similarity)) ? 1 : -1);
            }));
        }
    }, [correlationMatrix]);

    useEffect(() => {
        if(relationSheet && dataSheet) {
            setColumnsNames(Object.entries(relationSheet[0]).map((item) => (item[0] === '0' ? 'l.p.' : item[0])));
            setDataSheetColumnsNames(Object.entries(dataSheet[0]).map((item) => (item[0])));
        }
    }, [relationSheet, dataSheet]);

    useEffect(() => {
        if(outputSheet?.length) {
            setAutoMatchModalVisible(false);
        }
    }, [outputSheet]);

    useEffect(() => {
        if(columnsNames?.length) {
            setColumnsVisibility(columnsNames.map(() => true));
        }
    }, [columnsNames]);

    useEffect(() => {
        setMinColumnWidth(125 / (columnsVisibility.filter((item) => (item)).length));
    }, [columnsVisibility]);

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
            else if(val === -1) {
                return 'white';
            }
            else {
                return 'yellow';
            }
        }
    }

    const fetchNextRows = () => {
        setRowsToRender(prevState => {
            return [...prevState, ...relationSheet.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)];
        });
        setPage(prevState => (prevState+1));
    }

    const checkScrollToBottom = (e) => {
        const visibleHeight = e.target.clientHeight;
        const scrollHeight = e.target.scrollHeight;

        const scrolled = e.target.scrollTop;

        if(scrolled + visibleHeight >= scrollHeight) {
            if((page + 1) * ROWS_PER_PAGE < relationSheet.length) {
                fetchNextRows();
            }
        }
    }

    const changeZIndex = (i) => {
        Array.from(document.querySelectorAll('.sheet__body__row__cell--relation')).forEach((item, index) => {
            if(index === i) {
                item.style.zIndex = '1001';
            }
            else {
                item.style.zIndex = '1000';
            }
        });
    }

    return <div className="sheetWrapper">
        {autoMatchModalVisible ? <AutoMatchModal dataSheetColumns={dataSheetColumnsNames}
                                                 closeModal={() => { setAutoMatchModalVisible(false); }}
                                                 relationSheetColumns={columnsNames} /> : ''}

        {columnsSettingsModalVisible ? <ColumnsSettingsModal closeModal={() => { setColumnsSettingsModalVisible(0); }}
                                                             columnsNames={columnsNames}
                                                             extraIndex={columnsSettingsModalVisible === 1 ? dataSheetColumnsNames.length : 0}
                                                             hideFirstColumn={columnsSettingsModalVisible === 1}
                                                             columns={columnsSettingsModalVisible === 1 ? outputSheetExportColumns.slice(dataSheetColumnsNames.length) : columnsVisibility}
                                                             setColumns={columnsSettingsModalVisible === 1 ? setOutputSheetExportColumns : setColumnsVisibility}
                                                             header={columnsSettingsModalVisible === 1 ? 'Uwzględnij w eksporcie' : 'Widoczność kolumn'} /> : ''}

        <button className="btn btn--autoMatch"
                onClick={() => { setAutoMatchModalVisible(true); }}>
            Automatycznie dopasuj
        </button>

        {showInSelectMenuColumns.findIndex((item) => (item)) === -1 ? <span className="disclaimer">
                            <span>
                                Uwaga! żadne kolumny nie są wskazane w arkuszu 1 jako mające się wyświetlać w podpowiadajce,
                                dlatego wiersze poniżej są puste.
                            </span>
                        </span> : ''}

        <div className="sheet scroll"
             onScroll={(e) => { checkScrollToBottom(e); }}>

            <div className="sheet__table__info">
                <div className="cell--legend">
                    Widoczność

                    <button className="btn btn--selectAll"
                            onClick={() => { setColumnsSettingsModalVisible(2); }}>
                        Konfiguruj w okienku
                    </button>
                </div>
            </div>

            <div className="sheet__table__info">
                <div className="cell--legend">
                    Uwzględnij w eksporcie

                    {outputSheetExportColumns.filter((_, index) => (index >= dataSheetColumnsNames.length)).findIndex((item) => (!item)) !== -1 ? <button className="btn btn--selectAll"
                                                                                            onClick={() => { handleExportColumnsChange(-1); }}>
                        Zaznacz wszystkie
                    </button> : <button className="btn btn--selectAll"
                                        onClick={() => { handleExportColumnsChange(-2); }}>
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
                    {outputSheetExportColumns.map((item, index) => {
                        if((index >= dataSheetColumnsNames?.length) && columnsVisibility[index-dataSheetColumnsNames?.length]) {
                            if(index === dataSheetColumnsNames?.length) {
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
                    <div className="check__cell check__cell--relation">

                    </div>
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
                    })}
                    <div className="sheet__header__cell sheet__header__cell--relation">
                        Rekord z ark. 1, z którym powiązano rekord

                        <Tooltip title="Skorzystaj z konfiguracji arkusza 1 i wskaż wartość których kolumn ma się tutaj wyświetlać, aby pomóc Tobie zidentyfikować dane wiersze z danymi z arkusza 1."
                                 followCursor={true}
                                 size="small"
                                 position="top">
                            <span className="sheet__tooltip">
                                ?
                            </span>
                        </Tooltip>
                    </div>
                </div>
            </div>

            {rowsToRender.map((item, index) => {
                let correlatedRow = null;

                if(selectList[index]?.length) {
                    correlatedRow = selectList[index].find((item) => (item.dataRowIndex === indexesOfCorrelatedRows[index]));
                }

                let isCorrelatedRowWithHighestSimilarity = false;

                if(correlatedRow) {
                    isCorrelatedRowWithHighestSimilarity = ((correlatedRow.similarity === selectList[index][0]?.similarity) || (manuallyCorrelatedRows.includes(index)));
                }

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
                    })}

                    <div className="sheet__body__row__cell sheet__body__row__cell--relation">
                        {selectList[index]?.length ? <button className="select__btn"
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 e.preventDefault();
                                                                 changeZIndex(index);
                                                                 setShowSelectMenu(prevState => (prevState === index ? prevState : index));
                                                             }}>
                            {showSelectMenu !== index ? <span className="select__menu__item"
                                                              key={index}>
                                {correlatedRow ? <>
                                    <span className="select__menu__item__value">
                                        {correlatedRow.value}
                                    </span>
                                    <span className="select__menu__item__similarity" style={{
                                        background: getSimilarityColor(correlatedRow.similarity, correlatedRow.relationRowIndex),
                                        color: manuallyCorrelatedRows.includes(correlatedRow.relationRowIndex) ? '#fff' : '#000'
                                    }}>
                                        {!isCorrelatedRowWithHighestSimilarity ? <Tooltip title="Znaleziono wiersz o większym dopasowaniu, jednak został on już przypisany do innego rekordu"
                                                                                          followCursor={true}
                                                                                          size="small"
                                                                                          position="top">
                                            <span className="select__menu__item__similarity__info">
                                                !
                                            </span>
                                        </Tooltip> : ''}

                                        {correlatedRow.similarity >= 0 ? `${correlatedRow.similarity} %` : '-'}
                                    </span>
                                </> : <>
                                    <span className="select__menu__item__value">
                                        -
                                    </span>
                                    <span className="select__menu__item__similarity">
                                        -
                                    </span>
                                </>}
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
                                               disabled={indexesOfCorrelatedRows.includes(item.dataRowIndex)}
                                               onClick={(e) => { indexesOfCorrelatedRows.includes(item.dataRowIndex) ? e.stopPropagation() : addManualCorrelation(item.dataRowIndex, item.relationRowIndex); }}
                                               key={index}>
                                    <span className="select__menu__item__value">
                                        {item.value}
                                    </span>
                                    <span className="select__menu__item__similarity" style={{
                                        background: getSimilarityColor(item.similarity, -1)
                                    }}>
                                        {item.similarity >= 0 ? `${item.similarity} %` : '-'}
                                    </span>
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div>
            })}
        </div>
    </div>
};

export default RelationSheetView;
