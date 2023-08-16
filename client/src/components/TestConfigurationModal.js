import React, {useContext, useEffect, useState} from 'react';
import {ViewContext} from "./CorrelationView";
import {AppContext} from "../pages/CorrelationPage";
import {makeId} from "../helpers/others";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import {getSelectList, matching} from "../api/matching";
import TestConfigurationMatchesList from "./TestConfigurationMatchesList";
import {TranslationContext} from "../App";

const TestConfigurationModal = ({closeModal, relationSheetColumnsVisibility, user}) => {
    const { content } = useContext(TranslationContext);
    const { dataSheet, relationSheet, dataFile, relationFile, dataDelimiter, relationDelimiter } = useContext(AppContext);
    const { showInSelectMenuColumnsDataSheet, priorities, indexesOfCorrelatedRows,
        overrideAllRows, avoidOverrideForManuallyCorrelatedRows, matchType,
        manuallyCorrelatedRows} = useContext(ViewContext);

    const [relationSheetRowNumber, setRelationSheetRowNumber] = useState(1);
    const [relationSheetColumnsNames, setRelationSheetColumnsNames] = useState([]);
    const [dataSheetColumnsNames, setDataSheetColumnsNames] = useState([]);
    const [testSelectList, setTestSelectList] = useState([]);
    const [testIndexesOfCorrelatedRows, setTestIndexesOfCorrelatedRows] = useState([]);
    const [joinStringOfColumnsFromRelationSheet, setJoinStringOfColumnsFromRelationSheet] = useState('');
    const [columnsNamesInConditions, setColumnsNamesInConditions] = useState([]);
    const [valuesToSearch, setValuesToSearch] = useState([]);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    useEffect(() => {
        setColumnsNamesInConditions(priorities.map((item) => (item.conditions.map((item) => (item.dataSheet)))).flat());
    }, [priorities]);

    useEffect(() => {
        if(relationSheet) {
            setRelationSheetColumnsNames(Object.entries(relationSheet[0]).map((item) => (item[0] === 'rel_0' ? content.index : item[0])));
        }
    }, [relationSheet]);

    useEffect(() => {
        setValuesToSearch(relationSheetColumnsVisibility.map(() => ('')));
    }, [relationSheetColumnsVisibility]);

    useEffect(() => {
        setDataSheetColumnsNames(Object.entries(dataSheet[0]).map((item) => (item[0] === '0' ? content.index : item[0])))
    }, [dataSheet]);

    useEffect(() => {
        if(relationSheetColumnsNames?.length) {
            if(valuesToSearch) {
                const indexFound = relationSheet.findIndex((item) => {
                    const columnsValues = Object.values(item);

                    return columnsValues.findIndex((item, index) => {
                       if(item) {
                           return !item.toLowerCase().includes(valuesToSearch[index]?.toLowerCase());
                       }
                       else {
                           return false;
                       }
                    }) === -1;
                });

                setRelationSheetRowNumber(indexFound === -1 ? -1 : indexFound+1);
            }
        }
    }, [valuesToSearch]);

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
            manuallyCorrelatedRows, user.id, matchType, '', relationSheetRowNumber-1)
            .then((res) => {
                if(res?.data) {
                    const { newIndexesOfCorrelatedRows, newSelectListIndicators }
                        = res.data;

                    setTestIndexesOfCorrelatedRows(newIndexesOfCorrelatedRows);

                    getSelectList(jobIdTmp, priorities, dataFile, relationFile,
                        dataDelimiter, relationDelimiter,
                        false, showInSelectMenuColumnsDataSheet,
                        dataSheet.length, relationSheet.length, newSelectListIndicators, '', relationSheetRowNumber-1)
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
        setRelationSheetRowNumber(isNaN(parseInt(e.target.value)) ? '' : parseInt(e.target.value));
    }

    const handleValuesToSearchChange = (i, value) => {
        setValuesToSearch(prevState => {
            return prevState.map((item, index) => {
                if(index === i) {
                    return value;
                }
                else {
                    return item;
                }
            });
        });
    }

    return <div className="modal__inner modal__inner--testConfiguration scroll">
        <div className="modal__top">
            <button className="btn btn--openTestConfigurationModal"
                    onClick={closeModal}>
                {content.closeTesting}
            </button>

            <h3 className="modal__header">
                {content.testConfiguration}
            </h3>
        </div>

        <div className="modal__line modal__line--test">
                <span className="flex flex--start">
                    {content.sheet2} - {content.numberOfRow}: <input className="input input--number"
                                                     value={relationSheetRowNumber !== -1 ? relationSheetRowNumber : ''}
                                                     onChange={handleRelationSheetRowNumberInput} />
                </span>

            <div className="container--scrollX scroll">
                <div className="flex">
                    {relationSheetColumnsNames.map((item, index) => {
                        if(relationSheetColumnsVisibility[index]) {
                            return <div className={index === 0 ? "sheet__header__cell sheet__header__cell--first sheet__header__cell--first--test" : "sheet__header__cell"}
                                        style={{
                                            minWidth: `300px`
                                        }}
                                        key={index}>
                                {item}
                            </div>
                        }
                    })}
                </div>
                <div className="flex">
                    {relationSheetColumnsNames.map((item, index) => {
                        if(relationSheetColumnsVisibility[index]) {
                            return <div className={index === 0 ? "sheet__header__cell sheet__header__cell--first sheet__header__cell--first--test" : "sheet__header__cell"}
                                        style={{
                                            minWidth: `300px`
                                        }}
                                        key={index}>
                                <label className="priorities__item__condition__search priorities__item__condition__search--test"
                                       key={index}>
                                    <input className="input input--search input--valueToSearch"
                                           value={valuesToSearch[index]}
                                           onChange={(e) => { handleValuesToSearchChange(index, e.target.value); }}
                                           placeholder={content.valueInColumnPlaceholder} />
                                </label>
                            </div>
                        }
                    })}
                </div>

                {(relationSheetRowNumber > relationSheet?.length) || relationSheetRowNumber === -1 ? <span className="red">
                    {relationSheetRowNumber === -1 ? content.rowAnyNotFound : <>
                        {content.rowNotFound}: {relationSheet?.length}
                    </>}
                </span> : <div>
                    <div className="line line--tableRow line--tableRow--borderBottom">
                        {/* Relation sheet columns */}
                        {relationSheet[relationSheetRowNumber-1] ? Object.entries(relationSheet[relationSheetRowNumber-1]).map((item, index) => {
                            const cellValue = item[1];

                            if(relationSheetColumnsVisibility[index]) {
                                return <div className={index === 0 ? "sheet__body__row__cell sheet__body__row__cell--first sheet__header__cell--first--test" : "sheet__body__row__cell"}
                                            style={{
                                                minWidth: `300px`
                                            }}
                                            key={index}>
                                    {cellValue}
                                </div>
                            }
                        }) : ''}
                    </div>
                </div>}
            </div>

            <button className="btn btn--startAutoMatch btn--startAutoMatchTest"
                    disabled={!priorities?.length}
                    onClick={startTestCorrelation}>
                {content.runTestMatchingButton}
            </button>

            {testSelectList?.length ? <div className="testConfiguration__selectList">
                {testIndexesOfCorrelatedRows?.length ? <>
                    <p className="text-center">
                        {content.testingMatchFoundHeaderPart1}
                        <b className="bold--index">{testSelectList[0].dataRowIndex+1}</b>
                        {content.testingMatchFoundHeaderPart2}.
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
                                    {content.match}
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
                        {content.testingMatchFoundListHeader}
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
                                    {content.match}
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
                        {content.testingMatchNotFound}
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
                                    {content.match}
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
