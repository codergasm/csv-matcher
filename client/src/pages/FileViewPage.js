import React, {useEffect, useState} from 'react';
import PageHeader from "../components/PageHeader";
import getUrlParam from "../helpers/getUrlParam";
import redirectToHomepage from "../helpers/redirectToHomepage";
import {getFileById} from "../api/files";
import Papa from "papaparse";
import convertResponseToObject from "../helpers/convertResponseToObject";
import {settings} from "../helpers/settings";
import TableViewHeaderRow from "../components/TableViewHeaderRow";
import SheetCell from "../components/SheetCell";
import ColumnsSettingsModal from "../components/ColumnsSettingsModal";
import CellsFormatModal from "../components/CellsFormatModal";
import {ROWS_PER_PAGE} from "../static/constans";
import getScrollParams from "../helpers/getScrollParams";
import getColumnsSortingAndSortType from "../helpers/getColumnsSortingAndSortType";
import convertColumnToNumber from "../helpers/convertColumnToNumber";
import {sortByColumn} from "../helpers/others";

const FileViewPage = () => {
    const [sheet, setSheet] = useState([]);
    const [fileName, setFileName] = useState('');
    const [rowsToRender, setRowsToRender] = useState([]);

    const [page, setPage] = useState(1);
    const [columnsSettingsModalVisible, setColumnsSettingsModalVisible] = useState(false);
    const [cellsFormatModalVisible, setCellsFormatModalVisible] = useState(false);
    const [sheetSorted, setSheetSorted] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);
    const [columnsVisibility, setColumnsVisibility] = useState([]);
    const [minColumnWidth, setMinColumnWidth] = useState(50);
    const [cellsHeight, setCellsHeight] = useState(-1);
    const [columnsSorting, setColumnsSorting] = useState([]);
    const [sortingClicked, setSortingClicked] = useState(false);

    useEffect(() => {
        const fileId = getUrlParam('id');

        if(fileId) {
            getFileById(parseInt(fileId))
                .then((res) => {
                    if(res?.data) {
                        const data = res.data;
                        setFileName(res.data.filename);
                        convertFileToObject(`${settings.API_URL}/${data.filepath.replace('./', '')}`);
                    }
                });
        }
        else {
            redirectToHomepage();
        }
    }, []);

    useEffect(() => {
        if(sheet?.length) {
            setSheetSorted(sheet);
        }
    }, [sheet]);

    useEffect(() => {
        if(sheetSorted?.length) {
            setColumnsNames(Object.entries(sheetSorted[0]).map((item) => (item[0] !== '0' ? item[0] : 'l.p.')));
            setRowsToRender(sheetSorted.slice(0, 20));
        }
    }, [sheetSorted]);

    useEffect(() => {
        if(columnsNames?.length) {
            if(!columnsVisibility?.length) {
                setColumnsVisibility(columnsNames.map((item, index) => (index < 10)));
            }

            if(!columnsSorting?.length) {
                setColumnsSorting(columnsNames.map(() => (0)));
            }
        }
    }, [columnsNames]);

    useEffect(() => {
        if(columnsVisibility) {
            setMinColumnWidth(100 / (columnsVisibility.filter((item) => (item)).length));
        }
    }, [columnsVisibility]);

    const convertFileToObject = (filename) => {
        Papa.parse(filename, {
            download: true,
            header: true,
            complete: function(results) {
                setSheet(convertResponseToObject(results.data));
            }
        });
    }

    useEffect(() => {
        // Sorting changed - fetch next rows from start
        if(sortingClicked) {
            setRowsToRender([...sheetSorted.slice(0, 20)]);
            setPage(1);
        }
    }, [sheetSorted]);

    const fetchNextRows = () => {
        setRowsToRender(prevState => {
            return [...prevState, ...sheetSorted.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)];
        });
        setPage(prevState => (prevState+1));
    }

    const checkScrollToBottom = (e) => {
        const { visibleHeight, scrollHeight, scrolled } = getScrollParams(e);

        if(scrolled + visibleHeight >= scrollHeight) {
            if((page) * ROWS_PER_PAGE < sheetSorted.length) {
                fetchNextRows();
            }
        }
    }

    const sortSheet = (col, i) => {
        setSortingClicked(true);

        const { newSorting, sortType } = getColumnsSortingAndSortType(i, columnsSorting);
        col = convertColumnToNumber(col);

        setColumnsSorting(newSorting);
        setSheetSorted(sortByColumn(sheet, col, sortType));
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

        setSheetSorted(sheet);
    }

    const getColumnMaxHeight = () => {
        return cellsHeight !== -1 ? `${cellsHeight}px` : 'unset';
    }

    const getColumnMinWidth = () => {
        const numberOfColumns = columnsNames?.length;

        if(numberOfColumns === 2) {
            return '92%';
        }
        else if(numberOfColumns === 3) {
            return `46%`;
        }
        else if(numberOfColumns === 4) {
            return `31%`;
        }
        else {
            return `min(300px, ${minColumnWidth}%)`;
        }
    }

    return <div className="container">
        {columnsSettingsModalVisible ? <ColumnsSettingsModal closeModal={() => { setColumnsSettingsModalVisible(false); }}
                                                             columnsNames={columnsNames}
                                                             hideFirstColumn={true}
                                                             extraIndex={0}
                                                             columns={columnsVisibility}
                                                             setColumns={setColumnsVisibility}
                                                             header={'Ustaw widoczność'} /> : ''}

        {cellsFormatModalVisible ? <CellsFormatModal cellsHeight={cellsHeight}
                                                     setCellsHeight={setCellsHeight}
                                                     closeModal={() => { setCellsFormatModalVisible(false); }} /> : ''}

        <div className="fileViewHeader">
            <h3 className="fileViewHeader__text">
                Podgląd pliku {fileName}
            </h3>
        </div>

        <div className="sheet scroll"
             onScroll={checkScrollToBottom}>
            <div className="sheet__table__info sheet__table__info--data1">
                <div className="cell--legend">
                    Widoczność

                    <button className="btn btn--selectAll"
                            onClick={() => { setColumnsSettingsModalVisible(true); }}>
                        Konfiguruj w okienku
                    </button>
                    <button className="btn btn--selectAll"
                            onClick={() => { setCellsFormatModalVisible(true); }}>
                        Formatuj widoczność komórek
                    </button>
                </div>
            </div>

            <div className="sheet__table">
                <div className="line line--noFlex">
                    <TableViewHeaderRow columnsNames={columnsNames}
                                        columnsVisibility={columnsVisibility}
                                        columnsSorting={columnsSorting}
                                        removeSorting={removeSorting}
                                        getColumnMinWidth={getColumnMinWidth}
                                        sortSheet={sortSheet} />
                </div>
            </div>

            {rowsToRender.map((item, index) => {
                return <div className="line line--tableRow"
                            key={index}>
                    {Object.entries(item).map((item, index) => {
                        const cellValue = item[1];

                        if(columnsVisibility[index]) {
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
                </div>
            })}
        </div>
    </div>
};

export default FileViewPage;
