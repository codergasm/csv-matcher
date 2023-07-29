import React, {useContext, useEffect, useState, forwardRef} from 'react';
import {AppContext} from "../pages/CorrelationPage";
import {ViewContext} from "./CorrelationView";
import AutoMatchModal from "./AutoMatchModal";
import arrowDown from '../static/img/arrow-down.svg';
import ColumnsSettingsModal from "./ColumnsSettingsModal";
import { Tooltip } from 'react-tippy';
import {checkCommonElement, findSubstrings, sortByColumn, sortRelationColumn} from "../helpers/others";
import Loader from "./Loader";
import CellsFormatModal from "./CellsFormatModal";
import FullValueModal from "./FullValueModal";
import ColorMarkedText from "./ColorMarkedText";
import { ROWS_PER_PAGE } from "../static/constans";
import getSimilarityColor from "../helpers/getSimilarityColor";
import RelationSelectionEmptyRow from "./RelationSelectionEmptyRow";
import ButtonAutoMatch from "./ButtonAutoMatch";
import TableViewHeaderRow from "./TableViewHeaderRow";
import TableViewHeaderRowRelationColumn from "./TableViewHeaderRowRelationColumn";
import getScrollParams from "../helpers/getScrollParams";
import SheetCell from "./SheetCell";
import getColumnsSortingAndSortType from "../helpers/getColumnsSortingAndSortType";
import convertColumnToNumber from "../helpers/convertColumnToNumber";
import ButtonSimple from "./ButtonSimple";
import OverrideMatchModal from "./OverrideMatchModal";
import DeleteMatchesModal from "./DeleteMatchesModal";
import MatchTypeSelect from "./MatchTypeSelect";
import {getSchemaById} from "../api/schemas";
import useCloseDropdownSelectMenu from "../hooks/useCloseDropdownSelectMenu";
import getLevelsOfRelationColumn from "../helpers/getLevelsOfRelationColumn";
import RelationColumnSelect from "./RelationColumnSelect";
import {TranslationContext} from "../App";
import checkAllIcon from '../static/img/select-all.svg';
import uncheckAllIcon from '../static/img/unselect-all.svg';
import configureInWindowIcon from '../static/img/configure-in-window.svg';
import formatCellsIcon from '../static/img/format-cells.svg';
import IconButtonWithTooltip from "./IconButtonWithTooltip";

const RelationSheetView = forwardRef(({sheetIndex, currentSheet, secondSheet,
                               showInSelectMenuColumnsSecondSheet,
                               currentSheetColumnsVisibility, setCurrentSheetColumnsVisibility,
                               showInSelectMenuColumnsCurrentSheet, setShowInSelectMenuColumnsCurrentSheet,
                               selectList, selectListLoading, selectListIndicators,
                               manuallyCorrelatedRowsIndexes, schemaCorrelatedRowsIndexes,
                               indexesOfCorrelatedRowsIndexes, indexesOfCorrelatedRowsSecondSheetIndexes, user}, ref) => {
    const { content } = useContext(TranslationContext);
    const { currentSchemaId } = useContext(AppContext);
    const { outputSheetExportColumns, setOutputSheetExportColumns, priorities,
        addManualCorrelation, setIndexesOfCorrelatedRows, indexesOfCorrelatedRows, matchType } = useContext(ViewContext);

    const [page, setPage] = useState(1);
    const [currentSheetSorted, setCurrentSheetSorted] = useState([]);
    const [rowsToRender, setRowsToRender] = useState([]);
    const [secondSheetColumnsNames, setSecondSheetColumnsNames] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);
    const [autoMatchModalVisible, setAutoMatchModalVisible] = useState(false);
    const [currentSelectMenu, setCurrentSelectMenu] = useState([]);
    const [currentSelectMenuToDisplay, setCurrentSelectMenuToDisplay] = useState([]);
    const [currentSelectMenuFiltered, setCurrentSelectMenuFiltered] = useState([]);
    const [showSelectMenu, setShowSelectMenu] = useState(-1);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [columnsSettingsModalVisible, setColumnsSettingsModalVisible] = useState(0);
    const [minColumnWidth, setMinColumnWidth] = useState(0);
    const [columnsSorting, setColumnsSorting] = useState([]);
    const [relationColumnSort, setRelationColumnSort] = useState(0);
    const [indexesInRender, setIndexesInRender] = useState([]);
    const [sortingClicked, setSortingClicked] = useState(false);
    const [currentListPage, setCurrentListPage] = useState(1);
    const [cellsFormatModalVisible, setCellsFormatModalVisible] = useState(false);
    const [cellsHeight, setCellsHeight] = useState(-1);
    const [fullCellValueSubstringsIndexes, setFullCellValueSubstringsIndexes] = useState([]);
    const [showFullCellValue, setShowFullCellValue] = useState('');
    const [markLettersRows, setMarkLettersRows] = useState([]);
    const [overrideMatchModalVisible, setOverrideMatchModalVisible] = useState(false);
    const [dataRowIndexForManualCorrelation, setDataRowIndexForManualCorrelation] = useState(-1);
    const [relationRowIndexForManualCorrelation, setRelationRowIndexForManualCorrelation] = useState(-1);
    const [deleteMatchesModalVisible, setDeleteMatchesModalVisible] = useState(false);
    const [indexesOfCorrelatedRowsLevels, setIndexesOfCorrelatedRowsLevels] = useState([[]]);
    const [numberOfRelationColumns, setNumberOfRelationColumns] = useState(0);
    const [currentRelationColumnVisible, setCurrentRelationColumnVisible] = useState(0);

    useCloseDropdownSelectMenu(showFullCellValue, setShowSelectMenu);

    useEffect(() => {
        setIndexesOfCorrelatedRowsLevels(getLevelsOfRelationColumn(indexesOfCorrelatedRows, sheetIndex));
    }, [indexesOfCorrelatedRows]);

    useEffect(() => {
        if(indexesOfCorrelatedRowsLevels) {
            setNumberOfRelationColumns(prevState => {
                if(prevState < indexesOfCorrelatedRowsLevels?.length) {
                    return indexesOfCorrelatedRowsLevels?.length;
                }
                else {
                    return prevState;
                }
            });
        }
    }, [indexesOfCorrelatedRowsLevels]);

    useEffect(() => {
        if(indexesOfCorrelatedRows?.length) {
            if(!indexesInRender?.length) {
                // Initial sort map
                setIndexesInRender(indexesOfCorrelatedRows.map((_, index) => (index)));
            }
        }
    }, [indexesOfCorrelatedRows]);

    useEffect(() => {
        setCurrentSheetSorted(currentSheet);
    }, [currentSheet]);

    useEffect(() => {
        if(currentSheetSorted?.length) {
            setRowsToRender(currentSheetSorted.slice(0, ROWS_PER_PAGE));

            // Change map
            setIndexesInRender(currentSheetSorted.map((item, index) => {
                return currentSheet.indexOf(item);
            }));
        }
    }, [currentSheetSorted]);

    useEffect(() => {
        if(currentSelectMenuFiltered?.length) {
            setCurrentSelectMenuToDisplay(currentSelectMenuFiltered.slice(0, ROWS_PER_PAGE));
        }
        else {
            setCurrentSelectMenuToDisplay([]);
        }
    }, [currentSelectMenuFiltered]);

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
            const value = Object.entries(secondSheet[sheetIndex === 0 ? item.relationRowIndex : item.dataRowIndex])
                .filter((_, index) => (showInSelectMenuColumnsSecondSheet[index]))
                .map((item) => (item[1]))
                .join(' - ');
            return value.toLowerCase().includes(searchValue);
        }));
    }, [searchInputValue]);

    useEffect(() => {
        if(currentSheet && secondSheet) {
            setColumnsNames(Object.entries(currentSheet[0]).map((item, index) => (index === 0 ? content.index : item[0])));
            setSecondSheetColumnsNames(Object.entries(secondSheet[0]).map((item) => (item[0])));
        }
    }, [currentSheet, secondSheet]);

    useEffect(() => {
        if(columnsNames?.length) {
            if(!currentSheetColumnsVisibility?.length) {
                if(currentSchemaId > 0) {
                    getSchemaById(currentSchemaId)
                        .then((res) => {
                            if(res?.data) {
                                const columnsVisibilityFromDatabase = JSON.parse(res.data.columns_settings_object).columnsVisibility[sheetIndex];

                                if(columnsNames.length === columnsVisibilityFromDatabase.length) {
                                    setCurrentSheetColumnsVisibility(columnsVisibilityFromDatabase);
                                }
                                else {
                                    setDefaultColumnsVisibility();
                                }
                            }
                            else {
                                setDefaultColumnsVisibility();
                            }
                        })
                        .catch(() => {
                            setDefaultColumnsVisibility();
                        });
                }
                else {
                    setDefaultColumnsVisibility();
                }
            }
            if(!columnsSorting?.length) {
                setColumnsSorting(columnsNames.map(() => (0)));
            }
        }
    }, [columnsNames, currentSchemaId]);

    useEffect(() => {
        if(currentSheetColumnsVisibility) {
            setMinColumnWidth(125 / (currentSheetColumnsVisibility.filter((item) => (item)).length));
        }
    }, [currentSheetColumnsVisibility]);

    const handleSelectMenuColumnsChange = (i) => {
        if(i === -2) {
            setShowInSelectMenuColumnsCurrentSheet(prevState => (prevState.map(() => (0))));
        }
        else if(i === -1) {
            setShowInSelectMenuColumnsCurrentSheet(prevState => (prevState.map(() => (1))));
        }
        else {
            setShowInSelectMenuColumnsCurrentSheet(prevState => ([...prevState.map((item, index) => {
                return index === i ? !item : item;
            })]));
        }
    }

    const setDefaultColumnsVisibility = () => {
        setCurrentSheetColumnsVisibility(columnsNames.map((item, index) => (index < 10)));
    }

    const handleExportColumnsChange = (i) => {
        const getCondition = (i) => {
            if(sheetIndex === 0) {
                return i <= columnsNames?.length;
            }
            else {
                return i > secondSheetColumnsNames?.length;
            }
        }

        if(i === -2) {
            setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                return getCondition(index) ? 0 : item;
            })));
        }
        else if(i === -1) {
            setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                return getCondition(index) ? 1 : item;
            })));
        }
        else {

            setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                return index === i ? !item : item;
            })));
        }
    }

    const getSimilarityColorForRelationSheet = (val, relationRow) => {
        if(manuallyCorrelatedRowsIndexes.includes(relationRow)) {
            return 'purple';
        }
        else if(schemaCorrelatedRowsIndexes.includes(relationRow)) {
            return 'blue';
        }
        else  {
            return getSimilarityColor(val);
        }
    }

    useEffect(() => {
        // Sorting changed - fetch next rows from start
        if(sortingClicked) {
            setRowsToRender([...currentSheetSorted.slice(0, 20)]);
            setPage(1);
        }
    }, [currentSheetSorted]);

    const fetchNextRows = () => {
        setRowsToRender(prevState => {
            return [...prevState, ...currentSheetSorted.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)];
        });
        setPage(prevState => (prevState+1));
    }

    const fetchNextRowsForSelectMenu = () => {
        setCurrentSelectMenuToDisplay(prevState => {
            return [...prevState, ...currentSelectMenuFiltered.slice(currentListPage * ROWS_PER_PAGE, currentListPage * ROWS_PER_PAGE + ROWS_PER_PAGE)];
        });
        setCurrentListPage(prevState => (prevState+1));
    }

    const checkScrollToBottom = (e) => {
        const { visibleHeight, scrollHeight, scrolled } = getScrollParams(e);

        if(scrolled + visibleHeight + 3 >= scrollHeight) {
            if((page) * ROWS_PER_PAGE < currentSheetSorted.length) {
                fetchNextRows();
            }
        }
    }

    const checkListScrollToBottom = (e) => {
        const { visibleHeight, scrollHeight, scrolled } = getScrollParams(e);

        if(scrolled + visibleHeight + 3 >= scrollHeight) {
            if((currentListPage) * ROWS_PER_PAGE < currentSelectMenuFiltered.length) {
                fetchNextRowsForSelectMenu();
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

    const sortSheet = (col, i) => {
        setRelationColumnSort(0);

        const { newSorting, sortType } = getColumnsSortingAndSortType(i, columnsSorting);
        col = convertColumnToNumber(col);

        setColumnsSorting(newSorting);
        setCurrentSheetSorted(sortByColumn(currentSheet, col, sortType));
    }

    const removeSorting = (i) => {
        setColumnsSorting(prevState => (prevState.map((item, index) => {
            if(index === i) {
                return 0;
            }
            else {
                return item;
            }
        })));

        setCurrentSheetSorted(currentSheet);
    }

    const sortRelationColumnByMatch = (type) => {
        setSortingClicked(true);
        setColumnsSorting(prevState => (prevState.map(() => (0))));
        setCurrentSheetSorted(currentSheet);
        setRelationColumnSort(prevState => (prevState === type ? 0 : type));
    }

    useEffect(() => {
        setCurrentSheetSorted(sortRelationColumn(currentSheet, indexesOfCorrelatedRows, relationColumnSort));
    }, [relationColumnSort]);

    const markLetters = (relationRowIndex) => {
        setMarkLettersRows((prevState) => {
            if(prevState.includes(relationRowIndex)) {
                return prevState.filter((item) => (item !== relationRowIndex));
            }
            else {
                return [...prevState, relationRowIndex];
            }
        });
    }

    const removeCorrelation = (dataRowIndex, relationRowIndex) => {
        setIndexesOfCorrelatedRows((prevState) => {
            return prevState.filter((item) => {
                return item[0] !== dataRowIndex || item[1] !== relationRowIndex;
            });
        });
    }

    const getColumnMaxHeight = () => {
        return cellsHeight !== -1 ? `${cellsHeight}px` : 'unset';
    }

    const getColumnMinWidth = () => {
        const numberOfColumns = columnsNames?.length;

        if(numberOfColumns === 2) {
            return 'calc((100% - 400px) * 0.92)';
        }
        else if(numberOfColumns === 3) {
            return `calc((100% - 400px) * 0.46)`;
        }
        else if(numberOfColumns === 4) {
            return `calc((100% - 400px) * 0.32)`;
        }
        else {
            return `min(300px, ${minColumnWidth}%)`;
        }
    }

    const showRelationSelectionDropdown = (e, index) => {
        e.stopPropagation();
        e.preventDefault();
        changeZIndex(index);
        setShowSelectMenu(prevState => (prevState === indexesInRender[index] ? prevState : indexesInRender[index]));
    }

    const showFullRow = (e, value, joinString) => {
        e.stopPropagation();
        setFullCellValueSubstringsIndexes(findSubstrings(joinString, value))
        setShowFullCellValue(value);
    }

    const printSimilarityPercentage = (similarity) => {
        return similarity >= 0 ? `${similarity} %` : '-';
    }

    const columnWithMinWidth = () => {
        return {
            minWidth: getColumnMinWidth()
        }
    }

    const addManualCorrelationWrapper = (e, item) => {
        let condition = sheetIndex === 0 ? ((indexesOfCorrelatedRowsSecondSheetIndexes.includes(item.relationRowIndex)) && (matchType !== 3) && (matchType !== 2)) :
            ((indexesOfCorrelatedRowsSecondSheetIndexes.includes(item.dataRowIndex)) && (matchType !== 3) && (matchType !== 1));

        if(condition) {
            e.stopPropagation();
            setOverrideMatchModalVisible(true);
            setDataRowIndexForManualCorrelation(item.dataRowIndex);
            setRelationRowIndexForManualCorrelation(item.relationRowIndex);
        }
        else {
            addManualCorrelation(item.dataRowIndex, item.relationRowIndex);
        }
    }

    const getColumnsForModal = (n) => {
        if(n === 1) {
            return showInSelectMenuColumnsCurrentSheet;
        }
        else if(n === 2) {
            if(sheetIndex === 0) {
                return outputSheetExportColumns.slice(1, columnsNames.length+1);
            }
            else {
                return outputSheetExportColumns.slice(secondSheetColumnsNames.length);
            }
        }
        else {
            return currentSheetColumnsVisibility;
        }
    }

    const getSetColumnsForModal = (n) => {
        if(n === 1) {
            return setShowInSelectMenuColumnsCurrentSheet;
        }
        else if(n === 2) {
            return setOutputSheetExportColumns;
        }
        else {
            return setCurrentSheetColumnsVisibility;
        }
    }

    const getSettingsModalHeader = (n) => {
        if(n === 1) {
            return content.showInSelectMenu;
        }
        else if(n === 2) {
            return content.includeInExport;
        }
        else {
            return content.setVisibility;
        }
    }

    const isShowInSelectMenuFromSecondSheetEmpty = () => {
        return showInSelectMenuColumnsSecondSheet.findIndex((item) => (item)) === -1;
    }

    const outputSheetExportColumnsVisibilityFirstColumnCondition = (i) => {
        if(sheetIndex === 0) {
            return i === 0;
        }
        else {
            return i === secondSheetColumnsNames?.length;
        }
    }

    const outputSheetExportColumnsVisibilityCondition = (i) => {
        if(sheetIndex === 0) {
            return (i < columnsNames?.length) && (currentSheetColumnsVisibility[i]);
        }
        else {
            return (i >= secondSheetColumnsNames?.length) && (currentSheetColumnsVisibility[i-secondSheetColumnsNames?.length]);
        }
    }

    const isRelationColumnSelectAvailable = () => {
        return (matchType === 3) || (matchType === 2 && sheetIndex === 1) || (matchType === 1 && sheetIndex === 0);
    }

    const isDropdownMenuItemDisabled = (dataRowIndex, relationRowIndex) => {
        if(sheetIndex === 0) {
            return (indexesOfCorrelatedRowsSecondSheetIndexes.includes(relationRowIndex)) && (matchType !== 3) && (matchType !== 2);
        }
        else {
            return (indexesOfCorrelatedRowsSecondSheetIndexes.includes(dataRowIndex)) && (matchType !== 3) && (matchType !== 1);
        }
    }

    const noColumnsInSelectMenu = () => {
        return showInSelectMenuColumnsCurrentSheet.findIndex((item) => (!item)) !== -1;
    }

    const notAllColumnsInOutputSheet = () => {
        return outputSheetExportColumns.filter((_, i) => {
            if(sheetIndex === 0) {
                return i <= secondSheetColumnsNames.length;
            }
            else {
                return i > secondSheetColumnsNames.length;
            }
        }).findIndex((item) => (!item)) !== -1;
    }

    return <div className="sheetWrapper" ref={ref}>
        {autoMatchModalVisible ? <AutoMatchModal dataSheetColumns={sheetIndex === 0 ? columnsNames : secondSheetColumnsNames}
                                                 relationSheetColumns={sheetIndex === 0 ? secondSheetColumnsNames : columnsNames}
                                                 columnsVisibility={currentSheetColumnsVisibility}
                                                 user={user}
                                                 closeModal={() => { setAutoMatchModalVisible(false); }} /> : ''}

        {columnsSettingsModalVisible ? <ColumnsSettingsModal closeModal={() => { setColumnsSettingsModalVisible(0); }}
                                                             columnsNames={columnsNames}
                                                             extraIndex={columnsSettingsModalVisible === 2 && sheetIndex === 1 ? secondSheetColumnsNames.length : (columnsSettingsModalVisible === 2 ? 1 : 0)}
                                                             hideFirstColumn={false}
                                                             columns={getColumnsForModal(columnsSettingsModalVisible)}
                                                             setColumns={getSetColumnsForModal(columnsSettingsModalVisible)}
                                                             header={getSettingsModalHeader(columnsSettingsModalVisible)} /> : ''}

        {cellsFormatModalVisible ? <CellsFormatModal cellsHeight={cellsHeight}
                                                     setCellsHeight={setCellsHeight}
                                                     closeModal={() => { setCellsFormatModalVisible(false); }} /> : ''}

        {showFullCellValue ? <FullValueModal value={showFullCellValue}
                                             indexes={fullCellValueSubstringsIndexes}
                                             closeModal={() => { setShowFullCellValue(''); }}  /> : ''}

        {overrideMatchModalVisible ? <OverrideMatchModal closeModal={() => { setOverrideMatchModalVisible(false); }}
                                                         doOverride={() => { addManualCorrelation(dataRowIndexForManualCorrelation,
                                                             relationRowIndexForManualCorrelation) }} /> : ''}

        {deleteMatchesModalVisible ? <DeleteMatchesModal closeModal={() => { setDeleteMatchesModalVisible(false); }} /> : ''}

        <div className="flex flex--w flex--relationButtons">
            <div className="flex">
                <MatchTypeSelect />
            </div>

            <ButtonAutoMatch onClick={() => { setAutoMatchModalVisible(true); }}>
                {content.autoMatchButton}
            </ButtonAutoMatch>
        </div>

        {isShowInSelectMenuFromSecondSheetEmpty() ? <span className="disclaimer">
            <span>
                {content.noColumnsInSelectMenuAlert}
            </span>
        </span> : ''}

        {selectList?.length && !selectListLoading ? <div className="sheetInner">
            {/* LEFT SIDEBAR WITH BUTTONS */}
            <div className="sheetInner__left">
                <div className="sheet__table__info sheet__table__info--data1">
                    <div className="cell--legend">
                        {content.visibility}

                        <div className="center">
                            <IconButtonWithTooltip title={content.configureInWindow}
                                                   onClick={() => { setColumnsSettingsModalVisible(3); }}
                                                   img={configureInWindowIcon} />

                            <IconButtonWithTooltip title={content.formatCellsVisibility}
                                                   onClick={() => { setCellsFormatModalVisible(true); }}
                                                   img={formatCellsIcon} />
                        </div>
                    </div>
                </div>

                <div className="sheet__table__info sheet__table__info--data1">
                    <div className="cell--legend">
                        {content.showInSelectMenu}

                        <div className="center">
                            {noColumnsInSelectMenu() ? <IconButtonWithTooltip title={content.checkAll}
                                                                              onClick={() => { handleSelectMenuColumnsChange(-1); }}
                                                                              img={checkAllIcon} /> : <IconButtonWithTooltip title={content.uncheckAll}
                                                                                                                             onClick={() => { handleSelectMenuColumnsChange(-2); }}
                                                                                                                             img={uncheckAllIcon} />}

                            <IconButtonWithTooltip title={content.configureInWindow}
                                                   onClick={() => { setColumnsSettingsModalVisible(1); }}
                                                   img={configureInWindowIcon} />
                        </div>
                    </div>
                </div>

                <div className="sheet__table__info sheet__table__info--data2">
                    <div className="cell--legend">
                        {content.includeInExport}

                        <div className="center">
                            {notAllColumnsInOutputSheet() ? <IconButtonWithTooltip title={content.checkAll}
                                                                                   onClick={() => { handleExportColumnsChange(-1); }}
                                                                                   img={checkAllIcon} /> : <IconButtonWithTooltip title={content.uncheckAll}
                                                                                                                                  onClick={() => { handleExportColumnsChange(-2); }}
                                                                                                                                  img={uncheckAllIcon} />}

                            <IconButtonWithTooltip title={content.configureInWindow}
                                                   onClick={() => { setColumnsSettingsModalVisible(2); }}
                                                   img={configureInWindowIcon} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTUAL TABLE */}
            <div className="sheet scroll"
                 onScroll={checkScrollToBottom}>

                {isRelationColumnSelectAvailable() ? <RelationColumnSelect n={numberOfRelationColumns}
                                                                           addRelationColumn={() => { setNumberOfRelationColumns(p => p+1); }}
                                                                           selectOption={currentRelationColumnVisible}
                                                                           setSelectOption={setCurrentRelationColumnVisible} /> : ''}

                <div className="sheet__stickyRows">
                    <div className="line line--noFlex line--columnsToCheck">
                        {currentSheetColumnsVisibility.map((item, index) => {
                            return <div className={index === 0 ? "check__cell check__cell--first check__cell--borderBottom" : "check__cell check__cell--borderBottom"}
                                        style={columnWithMinWidth()}
                                        key={index}>
                                <button className={currentSheetColumnsVisibility[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                        onClick={() => { handleExportColumnsChange(index); /* TODO */ }}>

                                </button>
                            </div>
                        })}
                    </div>

                    <div className="line line--noFlex line--columnsToCheck">
                        {showInSelectMenuColumnsCurrentSheet.map((item, index) => {
                            if(currentSheetColumnsVisibility[index]) {
                                return <div className={index === 0 ? "check__cell check__cell--first check__cell--borderBottom" : "check__cell check__cell--borderBottom"}
                                            style={columnWithMinWidth()}
                                            key={index}>
                                    <button className={showInSelectMenuColumnsCurrentSheet[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                            onClick={() => { handleSelectMenuColumnsChange(index); }}>

                                    </button>
                                </div>
                            }
                        })}
                    </div>

                    <div className="line line--noFlex line--columnsToCheck">
                        {outputSheetExportColumns.map((item, index) => {
                            if(outputSheetExportColumnsVisibilityCondition(index)) {
                                if(outputSheetExportColumnsVisibilityFirstColumnCondition(index)) {
                                    return <div className="check__cell check__cell--first"
                                                style={columnWithMinWidth()}
                                                key={index}>
                                        <button className="btn btn--check btn--notVisible"
                                                disabled={true}>

                                        </button>
                                    </div>
                                }
                                else {
                                    return <div className="check__cell"
                                                style={columnWithMinWidth()}
                                                key={index}>
                                        <button className={outputSheetExportColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                                onClick={() => { handleExportColumnsChange(index); }}>

                                        </button>
                                    </div>
                                }
                            }
                        })}
                    </div>

                    <div className="sheet__table">
                        <div className="line line--noFlex">
                            <TableViewHeaderRow columnsNames={columnsNames}
                                                columnsVisibility={currentSheetColumnsVisibility}
                                                columnsSorting={columnsSorting}
                                                getColumnMinWidth={getColumnMinWidth}
                                                sortSheet={sortSheet}
                                                removeSorting={removeSorting} />
                        </div>
                    </div>
                </div>

                <TableViewHeaderRowRelationColumn relationColumnSort={relationColumnSort}
                                                  sheetIndex={sheetIndex}
                                                  setDeleteMatchesModalVisible={setDeleteMatchesModalVisible}
                                                  sortRelationColumnByMatch={sortRelationColumnByMatch} />


                {rowsToRender.map((item, index) => {
                    let currentSheetRowIndex = index;
                    let correlatedRow = null;
                    let substringIndexes = [];
                    const currentSelectList = selectList[indexesInRender[index]];
                    const currentIndexesOfCorrelatedRows = indexesOfCorrelatedRowsLevels[currentRelationColumnVisible];

                    if(currentSelectList?.length && currentIndexesOfCorrelatedRows?.length) {
                        if(sheetIndex === 0) {
                            const pair = currentIndexesOfCorrelatedRows.find((item) => (item[0] === index));

                            if(pair) {
                                correlatedRow = currentSelectList.find((item) => (item.relationRowIndex === pair[1]));
                            }
                        }
                        else {
                            const pair = currentIndexesOfCorrelatedRows.find((item) => (item[1] === index));

                            if(pair) {
                                correlatedRow = currentSelectList.find((item) => (item.dataRowIndex === pair[0]));
                            }
                        }
                    }

                    let isCorrelatedRowWithHighestSimilarity = false;
                    let correlatedRowValue = '-';
                    let joinStringOfColumnsFromCurrentSheet = '';
                    let colorLettersActive = false;
                    let correlatedRowValueToDisplay = '';

                    if(correlatedRow) {
                        isCorrelatedRowWithHighestSimilarity = ((correlatedRow.similarity === currentSelectList[0]?.similarity)
                            || (manuallyCorrelatedRowsIndexes.includes(indexesInRender[index])));

                        correlatedRowValue = Object.entries(secondSheet[sheetIndex === 0 ? correlatedRow.relationRowIndex : correlatedRow.dataRowIndex])
                            .filter((_, index) => (showInSelectMenuColumnsSecondSheet[index]))
                            .map((item) => (item[1]))
                            .join(' - ');

                        correlatedRowValueToDisplay = correlatedRowValue.length <= 50 ?
                            correlatedRowValue : `${correlatedRowValue.substring(0, 50)}...`;
                    }

                    if(markLettersRows.includes(index)) {
                        const columnsNamesInConditions = priorities.map((item) => (item.conditions.map((item) =>
                            (sheetIndex === 0 ? item.relationSheet : item.dataSheet))))
                            .flat();
                        const columnsNamesInSelectMenu = Object.entries(secondSheet[0])
                            .filter((_, index) => (showInSelectMenuColumnsSecondSheet[index]))
                            .map((item) => (item[0]));

                        joinStringOfColumnsFromCurrentSheet = priorities.map((item) => {
                            return item.conditions.map((item) => {
                                return sheetIndex === 0 ? item.dataSheet : item.relationSheet;
                            });
                        })
                            .flat()
                            .map((item, i) => {
                                return currentSheet[index][item];
                            })
                            .join(' ');

                        if(correlatedRowValueToDisplay && checkCommonElement(columnsNamesInConditions, columnsNamesInSelectMenu)) {
                            colorLettersActive = true;
                            substringIndexes = findSubstrings(joinStringOfColumnsFromCurrentSheet, correlatedRowValueToDisplay);
                        }
                    }

                    return <div className="line line--tableRow"
                                key={index}>
                        {/* Relation sheet columns */}
                        {Object.entries(item).map((item, index) => {
                            const cellValue = item[1];

                            if(currentSheetColumnsVisibility[index]) {
                                return <div className={index === 0 ? "sheet__body__row__cell sheet__body__row__cell--first" : "sheet__body__row__cell"}
                                            style={{
                                                minWidth: getColumnMinWidth(),
                                                maxHeight: getColumnMaxHeight()
                                            }}
                                            key={index}>
                                    <SheetCell>{cellValue}</SheetCell>
                                </div>
                            }
                        })}

                        {/* Column with relation selection */}
                        <div className="sheet__body__row__cell sheet__body__row__cell--relation">
                            {currentSelectList?.length ? <>
                                <button className="select__btn"
                                        onClick={(e) => { showRelationSelectionDropdown(e, index); }}>

                                    {showSelectMenu !== indexesInRender[index] ? <span className="select__menu__item"
                                                                                       key={index}>
                                {correlatedRow ? <>
                                    <span className="select__menu__item__value">
                                        {correlatedRowValueToDisplay.length === correlatedRowValue.length ?
                                            <ColorMarkedText string={correlatedRowValueToDisplay}
                                                             indexes={substringIndexes} /> : <>
                                                <ColorMarkedText string={correlatedRowValueToDisplay}
                                                                 indexes={substringIndexes} />

                                                <button className="btn btn--showFullValue"
                                                        onClick={(e) => { showFullRow(e, correlatedRowValue, joinStringOfColumnsFromCurrentSheet); }}>
                                                    ({content.showAll})
                                                </button>
                                            </>}
                                    </span>
                                    <span className="select__menu__item__similarity" style={{
                                        background: getSimilarityColorForRelationSheet(correlatedRow.similarity, sheetIndex === 0 ? correlatedRow.dataRowIndex : correlatedRow.relationRowIndex),
                                        color: manuallyCorrelatedRowsIndexes.includes(sheetIndex === 0 ? correlatedRow.dataRowIndex : correlatedRow.relationRowIndex) || schemaCorrelatedRowsIndexes.includes(sheetIndex === 0 ? correlatedRow.dataRowIndex : correlatedRow.relationRowIndex) ? '#fff' : '#000'
                                    }}>
                                        {!isCorrelatedRowWithHighestSimilarity && !manuallyCorrelatedRowsIndexes.includes(sheetIndex === 0 ? correlatedRow.dataRowIndex : correlatedRow.relationRowIndex) ? <Tooltip title={content.rowWithLargerMatchAlert}
                                                                                                                                                                                                                     followCursor={true}
                                                                                                                                                                                                                     size="small"
                                                                                                                                                                                                                     position="top">
                                            <span className="select__menu__item__similarity__info">
                                                !
                                            </span>
                                        </Tooltip> : ''}

                                        {correlatedRow.similarity >= 0 ? `${correlatedRow.similarity} %` : (schemaCorrelatedRowsIndexes.includes(sheetIndex === 0 ? correlatedRow.dataRowIndex : correlatedRow.relationRowIndex) ? 'S' : '-')}
                                    </span>
                                </> : <RelationSelectionEmptyRow />}
                            </span> : <input className="select__input"
                                             value={searchInputValue}
                                             onChange={(e) => { setSearchInputValue(e.target.value); }} />}

                                    <img className="select__btn__img"
                                         src={arrowDown}
                                         alt="arrow-down" />
                                </button>

                                <Tooltip title={markLettersRows.includes(index) ? content.turnOffColorOnStrings : content.turnOnColorOnStrings}
                                         followCursor={true}
                                         size="small"
                                         position="top">
                                    <button className={markLettersRows.includes(index) ? "btn btn--markLetters btn--markLetters--selected" : "btn btn--markLetters"}
                                            onClick={() => { markLetters(index); }}>
                                        Aa
                                    </button>
                                </Tooltip>

                                {correlatedRow ? <button className="btn btn--removeCorrelation"
                                                         onClick={() => { removeCorrelation(correlatedRow.dataRowIndex, correlatedRow.relationRowIndex); }}>
                                    &times;
                                </button> : ''}
                            </> : ''}

                            {/* Dropdown menu */}
                            {showSelectMenu === indexesInRender[index] ? <div className="select__menu scroll"
                                                                              onScroll={checkListScrollToBottom}>
                                {currentSelectMenuToDisplay?.map((item, index) => {
                                    const value = Object.entries(secondSheet[sheetIndex === 0 ? item.relationRowIndex : item.dataRowIndex])
                                        .filter((_, index) => (showInSelectMenuColumnsSecondSheet[index]))
                                        .map((item) => (item[1]))
                                        .join(' - ');

                                    const currentSelectMenuItemIndex = sheetIndex === 0 ? item.relationRowIndex : item.dataRowIndex;

                                    const numberOfMatches = sheetIndex === 0 ? indexesOfCorrelatedRows.filter((item) => {
                                        return item[1] === currentSelectMenuItemIndex;
                                    }).length : indexesOfCorrelatedRows.filter((item) => {
                                        return item[0] === currentSelectMenuItemIndex;
                                    }).length;

                                    const valueToDisplay = value.length <= 50 ? value : `${value.substring(0, 50)}...`;
                                    let substringIndexes = [];

                                    if(colorLettersActive || markLettersRows.includes(currentSheetRowIndex)) {
                                        substringIndexes = findSubstrings(joinStringOfColumnsFromCurrentSheet, valueToDisplay);
                                    }

                                    return <button className={isDropdownMenuItemDisabled(item.dataRowIndex, item.relationRowIndex) ? "select__menu__item select__menu__item--disabled" : "select__menu__item"}
                                                   onClick={(e) => {addManualCorrelationWrapper(e, item); }}
                                                   key={index}>
                                    <span className="select__menu__item__value">
                                        {valueToDisplay.length === value.length ? <ColorMarkedText string={value}
                                                                                                   indexes={substringIndexes} /> : <>
                                            <ColorMarkedText string={valueToDisplay}
                                                             indexes={substringIndexes} />
                                            <button className="btn btn--showFullValue"
                                                    onClick={(e) => { showFullRow(e, value, joinStringOfColumnsFromCurrentSheet); }}>
                                                ({content.showAll})
                                            </button>
                                        </>}
                                    </span>
                                        <span className="select__menu__item__similarity" style={{
                                            background: getSimilarityColorForRelationSheet(item.similarity, -1)
                                        }}>
                                        {printSimilarityPercentage(item.similarity)}
                                    </span>
                                        <span className="select__menu__item__counter">
                                        {numberOfMatches}
                                    </span>
                                    </button>
                                })}
                            </div> : ''}
                        </div>
                    </div>
                })}
            </div>
        </div> : <div className="sheet__loader">
            <Loader />
        </div>}
    </div>
});

export default RelationSheetView;
