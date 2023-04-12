import React, {useContext, useEffect, useState} from 'react';
import {ViewContext} from "./CorrelationView";
import ReactSlider from 'react-slider'
import TestConfigurationModal from "./TestConfigurationModal";
import ProgressBar from "./ProgressBar";
import {AppContext} from "../pages/CorrelationPage";

const matchTypes = ['Jeden do jednego', 'Jeden (arkusz 1) do wielu (arkusz 2)',
    'Wiele (arkusz 1) do jednego (arkusz 2),', 'Wiele do wielu'];

const AutoMatchModal = ({dataSheetColumns, relationSheetColumns, closeModal, columnsVisibility}) => {
    const { relationSheet } = useContext(AppContext);
    const { priorities, setPriorities, matchType, setMatchType, progressCount,
        correlate, correlationStatus, overrideAllRows, setOverrideAllRows, matchThreshold, setMatchThreshold,
        avoidOverrideForManuallyCorrelatedRows, setAvoidOverrideForManuallyCorrelatedRows } = useContext(ViewContext);

    const [loading, setLoading] = useState(false);
    const [testConfigurationModalVisible, setTestConfigurationModalVisible] = useState(false);
    const [dataSheetSearch, setDataSheetSearch] = useState('');
    const [relationSheetSearch, setRelationSheetSearch] = useState('');
    const [dataSheetColumnsFiltered, setDataSheetColumnsFiltered] = useState([]);
    const [relationSheetColumnsFiltered, setRelationSheetColumnsFiltered] = useState([]);
    const [currentDataSheetPriorityIndex, setCurrentDataSheetPriorityIndex] = useState(0);
    const [currentDataSheetIndex, setCurrentDataSheetIndex] = useState(0);
    const [currentRelationSheetPriorityIndex, setCurrentRelationSheetPriorityIndex] = useState(0);
    const [currentRelationSheetIndex, setCurrentRelationSheetIndex] = useState(0);

    /*
        Priorities:
        [
            {
                conditions: [
                    {
                        dataSheet: 'name',
                        relationSheet: 'product_name'
                    },
                    {
                        dataSheet: 'index',
                        relationSheet: 'inx'
                    },
                    {
                        dataSheet: 'price',
                        relationSheet: 'price'
                    }
                ],
                logicalOperators: [1, 0]
            }
        ]
     */

    useEffect(() => {
        setDataSheetColumnsFiltered(dataSheetColumns?.slice(1));
    }, [dataSheetColumns]);

    useEffect(() => {
        setRelationSheetColumnsFiltered(relationSheetColumns?.slice(1));
    }, [relationSheetColumns]);

    useEffect(() => {
        setDataSheetColumnsFiltered(dataSheetColumns.slice(1).filter((item) => {
            return item.toLowerCase().includes(dataSheetSearch?.toLowerCase());
        }));
    }, [dataSheetSearch]);

    useEffect(() => {
        setRelationSheetColumnsFiltered(relationSheetColumns.slice(1).filter((item) => {
            return item.toLowerCase().includes(relationSheetSearch?.toLowerCase());
        }));
    }, [relationSheetSearch]);

    useEffect(() => {
        if(correlationStatus === 2) {
            closeModal();
            setLoading(false);
        }
    }, [correlationStatus]);

    const addPriority = () => {
        setPriorities(prevState => {
            return [...prevState, {
                conditions: [
                    {
                        dataSheet: dataSheetColumns[0],
                        relationSheet: relationSheetColumns[0]
                    }
                ],
                logicalOperators: []
            }];
        });
    }

    const addCondition = (priorityIndex, logicalOperator) => {
        setPriorities(prevState => {
            return prevState.map((item, index) => {
                if(priorityIndex === index) {
                    return {
                        conditions: [...item.conditions, {
                            dataSheet: dataSheetColumns[0],
                            relationSheet: relationSheetColumns[0]
                        }],
                        logicalOperators: [...item.logicalOperators, logicalOperator]
                    }
                }
                else {
                    return item;
                }
            });
        });
    }

    const updateCondition = (priority, condition, sheet, value) => {
        setPriorities(prevState => {
            return prevState.map((item, index) => {
                if(index === priority) {
                    return {
                        ...item,
                        conditions: item.conditions.map((item, index) => {
                            if(index === condition) {
                                return {
                                    ...item,
                                    [sheet]: value
                                }
                            }
                            else {
                                return item;
                            }
                        })
                    }
                }
                else {
                    return item;
                }
            })
        })
    }

    const updateLogicalOperator = (priority, condition, value) => {
        setPriorities(prevState => {
            return prevState.map((item, index) => {
                if(index === priority) {
                    return {
                        ...item,
                        logicalOperators: item.logicalOperators.map((item, index) => {
                            if(index === condition) {
                                return value;
                            }
                            else {
                                return item;
                            }
                        })
                    }
                }
                else {
                    return item;
                }
            })
        })
    }

    const deletePriority = (priority) => {
        setPriorities(prevState => {
            return prevState.filter((item, index) => (priority !== index));
        });
    }

    const deleteCondition = (priority, condition) => {
        setPriorities(prevState => {
            return prevState.map((item, index) => {
                if(index === priority) {
                    return {
                        logicalOperators: item.logicalOperators.filter((item, index) => {
                            return index !== condition;
                        }),
                        conditions: item.conditions.filter((item, index) => {
                            return index !== condition;
                        })
                    }
                }
                else {
                    return item;
                }
            });
        })
    }

    const handleMatchThresholdChange = (val) => {
        if((parseInt(val) >= 0 && parseInt(val) <= 100)) {
            setMatchThreshold(parseInt(val));
        }

        if(!val) {
            setMatchThreshold('');
        }
    }

    useEffect(() => {
        if(dataSheetColumnsFiltered?.length) {
            updateCondition(currentDataSheetPriorityIndex, currentDataSheetIndex, 'dataSheet', dataSheetColumnsFiltered[0]);
        }
    }, [dataSheetColumnsFiltered]);

    useEffect(() => {
        if(relationSheetColumnsFiltered?.length) {
            updateCondition(currentRelationSheetPriorityIndex, currentRelationSheetIndex, 'relationSheet', relationSheetColumnsFiltered[0]);
        }
    }, [relationSheetColumnsFiltered]);

    const updateDataSheetSearch = (priorityIndex, index, val) => {
        setCurrentDataSheetPriorityIndex(priorityIndex);
        setCurrentDataSheetIndex(index);
        setDataSheetSearch(val);
    }

    const updateRelationSheetSearch = (priorityIndex, index, val) => {
        setCurrentRelationSheetPriorityIndex(priorityIndex);
        setCurrentRelationSheetIndex(index);
        setRelationSheetSearch(val);
    }

    return <>
        {testConfigurationModalVisible ? <TestConfigurationModal relationSheetColumnsVisibility={columnsVisibility}
                                                                 closeModal={() => { setTestConfigurationModalVisible(false); }} /> : ''}

        <div className="modal">
            <button className="btn btn--closeModal"
                    onClick={() => { closeModal(); }}>
                &times;
            </button>

            <div className="modal__inner scroll">
                {!loading ? <>
                    <div className="modal__top">
                        <h3 className="modal__header">
                            Typ dopasowania
                        </h3>

                        <button className="btn btn--openTestConfigurationModal"
                                onClick={() => { setTestConfigurationModalVisible(true); }}>
                            Przetestuj konfigurację
                        </button>
                    </div>

                    {matchTypes.map((item, index) => {
                        return <label className={index > 0 ? "modal__label modal__label--disabled" : "modal__label"}
                                      key={index}>
                            <button className={matchType === index ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                    disabled={index > 0} // tmp: only first option works
                                    onClick={() => { setMatchType(index); }}>

                            </button>
                            {item}
                        </label>
                    })}

                    <h3 className="modal__header">
                        Przypisuj, jeśli dopasowanie procentowe jest większe niż
                    </h3>

                    <div className="modal__slider">
                        <ReactSlider className="horizontal-slider"
                                     thumbClassName="thumb"
                                     trackClassName="track"
                                     value={!isNaN(matchThreshold) ? matchThreshold : 0}
                                     onChange={setMatchThreshold} />

                        <div className="modal__slider__value">
                            <input className="input--matchThreshold"
                                   type="number"
                                   value={matchThreshold}
                                   onChange={(e) => { handleMatchThresholdChange(e.target.value); }} /> %
                        </div>
                    </div>

                    <h3 className="modal__header">
                        Priorytety dopasowania
                    </h3>

                    <div className="priorities">
                        {priorities.map((item, index) => {
                            const priority = item;
                            const priorityIndex = index;

                            return <div className="priorities__item"
                                        key={index}>
                                <button className="btn btn--deletePriority"
                                        onClick={() => { deletePriority(index); }}>
                                    &times;
                                </button>

                                <h3 className="priorities__item__header">
                                    Priorytet {index+1}
                                </h3>

                                {item.conditions.map((item, index) => {
                                    return <div className="priorities__item__condition"
                                                key={index}>
                                        <h4 className="priorities__item__condition__header">
                                            Warunek {index+1}
                                            <button className="btn btn--deleteCondition"
                                                    onClick={() => { deleteCondition(priorityIndex, index); }}>
                                                Usuń
                                            </button>
                                        </h4>
                                        <p className="priorities__item__condition__text">
                                            Szukaj dopasowania w kolumnie arkusza 1:
                                        </p>
                                        <label className="priorities__item__condition__search">
                                            <input className="input input--search"
                                                   value={dataSheetSearch}
                                                   onChange={(e) => { updateDataSheetSearch(priorityIndex, index, e.target.value); }}
                                                   placeholder="Szukaj..." />
                                        </label>
                                        {dataSheetColumnsFiltered?.length ? <select className="priorities__item__condition__select"
                                                                                    value={item.dataSheet}
                                                                                    onChange={(e) => { updateCondition(priorityIndex, index, 'dataSheet', e.target.value); }}>
                                            {dataSheetColumnsFiltered.map((item, index) => {
                                                return <option key={index} value={item}>
                                                    {item}
                                                </option>
                                            })}
                                        </select> : <p className="noOptions">
                                            Nie znaleziono żadnych kolumn
                                        </p>}

                                        <p className="priorities__item__condition__text">
                                            Szukaj dopasowania w kolumnie arkusza 2:
                                        </p>
                                        <label className="priorities__item__condition__search">
                                            <input className="input input--search"
                                                   value={relationSheetSearch}
                                                   onChange={(e) => { updateRelationSheetSearch(priorityIndex, index, e.target.value); }}
                                                   placeholder="Szukaj..." />
                                        </label>
                                        {relationSheetColumnsFiltered?.length ? <select className="priorities__item__condition__select"
                                                                                        value={item.relationSheet}
                                                                                        onChange={(e) => { updateCondition(priorityIndex, index, 'relationSheet', e.target.value); }}>
                                            {relationSheetColumnsFiltered.map((item, index) => {
                                                return <option key={index} value={item}>
                                                    {item}
                                                </option>
                                            })}
                                        </select> : <p className="noOptions">
                                            Nie znaleziono żadnych kolumn
                                        </p>}

                                        {priority?.logicalOperators?.length > index ? <div className="priorities__item__condition__operator">
                                            spójnik logiczny:
                                            <select className="select--logicalOperator" value={priority.logicalOperators[index]}
                                                    onChange={(e) => { updateLogicalOperator(priorityIndex, index, e.target.value); }}>
                                                <option value={0}>i</option>
                                                <option value={1}>lub</option>
                                            </select>
                                        </div> : ''}
                                    </div>
                                })}

                                <button className="btn btn--addCondition"
                                        onClick={() => { addCondition(priorityIndex, 0); }}>
                                    Dodaj warunek
                                </button>
                            </div>
                        })}
                    </div>

                    <button className="btn btn--addPriority"
                            onClick={() => { addPriority(); }}>
                        + Dodaj priorytet
                    </button>

                    <p className="modal__info">
                        Po wykonaniu automatycznego dopasowania - wciąż będziesz mógł samodzielnie zmienić dopasowanie. Dodatkowo system oznaczy kolorami dokładność dopasowania.
                    </p>

                    <div className="modal__additionalOptions">
                        <label className="label">
                            <button className={!overrideAllRows ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                    onClick={() => { setOverrideAllRows(p => !p); }}>

                            </button>
                            dopasuj tylko te rekordy, które jeszcze nie mają żadnego dopasowania
                        </label>
                        <label className="label">
                            <button className={overrideAllRows ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                    onClick={() => { setOverrideAllRows(p => !p); }}>

                            </button>
                            nadpisz wszystkie rekordy, jeśli znajdziesz nowe dopasowanie
                        </label>

                        {overrideAllRows ? <label className="label--marginLeft">
                            <button className={avoidOverrideForManuallyCorrelatedRows ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                    onClick={() => { setAvoidOverrideForManuallyCorrelatedRows(p => !p); }}>

                            </button>
                            pomiń (nie nadpisuj) skorelowania przypisane ręcznie
                        </label> : ''}
                    </div>

                    <button className="btn btn--startAutoMatch"
                            disabled={!priorities.length}
                            onClick={() => { setLoading(true); setTimeout(() => {
                                correlate();
                            }, 1000); }}>
                        Uruchom automatyczne dopasowanie
                    </button>
                </> : <div className="center">
                    <ProgressBar progress={progressCount / relationSheet?.length} />

                    {progressCount === 0 ? <h5 className="center__header">
                        Trwa przesyłanie plików na serwer...
                    </h5> : (progressCount < relationSheet?.length ? <h5 className="center__header">
                        Trwa korelowanie rekordów ({progressCount} / {relationSheet?.length})
                    </h5> : <h5 className="center__header">
                        Trwa przesyłanie wyników...
                    </h5>)}
                </div>}
            </div>
        </div>
    </>
};

export default AutoMatchModal;
