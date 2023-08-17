import React, {useContext, useEffect, useState, forwardRef, useRef, useMemo} from 'react';
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
import OverrideMatchModal from "./OverrideMatchModal";
import DeleteMatchesModal from "./DeleteMatchesModal";
import MatchTypeSelect from "./MatchTypeSelect";
import {getSchemaById} from "../api/schemas";
import useCloseDropdownSelectMenu from "../hooks/useCloseDropdownSelectMenu";
import getLevelsOfRelationColumn from "../helpers/getLevelsOfRelationColumn";
import {TranslationContext} from "../App";
import checkAllIcon from '../static/img/select-all.svg';
import uncheckAllIcon from '../static/img/unselect-all.svg';
import configureInWindowIcon from '../static/img/configure-in-window.svg';
import formatCellsIcon from '../static/img/format-cells.svg';
import checkIcon from '../static/img/check.svg';
import IconButtonWithTooltip from "./IconButtonWithTooltip";
import areArraysEqual from "../helpers/areArraysEqual";
import SelectMenuSettingsModal from "./SelectMenuSettingsModal";

const RelationSheetView = forwardRef(({sheetIndex, currentSheet, secondSheet,
                               showInSelectMenuColumnsSecondSheet,
                               currentSheetColumnsVisibility, setCurrentSheetColumnsVisibility,
                               showInSelectMenuColumnsCurrentSheet, setShowInSelectMenuColumnsCurrentSheet,
                               selectList, selectListLoading, selectListIndicators,
                               manuallyCorrelatedRowsIndexes, schemaCorrelatedRowsIndexes,
                               indexesOfCorrelatedRowsIndexes, indexesOfCorrelatedRowsSecondSheetIndexes, user}, ref) => {
    const { content } = useContext(TranslationContext);
    const { currentSchemaId } = useContext(AppContext);
    const { outputSheetExportColumns, setOutputSheetExportColumns, priorities, setManuallyCorrelatedRows,
        addManualCorrelation, setIndexesOfCorrelatedRows, indexesOfCorrelatedRows, matchType } = useContext(ViewContext);

    const [page, setPage] = useState(1);
    const [currentSheetSorted, setCurrentSheetSorted] = useState([]);
    const [currentSheetFiltered, setCurrentSheetFiltered] = useState([]);
    const [rowsToRender, setRowsToRender] = useState([]);
    const [secondSheetColumnsNames, setSecondSheetColumnsNames] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);
    const [autoMatchModalVisible, setAutoMatchModalVisible] = useState(false);
    const [currentSelectMenu, setCurrentSelectMenu] = useState([]);
    const [currentSelectMenuToDisplay, setCurrentSelectMenuToDisplay] = useState([]);
    const [currentSelectMenuFiltered, setCurrentSelectMenuFiltered] = useState([]);
    const [showSelectMenuRelation, setShowSelectMenuRelation] = useState(-1);
    const [showSelectMenu, setShowSelectMenu] = useState(-1);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [columnsSettingsModalVisible, setColumnsSettingsModalVisible] = useState(0);
    const [minColumnWidth, setMinColumnWidth] = useState(0);
    const [columnsSorting, setColumnsSorting] = useState([]);
    const [relationColumnSort, setRelationColumnSort] = useState(0);
    const [indexesInRender, setIndexesInRender] = useState([]);
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
    const [temporaryColumnsVisibility, setTemporaryColumnsVisibility] = useState([]);
    const [columnsVisibilityReadyToChange, setColumnsVisibilityReadyToChange] = useState(false);
    const [searchInputValues, setSearchInputValues] = useState([]);
    const [searchChanged, setSearchChanged] = useState(false);
    const [refreshSheetFiltering, setRefreshSheetFiltering] = useState(false);
    const [zIndex, setZIndex] = useState(1001);
    const [rowsToRenderHeights, setRowsToRenderHeights] = useState([]);
    const [showDisclaimerAboutEmptySelectList, setShowDisclaimerAboutEmptySelectList] = useState(false);

    const rowsToRenderRefs = useMemo(() => {
        return Array.from({length: rowsToRender?.length || 1}).map(() => (React.createRef()));
    }, [rowsToRender]);
    let selectInput = useRef(null);
    let leftScrollBox = useRef(null);
    let rightScrollBox = useRef(null);

    useCloseDropdownSelectMenu(showFullCellValue, setShowSelectMenu, setShowSelectMenuRelation);

    useEffect(() => {
        if(columnsNames) {
            setSearchInputValues(columnsNames.map(() => ('')));
        }
    }, [columnsNames]);

    useEffect(() => {
        setIndexesOfCorrelatedRowsLevels(getLevelsOfRelationColumn(indexesOfCorrelatedRows, sheetIndex));
    }, [indexesOfCorrelatedRows]);

    useEffect(() => {
        if(columnsVisibilityReadyToChange && columnsSettingsModalVisible === 0) {
            setColumnsVisibilityReadyToChange(false);
            setCurrentSheetColumnsVisibility(temporaryColumnsVisibility);
        }
    }, [columnsVisibilityReadyToChange, columnsSettingsModalVisible]);

    useEffect(() => {
        if(indexesOfCorrelatedRowsLevels) {
            setNumberOfRelationColumns(Math.max(1, indexesOfCorrelatedRowsLevels.length + 1));
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
        setCurrentSheetFiltered(currentSheet);
        setCurrentSheetSorted(currentSheet);
    }, [currentSheet]);

    useEffect(() => {
        if(currentSheetFiltered?.length || searchChanged) {
            setRowsToRender(currentSheetFiltered.slice(0, ROWS_PER_PAGE));

            // Change map
            setIndexesInRender(currentSheetFiltered.map((item) => {
                return currentSheet.indexOf(item);
            }));
        }
    }, [currentSheetFiltered]);

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

            if(selectInput?.current) {
                selectInput.current.focus();
            }
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
                                let columnsVisibilityFromDatabase;

                                if(sheetIndex === 0) {
                                    columnsVisibilityFromDatabase = JSON.parse(res.data.columns_settings_object).dataSheetColumnsVisibility;
                                }
                                else {
                                    columnsVisibilityFromDatabase = JSON.parse(res.data.columns_settings_object).relationSheetColumnsVisibility;
                                }

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
            setTemporaryColumnsVisibility(currentSheetColumnsVisibility);
            setMinColumnWidth(125 / (currentSheetColumnsVisibility.filter((item) => (item)).length));
        }
    }, [currentSheetColumnsVisibility]);

    const handleSelectMenuColumnsChange = (i) => {
        if(i === -2) {
            setShowInSelectMenuColumnsCurrentSheet(prevState => (prevState.map((item, index) => {
                if(currentSheetColumnsVisibility[index]) {
                    return 0;
                }
                else {
                    return item;
                }
            })));
        }
        else if(i === -1) {
            setShowInSelectMenuColumnsCurrentSheet(prevState => (prevState.map((item, index) => {
                if(currentSheetColumnsVisibility[index]) {
                    return 1;
                }
                else {
                    return item;
                }
            })));
        }
        else {
            setShowInSelectMenuColumnsCurrentSheet(prevState => ([...prevState.map((item, index) => {
                return index === i ? !item : item;
            })]));
        }
    }

    const setDefaultColumnsVisibility = () => {
        setCurrentSheetColumnsVisibility(columnsNames.map(() => true));
    }

    const handleExportColumnsChange = (i) => {
        const getCondition = (i) => {
            if(sheetIndex === 0) {
                return i < columnsNames?.length;
            }
            else {
                return i >= secondSheetColumnsNames?.length;
            }
        }

        if(i === -2) {
            if(sheetIndex === 0) {
                setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                    return getCondition(index) && currentSheetColumnsVisibility[index] ? 0 : item;
                })));
            }
            else {
                setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                    return getCondition(index) && currentSheetColumnsVisibility[index - columnsNames?.length] ? 0 : item;
                })));
            }
        }
        else if(i === -1) {
            if(sheetIndex === 0) {
                setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                    return getCondition(index) && currentSheetColumnsVisibility[index] ? 1 : item;
                })));
            }
            else {
                setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                    return getCondition(index) && currentSheetColumnsVisibility[index - columnsNames?.length] ? 1 : item;
                })));
            }
        }
        else {
            setOutputSheetExportColumns(prevState => (prevState.map((item, index) => {
                return index === i ? !item : item;
            })));
        }
    }

    const handleTemporaryColumnsVisibilityChange = (i) => {
        setTemporaryColumnsVisibility(prevState => {
            return prevState.map((item, index) => {
                if(index === i) {
                    return !item;
                }
                else {
                    return item;
                }
            });
        });
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
        // Sorting and filtering changed - fetch next rows from start
        setRowsToRender([...currentSheetFiltered.slice(0, 20)]);
        setPage(1);
    }, [currentSheetFiltered]);

    const fetchNextRows = () => {
        setRowsToRender(prevState => {
            return [...prevState, ...currentSheetFiltered.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)];
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
        scrollBothBoxes(leftScrollBox.current.scrollTop);

        const { visibleHeight, scrollHeight, scrolled } = getScrollParams(e);

        if(scrolled + visibleHeight + 3 >= scrollHeight) {
            if((page) * ROWS_PER_PAGE < currentSheetSorted.length) {
                fetchNextRows();
            }
        }
    }

    const handleRightBoxScroll = (e) => {
        scrollBothBoxes(rightScrollBox.current.scrollTop);
    }

    const scrollBothBoxes = (scrollTop) => {
        leftScrollBox.current.scrollTop = scrollTop;
        rightScrollBox.current.scrollTop = scrollTop;
    }

    const checkListScrollToBottom = (e) => {
        const { visibleHeight, scrollHeight, scrolled } = getScrollParams(e);

        if(scrolled + visibleHeight + 3 >= scrollHeight) {
            if((currentListPage) * ROWS_PER_PAGE < currentSelectMenuFiltered.length) {
                fetchNextRowsForSelectMenu();
            }
        }
    }

    const changeZIndex = (relationIndex, rowIndex) => {
        const allCells = Array.from(document.querySelectorAll(`.sheet__body__row__cell--relation--${relationIndex}`));

        if(allCells[rowIndex]) {
            allCells[rowIndex].style.zIndex = zIndex;
            setZIndex(p => p+1);
        }
    }

    useEffect(() => {
        setSearchChanged(true);

        // Filtrowanie
        setCurrentSheetFiltered(currentSheet.filter((item) => {
            const columnsValues = Object.values(item);

            return columnsValues.filter((item, index) => {
                return item.toLowerCase().includes(searchInputValues[index]);
            }).length === columnsValues.length;
        }));
    }, [searchInputValues, refreshSheetFiltering]);

    const sortSheet = (col, i) => {
        setRelationColumnSort(0);

        const { newSorting, sortType } = getColumnsSortingAndSortType(i, columnsSorting);
        col = convertColumnToNumber(col);

        setColumnsSorting(newSorting);
        setCurrentSheetFiltered(sortByColumn(currentSheetFiltered, col, sortType));
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

        setRefreshSheetFiltering(p => !p);
        setCurrentSheetFiltered(currentSheet);
    }

    const sortRelationColumnByMatch = (type) => {
        setColumnsSorting(prevState => (prevState.map(() => (0))));
        setRelationColumnSort(prevState => (prevState === type ? 0 : type));
    }

    useEffect(() => {
        if(currentSheetFiltered?.length) {
            setCurrentSheetFiltered(sortRelationColumn(currentSheet, indexesOfCorrelatedRows, relationColumnSort, sheetIndex));
        }
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
        setManuallyCorrelatedRows(prevState => {
            return prevState.filter((item) => {
                return item[0] !== dataRowIndex || item[1] !== relationRowIndex;
            });
        });
    }

    const getColumnMaxHeight = () => {
        return cellsHeight !== -1 ? `${cellsHeight}px` : 'unset';
    }

    const getColumnMinWidth = () => {
        const numberOfColumns = getNumberOfVisibleColumns();

        if(numberOfColumns === 1) {
            return 'calc(100% - 400px)';
        }
        else if(numberOfColumns === 2) {
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

    const showRelationSelectionDropdown = (e, relationIndex, rowIndex) => {
        e.stopPropagation();
        e.preventDefault();
        changeZIndex(relationIndex, indexesInRender.indexOf(rowIndex));

        setShowSelectMenuRelation(prevState => (prevState === relationIndex ? prevState : relationIndex));
        setShowSelectMenu(prevState => (prevState === rowIndex ? prevState : rowIndex));
    }

    const showFullRow = (e, value, joinString) => {
        e.stopPropagation();
        setFullCellValueSubstringsIndexes(findSubstrings(joinString, value))
        setShowFullCellValue(value);
    }

    const printSimilarityPercentage = (similarity) => {
        return similarity >= 0 ? `${similarity} %` : '-';
    }

    useEffect(() => {
        if(currentSheetColumnsVisibility?.length && getNumberOfVisibleColumns() === 0) {
            setCurrentSheetColumnsVisibility(prevState => {
                return prevState.map((item, index) => {
                    return index === 0;
                });
            });
        }
    }, [currentSheetColumnsVisibility]);

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
                return outputSheetExportColumns.slice(0, columnsNames.length+1);
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

    useEffect(() => {
        setShowDisclaimerAboutEmptySelectList(showInSelectMenuColumnsSecondSheet.findIndex((item) => (item)) === -1);
    }, [showInSelectMenuColumnsSecondSheet]);

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

    const noAllVisibleColumnsInSelectMenu = () => {
        return showInSelectMenuColumnsCurrentSheet.findIndex((item, index) => {
            if(!currentSheetColumnsVisibility[index]) {
                return false;
            }
            else {
                return !item;
            }
        }) !== -1;
    }

    const noColumnsInSelectMenu = () => {
        return showInSelectMenuColumnsCurrentSheet.findIndex((item) => (item)) === -1;
    }

    const noAllVisibleColumnsInOutputSheet = () => {
        return outputSheetExportColumns.filter((_, i) => {
            if(sheetIndex === 0) {
                return i < currentSheetColumnsVisibility.length;
            }
            else {
                return i >= secondSheetColumnsNames.length;
            }
        }).findIndex((item, index) => {
            if(!currentSheetColumnsVisibility[index]) {
                return false;
            }
            else {
                return !item;
            }
        }) !== -1;
    }

    const confirmColumnsVisibilityChange = () => {
        if(noColumnsInSelectMenu()) {
            setColumnsVisibilityReadyToChange(true);
            setColumnsSettingsModalVisible(1);
        }
        else {
            setCurrentSheetColumnsVisibility(temporaryColumnsVisibility);
        }
    }

    const getNumberOfVisibleColumns = () => {
        return currentSheetColumnsVisibility.filter((item) => (item)).length;
    }

    const isLargerMatchAlertVisible = (isCorrelatedRowWithHighestSimilarity, correlatedRow) => {
        return !isCorrelatedRowWithHighestSimilarity && !manuallyCorrelatedRowsIndexes.includes(sheetIndex === 0 ? correlatedRow.dataRowIndex : correlatedRow.relationRowIndex);
    }

    useEffect(() => {
        if(isRelationColumnSelectAvailable() && numberOfRelationColumns === 1) {
            setNumberOfRelationColumns(2);
        }
    }, [matchType]);

    useEffect(() => {
        if(cellsHeight !== -1) {
            setRowsToRenderHeights(rowsToRenderRefs.map(() => {
                return cellsHeight;
            }));

            rowsToRenderRefs.forEach((item) => {
                item.current.style.maxHeight = `${cellsHeight}px`;
                item.current.style.minHeight = `${cellsHeight}px`;
            });
        }
        else if(rowsToRenderRefs?.length) {
            let heights = rowsToRenderRefs.map((item) => {
                const height = item?.current?.clientHeight;

                if(height) {
                    item.current.style.minHeight = `${height}px`;
                    item.current.style.maxHeight = `${height}px`;
                }
                else {
                    return 50;
                }

                return item?.current?.clientHeight;
            });

            setRowsToRenderHeights(heights);
        }
    }, [rowsToRenderRefs, cellsHeight]);

    const removeRelationColumn = () => {

    }

    return <div className="sheetWrapper" ref={ref}>
        {autoMatchModalVisible ? <AutoMatchModal dataSheetColumns={sheetIndex === 0 ? columnsNames : secondSheetColumnsNames}
                                                 relationSheetColumns={sheetIndex === 0 ? secondSheetColumnsNames : columnsNames}
                                                 columnsVisibility={currentSheetColumnsVisibility}
                                                 user={user}
                                                 closeModal={() => { setAutoMatchModalVisible(false); }} /> : ''}

        {columnsSettingsModalVisible > 1 ? <ColumnsSettingsModal closeModal={() => { setColumnsSettingsModalVisible(0); }}
                                                             columnsNames={columnsNames}
                                                             extraIndex={columnsSettingsModalVisible === 2 && sheetIndex === 1 ? secondSheetColumnsNames.length : 0}
                                                             hideFirstColumn={false}
                                                             columns={getColumnsForModal(columnsSettingsModalVisible)}
                                                             setColumns={getSetColumnsForModal(columnsSettingsModalVisible)}
                                                             header={getSettingsModalHeader(columnsSettingsModalVisible)} /> : ''}

        {columnsSettingsModalVisible === 1 ? <SelectMenuSettingsModal closeModal={() => { setColumnsSettingsModalVisible(0); }}
                                                                      columnsNames={columnsNames}
                                                                      warning={noColumnsInSelectMenu()}
                                                                      visibleColumns={currentSheetColumnsVisibility}
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

        {selectList?.length && !selectListLoading ? <div className="sheetInner">
            {/*{isRelationColumnSelectAvailable() ? <button className="btn btn--addRelationColumn"*/}
            {/*                                             onClick={() => { setNumberOfRelationColumns(p => p+1); }}>*/}
            {/*    +*/}
            {/*</button> : ''}*/}

            {/*{isRelationColumnSelectAvailable() && numberOfRelationColumns > 1 ? <button className="btn btn--addRelationColumn btn--addRelationColumn--remove"*/}
            {/*                                                                            onClick={() => { setNumberOfRelationColumns(p => p-1); }}>*/}
            {/*    -*/}
            {/*</button> : ''}*/}

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

                            {!areArraysEqual(currentSheetColumnsVisibility, temporaryColumnsVisibility) ? <IconButtonWithTooltip title={content.use}
                                                                                                                                 onClick={confirmColumnsVisibilityChange}
                                                                                                                                 img={checkIcon} /> : ''}
                        </div>
                    </div>
                </div>

                <div className="sheet__table__info sheet__table__info--data1">
                    <div className="cell--legend">
                        {content.showInSelectMenu}

                        <div className="center">
                            {noAllVisibleColumnsInSelectMenu() ? <IconButtonWithTooltip title={content.checkAll}
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
                            {noAllVisibleColumnsInOutputSheet() ? <IconButtonWithTooltip title={content.checkAll}
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
            <div className="sheet sheetRelation">

                {/* Normal columns */}
                <div className={isRelationColumnSelectAvailable() ? "sheet__main sheet__main--manyRelation scroll scrollbar-hidden" : "sheet__main scroll scrollbar-hidden"}
                     ref={leftScrollBox}
                     onScroll={checkScrollToBottom}>
                    <div className="sheet__stickyRows">
                        <div className="line line--noFlex line--columnsToCheck">
                            {temporaryColumnsVisibility.map((item, index) => {
                                if(currentSheetColumnsVisibility[index]) {
                                    return <div className={index === 0 && getNumberOfVisibleColumns() > 1 ? "check__cell check__cell--first check__cell--borderBottom" : "check__cell check__cell--borderBottom"}
                                                style={{
                                                    minWidth: getColumnMinWidth()
                                                }}
                                                key={index}>
                                        <button className={temporaryColumnsVisibility[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                                onClick={() => { handleTemporaryColumnsVisibilityChange(index); }}>

                                        </button>
                                    </div>
                                }
                            })}
                        </div>

                        <div className="line line--noFlex line--columnsToCheck">
                            {showInSelectMenuColumnsCurrentSheet.map((item, index) => {
                                if(currentSheetColumnsVisibility[index]) {
                                    return <div className={index === 0 && getNumberOfVisibleColumns() > 1 ? "check__cell check__cell--first check__cell--borderBottom" : "check__cell check__cell--borderBottom"}
                                                style={{
                                                    minWidth: getColumnMinWidth()
                                                }}
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
                                    if(outputSheetExportColumnsVisibilityFirstColumnCondition(index) && getNumberOfVisibleColumns() > 1) {
                                        return <div className="check__cell check__cell--first"
                                                    style={{
                                                        minWidth: getColumnMinWidth()
                                                    }}
                                                    key={index}>
                                            <button className={outputSheetExportColumns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                                    onClick={() => { handleExportColumnsChange(index); }}>

                                            </button>
                                        </div>
                                    }
                                    else {
                                        return <div className="check__cell"
                                                    style={{
                                                        minWidth: getColumnMinWidth()
                                                    }}
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
                                                    searchInputValues={searchInputValues}
                                                    setSearchInputValues={setSearchInputValues}
                                                    getColumnMinWidth={getColumnMinWidth}
                                                    sortSheet={sortSheet}
                                                    removeSorting={removeSorting} />
                            </div>
                        </div>
                    </div>

                    {rowsToRender.map((item, index) => {
                        return <div className="line line--tableRow"
                                    ref={rowsToRenderRefs[index]}
                                    key={index}>
                            {/* Normal sheet columns */}
                            {Object.entries(item).map((item, index) => {
                                const cellValue = item[1];

                                if(currentSheetColumnsVisibility[index]) {
                                    return <div className={index === 0 && getNumberOfVisibleColumns() > 1 ? "sheet__body__row__cell sheet__body__row__cell--first" : "sheet__body__row__cell"}
                                                style={{
                                                    minWidth: getColumnMinWidth(),
                                                    maxHeight: getColumnMaxHeight()
                                                }}
                                                key={index}>
                                        <SheetCell>{cellValue}</SheetCell>
                                    </div>
                                }
                            })}
                        </div>
                    })}
                </div>

                {/* Relation columns */}
                <div className={isRelationColumnSelectAvailable() ? "sheet__relation sheet__relation--manyRelation scroll" : "sheet__relation scroll scroll--notX"}
                     onScroll={handleRightBoxScroll}
                     ref={rightScrollBox}>
                    <div className="line line--tableRow sheet__header__cell--relationWrapper">
                        <div className="relationColumnsScroll">
                            {(isRelationColumnSelectAvailable() ? Array.from(Array(numberOfRelationColumns).keys()) : [1]).map((item, index) => {
                                return <TableViewHeaderRowRelationColumn relationColumnSort={relationColumnSort}
                                                                         sheetIndex={sheetIndex}
                                                                         id={index}
                                                                         showDisclaimer={showDisclaimerAboutEmptySelectList}
                                                                         setDeleteMatchesModalVisible={setDeleteMatchesModalVisible}
                                                                         sortRelationColumnByMatch={sortRelationColumnByMatch} />
                            })}
                        </div>
                    </div>

                    {rowsToRender.map((item, index) => {
                        let currentSheetRowIndex = index;
                        let correlatedRow = null;
                        let substringIndexes = [];
                        let correlatedRowArray = [];

                        const indexAfterFilterAndSort = indexesInRender[index];
                        const currentSelectList = selectList[indexAfterFilterAndSort];

                        for(const currentIndexesOfCorrelatedRows of indexesOfCorrelatedRowsLevels) {
                            if(currentSelectList?.length && currentIndexesOfCorrelatedRows?.length) {
                                if(sheetIndex === 0) {
                                    const pair = currentIndexesOfCorrelatedRows.find((item) => (item[0] === indexAfterFilterAndSort));

                                    if(pair) {
                                        correlatedRow = currentSelectList.find((item) => (item.relationRowIndex === pair[1]));
                                        correlatedRowArray.push(correlatedRow);
                                    }
                                    else {
                                        correlatedRowArray.push(null);
                                    }
                                }
                                else {
                                    const pair = currentIndexesOfCorrelatedRows.find((item) => (item[1] === indexAfterFilterAndSort));

                                    if(pair) {
                                        correlatedRow = currentSelectList.find((item) => (item.dataRowIndex === pair[0]));
                                        correlatedRowArray.push(correlatedRow);
                                    }
                                    else {
                                        correlatedRowArray.push(null);
                                    }
                                }
                            }
                        }

                        let isCorrelatedRowWithHighestSimilarity = false;
                        let correlatedRowValue = '-';
                        let joinStringOfColumnsFromCurrentSheet = '';
                        let colorLettersActive = false;
                        let correlatedRowValueToDisplay = '';

                        let isCorrelatedRowWithHighestSimilarityArray = [];
                        let correlatedRowValueArray = [];
                        let correlatedRowValueToDisplayArray = [];

                        let relationIndex = 0;

                        for(const correlatedRow of correlatedRowArray) {
                            if(correlatedRow) {
                                isCorrelatedRowWithHighestSimilarity = ((matchType === 3) || (relationIndex > 0) ||
                                                                        (correlatedRow.similarity === currentSelectList[0]?.similarity) ||
                                                                        (manuallyCorrelatedRowsIndexes.includes(indexAfterFilterAndSort)) ||
                                                                        (schemaCorrelatedRowsIndexes.includes(indexAfterFilterAndSort)));
                                isCorrelatedRowWithHighestSimilarityArray.push(isCorrelatedRowWithHighestSimilarity);

                                correlatedRowValue = Object.entries(secondSheet[sheetIndex === 0 ? correlatedRow.relationRowIndex : correlatedRow.dataRowIndex])
                                    .filter((_, index) => (showInSelectMenuColumnsSecondSheet[index]))
                                    .map((item) => (item[1]))
                                    .join(' - ');
                                correlatedRowValueArray.push(correlatedRowValue);

                                correlatedRowValueToDisplay = correlatedRowValue.length <= 50 ?
                                    correlatedRowValue : `${correlatedRowValue.substring(0, 50)}...`;
                                correlatedRowValueToDisplayArray.push(correlatedRowValueToDisplay);
                            }

                            relationIndex++;
                        }

                        let substringIndexesArray = [];

                        if(markLettersRows.includes(indexAfterFilterAndSort)) {
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
                                .map((item) => {
                                    return currentSheet[indexAfterFilterAndSort][item];
                                })
                                .join(' ');

                            for(const correlatedRowValueToDisplay of correlatedRowValueToDisplayArray) {
                                if(correlatedRowValueToDisplay && checkCommonElement(columnsNamesInConditions, columnsNamesInSelectMenu)) {
                                    colorLettersActive = true;
                                    substringIndexes = findSubstrings(joinStringOfColumnsFromCurrentSheet, correlatedRowValueToDisplay);
                                    substringIndexesArray.push(substringIndexes);
                                }
                            }
                        }

                        return <div className="line line--tableRow"
                                    style={{
                                        minHeight: `${rowsToRenderHeights[index] || 50}px`,
                                        maxHeight: `${rowsToRenderHeights[index] || 50}px`
                                    }}
                                    key={index}>
                            {/* Column with relation selection */}
                            <div className="relationColumnsScroll">
                                {(isRelationColumnSelectAvailable() ? Array.from(Array(numberOfRelationColumns).keys()) : [1]).map((item, index) => {
                                    const substringIndexes = substringIndexesArray[index];
                                    const correlatedRow = correlatedRowArray[index];
                                    const correlatedRowValue = correlatedRowValueArray[index];
                                    const correlatedRowValueToDisplay = correlatedRowValueToDisplayArray[index];
                                    const isCorrelatedRowWithHighestSimilarity = isCorrelatedRowWithHighestSimilarityArray[index];

                                    return <div className={`sheet__body__row__cell sheet__body__row__cell--relation sheet__body__row__cell--relation--${index}`}
                                                key={index}>
                                        {currentSelectList?.length ? <>
                                            <button className="select__btn"
                                                    onClick={(e) => { showRelationSelectionDropdown(e, index, indexAfterFilterAndSort); }}>

                                                {showSelectMenu !== indexAfterFilterAndSort || showSelectMenuRelation !== index ? <span className="select__menu__item"
                                                                                                    key={index}>
                                    {correlatedRow ? <>
                                        <span className="select__menu__item__value">
                                            {correlatedRowValueToDisplay.length === correlatedRowValue.length ?
                                                <ColorMarkedText string={correlatedRowValueToDisplay || ''}
                                                                 indexes={substringIndexes || []} /> : <>
                                                    <ColorMarkedText string={correlatedRowValueToDisplay || ''}
                                                                     indexes={substringIndexes || []} />

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
                                            {isLargerMatchAlertVisible(isCorrelatedRowWithHighestSimilarity, correlatedRow) ? <Tooltip title={content.rowWithLargerMatchAlert}
                                                                                                                                       followCursor={true}
                                                                                                                                       size="small"
                                                                                                                                       position="top">
                                                <span className="select__menu__item__similarity__info">
                                                    !
                                                </span>
                                            </Tooltip> : ''}

                                            {correlatedRow.similarity >= 0 ? `${correlatedRow.similarity} %` : (getSimilarityColorForRelationSheet(0, sheetIndex === 0 ? correlatedRow.dataRowIndex : correlatedRow.relationRowIndex) === 'blue' ? 'S' : '-')}
                                        </span>
                                    </> : <RelationSelectionEmptyRow />}
                                </span> : <input className="select__input"
                                                 ref={selectInput}
                                                 value={searchInputValue}
                                                 onChange={(e) => { setSearchInputValue(e.target.value); }} />}

                                                <img className="select__btn__img"
                                                     src={arrowDown}
                                                     alt="arrow-down" />
                                            </button>

                                            <Tooltip title={markLettersRows.includes(indexAfterFilterAndSort) ? content.turnOffColorOnStrings : content.turnOnColorOnStrings}
                                                     followCursor={true}
                                                     size="small"
                                                     position="top">
                                                <button className={markLettersRows.includes(indexAfterFilterAndSort) ? "btn btn--markLetters btn--markLetters--selected" : "btn btn--markLetters"}
                                                        onClick={() => { markLetters(indexAfterFilterAndSort); }}>
                                                    Aa
                                                </button>
                                            </Tooltip>

                                            {correlatedRow ? <button className="btn btn--removeCorrelation"
                                                                     onClick={() => { removeCorrelation(correlatedRow.dataRowIndex, correlatedRow.relationRowIndex); }}>
                                                &times;
                                            </button> : ''}
                                        </> : ''}

                                        {/* Dropdown menu */}
                                        {(showSelectMenu === indexAfterFilterAndSort) && (showSelectMenuRelation === index) ? <div className="select__menu scroll"
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
                                })}
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div> : <div className="sheet__loader">
            <Loader />
        </div>}
    </div>
});

export default RelationSheetView;
