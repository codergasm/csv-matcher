import React, {useContext, useEffect, useState} from 'react';
import {ViewContext} from "./CorrelationView";
import {AppContext} from "../pages/CorrelationPage";
import {makeId} from "../helpers/others";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import {getSelectList, matching} from "../api/matching";
import TestConfigurationMatchesList from "./TestConfigurationMatchesList";

const TestConfigurationModal = ({closeModal, relationSheetColumnsVisibility, user}) => {
    const { dataSheet, relationSheet, dataFile, relationFile, dataDelimiter, relationDelimiter } = useContext(AppContext);
    const { showInSelectMenuColumnsDataSheet, priorities, indexesOfCorrelatedRows,
        overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
        manuallyCorrelatedRows} = useContext(ViewContext);

    const [relationSheetRowNumber, setRelationSheetRowNumber] = useState(1);
    const [relationSheetColumnsNames, setRelationSheetColumnsNames] = useState([]);
    const [dataSheetColumnsNames, setDataSheetColumnsNames] = useState([]);
    const [testSelectList, setTestSelectList] = useState([]);
    const [testIndexesOfCorrelatedRows, setTestIndexesOfCorrelatedRows] = useState([]);
    const [joinStringOfColumnsFromRelationSheet, setJoinStringOfColumnsFromRelationSheet] = useState('');
    const [columnsNamesInConditions, setColumnsNamesInConditions] = useState([]);
    const [columnToSearch, setColumnToSearch] = useState(0);
    const [valueToSearch, setValueToSearch] = useState('');

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    useEffect(() => {
        setColumnsNamesInConditions(priorities.map((item) => (item.conditions.map((item) => (item.dataSheet)))).flat());
    }, [priorities]);

    useEffect(() => {
        if(relationSheet) {
            setRelationSheetColumnsNames(Object.entries(relationSheet[0]).map((item) => (item[0] === '0' ? 'l.p.' : item[0])));
        }
    }, [relationSheet]);

    useEffect(() => {
        setDataSheetColumnsNames(Object.entries(dataSheet[0]).map((item) => (item[0] === '0' ? 'l.p.' : item[0])))
    }, [dataSheet]);

    useEffect(() => {
        if(relationSheetColumnsNames?.length) {
            if(valueToSearch) {
                const indexFound = relationSheet.findIndex((item) => {
                    return item[relationSheetColumnsNames[columnToSearch]]?.toLowerCase()?.includes(valueToSearch?.toLowerCase());
                });

                setRelationSheetRowNumber(indexFound === -1 ? -1 : indexFound+1);
            }
        }
    }, [valueToSearch, columnToSearch]);

    useEffect(() => {
        setJoinStringOfColumnsFromRelationSheet(priorities.map((item) => {
            return item.conditions.map((item) => {
                return item.relationSheet;
            });
        })
            .flat()
            .map((item, i) => {
                return relationSheet[relationSheetRowNumber-1] ? relationSheet[relationSheetRowNumber-1][item] : '';
            })
            .join(' '));
    }, [relationSheetRowNumber]);

    const startTestCorrelation = () => {
        const jobIdTmp = makeId(64);
        const correlationMatrix = relationSheet.map(() => {
            return dataSheet.map(() => {
                return -1;
            });
        });

        matching(jobIdTmp, priorities, correlationMatrix,
            dataFile, relationFile,
            dataDelimiter, relationDelimiter,
            indexesOfCorrelatedRows,
            overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
            manuallyCorrelatedRows, user.id, relationSheetRowNumber-1)
            .then((res) => {
                if(res?.data) {
                    const { newIndexesOfCorrelatedRows, newSelectListIndicators }
                        = res.data;

                    setTestIndexesOfCorrelatedRows(newIndexesOfCorrelatedRows);

                    getSelectList(jobIdTmp, priorities, dataFile, relationFile,
                        dataDelimiter, relationDelimiter,
                        false, showInSelectMenuColumnsDataSheet,
                        dataSheet.length, relationSheet.length, newSelectListIndicators, relationSheetRowNumber-1)
                        .then((res) => {
                            if(res?.data) {
                                setTestSelectList(res?.data?.relationSheetSelectList[0]);
                            }
                        });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleRelationSheetRowNumberInput = (e) => {
        setValueToSearch('');
        setRelationSheetRowNumber(isNaN(parseInt(e.target.value)) ? '' : parseInt(e.target.value));
    }

    return <div className="modal__inner modal__inner--testConfiguration scroll">
        <div className="modal__top">
            <button className="btn btn--openTestConfigurationModal"
                    onClick={closeModal}>
                Zamknij testowanie
            </button>

            <h3 className="modal__header">
                Przetestuj konfigurację
            </h3>
        </div>

        <div className="modal__line">
                <span className="flex flex--start">
                    Arkusz 2 - numer wiersza: <input className="input input--number"
                                                     value={relationSheetRowNumber !== -1 ? relationSheetRowNumber : ''}
                                                     onChange={handleRelationSheetRowNumberInput} />
                </span>

            <span className="flex flex--start">
                Wskaż rekord wg wartości w kolumnie:
                <select className="priorities__item__condition__select"
                        value={columnToSearch}
                        onChange={(e) => { setColumnToSearch(e.target.value); }}>
                    {relationSheetColumnsNames.map((item, index) => {
                        return <option key={index}
                                       value={index}>
                            {item}
                        </option>
                    })}
                </select>
            </span>

            <span>
                <label className="priorities__item__condition__search">
                    <input className="input input--search input--valueToSearch"
                           value={valueToSearch}
                           onChange={(e) => { setValueToSearch(e.target.value); }}
                           placeholder="Wartość w kolumnie" />
                </label>
            </span>

            {(relationSheetRowNumber > relationSheet?.length) || relationSheetRowNumber === -1 ? <span className="red">
                    {relationSheetRowNumber === -1 ? 'Nie znaleziono żadnego wiersza' : <>
                        Nie ma takiego wiersza. Liczba wierszy w arkuszu 2 to: {relationSheet?.length}
                    </>}
                </span> : <div className="marginTop">
                <div className="container--scrollX scroll">
                    <div className="flex">
                        {relationSheetColumnsNames.map((item, index) => {
                            if(relationSheetColumnsVisibility[index]) {
                                return <div className={index === 0 ? "sheet__header__cell sheet__header__cell--first" : "sheet__header__cell"}
                                            style={{
                                                minWidth: `300px`
                                            }}
                                            key={index}>
                                    {item}
                                </div>
                            }
                        })}
                    </div>
                    <div className="line line--tableRow">
                        {/* Relation sheet columns */}
                        {relationSheet[relationSheetRowNumber-1] ? Object.entries(relationSheet[relationSheetRowNumber-1]).map((item, index) => {
                            const cellValue = item[1];

                            if(relationSheetColumnsVisibility[index]) {
                                return <div className={index === 0 ? "sheet__body__row__cell sheet__body__row__cell--first" : "sheet__body__row__cell"}
                                            style={{
                                                minWidth: `300px`
                                            }}
                                            key={index}>
                                    {cellValue}
                                </div>
                            }
                        }) : ''}
                    </div>
                </div>
            </div>}

            <button className="btn btn--startAutoMatch btn--startAutoMatchTest"
                    onClick={startTestCorrelation}>
                Uruchom automatyczne dopasowanie testowo tylko dla wiersza powyżej
            </button>

            {testSelectList?.length ? <div className="testConfiguration__selectList">
                {testIndexesOfCorrelatedRows?.length ? <>
                    <p className="text-center">
                        Znaleziono dopasowanie do wiersza <b>nr {testSelectList[0].dataRowIndex}</b> z arkusza 1.
                    </p>

                    <div className="center">
                        <div className="container--scrollX scroll">
                            <div className="line line--noFlex">
                                {dataSheetColumnsNames.map((item, index) => {
                                    if(showInSelectMenuColumnsDataSheet[index]) {
                                        return <div className={index === 0 ? "sheet__header__cell sheet__header__cell--first" : "sheet__header__cell"}
                                                    style={{
                                                        minWidth: `300px`
                                                    }}
                                                    key={index}>

                                            {item}
                                        </div>
                                    }
                                    else {
                                        return '';
                                    }
                                })}

                                <div className="sheet__header__cell">
                                    Dopasowanie
                                </div>
                            </div>

                            <TestConfigurationMatchesList from={0}
                                                          to={1}
                                                          joinStringOfColumnsFromRelationSheet={joinStringOfColumnsFromRelationSheet}
                                                          testSelectList={testSelectList}
                                                          columnsNamesInConditions={columnsNamesInConditions} />
                        </div>
                    </div>

                    <p className="text-center">
                        Poniżej znajduje się lista pozostałych dziesięciu najwyżej dopasowanych rekordów.
                    </p>

                    <div className="center">
                        <div className="container--scrollX scroll">
                            <div className="line line--noFlex">
                                {dataSheetColumnsNames.map((item, index) => {
                                    if(showInSelectMenuColumnsDataSheet[index]) {
                                        return <div className={index === 0 ? "sheet__header__cell sheet__header__cell--first" : "sheet__header__cell"}
                                                    style={{
                                                        minWidth: `300px`
                                                    }}
                                                    key={index}>

                                            {item}
                                        </div>
                                    }
                                    else {
                                        return '';
                                    }
                                })}

                                <div className="sheet__header__cell">
                                    Dopasowanie
                                </div>
                            </div>

                            <TestConfigurationMatchesList from={1}
                                                          to={11}
                                                          joinStringOfColumnsFromRelationSheet={joinStringOfColumnsFromRelationSheet}
                                                          testSelectList={testSelectList}
                                                          columnsNamesInConditions={columnsNamesInConditions} />
                        </div>
                    </div>
                </> : <>
                    <p className="text-center">
                        Nie znaleziono dopasowania powyżej wyznaczonego progu.
                        Poniżej znajduje się lista dziesięciu najwyżej dopasowanych rekordów.
                    </p>

                    <div className="center">
                        <div className="container--scrollX scroll">
                            <div className="line line--noFlex">
                                {dataSheetColumnsNames.map((item, index) => {
                                    if(showInSelectMenuColumnsDataSheet[index]) {
                                        return <div className={index === 0 ? "sheet__header__cell sheet__header__cell--first" : "sheet__header__cell"}
                                                    style={{
                                                        minWidth: `300px`
                                                    }}
                                                    key={index}>

                                            {item}
                                        </div>
                                    }
                                    else {
                                        return '';
                                    }
                                })}

                                <div className="sheet__header__cell">
                                    Dopasowanie
                                </div>
                            </div>
                            <TestConfigurationMatchesList from={0}
                                                          to={10}
                                                          joinStringOfColumnsFromRelationSheet={joinStringOfColumnsFromRelationSheet}
                                                          testSelectList={testSelectList}
                                                          columnsNamesInConditions={columnsNamesInConditions} />
                        </div>
                    </div>
                </>}
            </div> : ''}
        </div>
    </div>
}

export default TestConfigurationModal;
