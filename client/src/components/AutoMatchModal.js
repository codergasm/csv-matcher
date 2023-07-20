import React, {useContext, useEffect, useState} from 'react';
import {ViewContext} from "./CorrelationView";
import ReactSlider from 'react-slider'
import TestConfigurationModal from "./TestConfigurationModal";
import ProgressBar from "./ProgressBar";
import {AppContext} from "../pages/CorrelationPage";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";

const matchTypes = ['Jeden do jednego', 'Jeden (arkusz 1) do wielu (arkusz 2)',
    'Wiele (arkusz 1) do jednego (arkusz 2),', 'Wiele do wielu'];
const matchFunctions = ['Dopasowanie stringów',
    'Pokrycie wartości z ark. 1 w ark. 2', 'Pokrycie wartości z ark. 2 w ark. 1'];

const AutoMatchModal = ({dataSheetColumns, relationSheetColumns, closeModal, columnsVisibility, user}) => {
    const { relationSheet } = useContext(AppContext);
    const { priorities, setPriorities, matchType, setMatchType, progressCount,
        correlate, correlationStatus, overrideAllRows, setOverrideAllRows,
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
                requiredConditions: 1,
                conditions: [
                    {
                        dataSheet: 'name',
                        relationSheet: 'product_name',
                        matchThreshold: 60,
                        matchFunction: 2,
                        required: 0,
                    },
                    {
                        dataSheet: 'index',
                        relationSheet: 'inx',
                        matchThreshold: 100,
                        matchFunction: 0,
                        required: 1,
                    }
                ]
            }
        ]
     */

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

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
                requiredConditions: 1,
                conditions:  [
                    {
                        dataSheet: dataSheetColumns[1],
                        relationSheet: relationSheetColumns[1],
                        matchThreshold: 90,
                        matchFunction: 0,
                        required: 1
                    }
                ]
            }];
        });
    }

    const updateNumberOfRequiredConditions = (priorityIndex, val) => {
        setPriorities(prevState => {
            return prevState.map((item, index) => {
                if(index === priorityIndex) {
                    return {
                        ...item,
                        requiredConditions: Math.max(val, 1)
                    }
                }
                else {
                    return item;
                }
            });
        });
    }

    const addCondition = (priorityIndex) => {
        setPriorities(prevState => {
            return prevState.map((item, index) => {
                if(priorityIndex === index) {
                    return {
                        ...item,
                        conditions: [...item.conditions, {
                            dataSheet: dataSheetColumns[1],
                            relationSheet: relationSheetColumns[1],
                            matchThreshold: 90,
                            matchFunction: 0,
                            required: 0
                        }]
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

    const updateConditionProperty = (priority, condition, name, val) => {
        setPriorities(prevState => {
            return prevState.map((item, index) => {
                if(index === priority) {
                    return {
                        ...item,
                        conditions: item.conditions.map((item, index) => {
                            if(index === condition) {
                                return {
                                    ...item,
                                    [name]: val
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
            });
        });
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
                        ...item,
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

    useEffect(() => {
        if((dataSheetColumnsFiltered?.length) && (dataSheetColumnsFiltered.length !== dataSheetColumns.length - 1)) {
            updateCondition(currentDataSheetPriorityIndex, currentDataSheetIndex, 'dataSheet', dataSheetColumnsFiltered[0]);
        }
    }, [dataSheetColumnsFiltered]);

    useEffect(() => {
        if((relationSheetColumnsFiltered?.length) && (relationSheetColumnsFiltered.length !== relationSheetColumns.length - 1)) {
            updateCondition(currentRelationSheetPriorityIndex, currentRelationSheetIndex, 'relationSheet', relationSheetColumnsFiltered[0]);
        }
    }, [relationSheetColumnsFiltered]);

    const updateDataSheetSearch = (priorityIndex, conditionIndex, val) => {
        setCurrentDataSheetPriorityIndex(priorityIndex);
        setCurrentDataSheetIndex(conditionIndex);
        setDataSheetSearch(val);
    }

    const updateRelationSheetSearch = (priorityIndex, conditionIndex, val) => {
        setCurrentRelationSheetPriorityIndex(priorityIndex);
        setCurrentRelationSheetIndex(conditionIndex);
        setRelationSheetSearch(val);
    }

    return <div className="modal modal--autoMatch">
        {testConfigurationModalVisible ? <TestConfigurationModal relationSheetColumnsVisibility={columnsVisibility}
                                                                 user={user}
                                                                 closeModal={() => { setTestConfigurationModalVisible(false); }} /> : ''}

        <button className="btn btn--closeModal"
                onClick={closeModal}>
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
                    Kroki dopasowania
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
                                Krok {index+1}
                            </h3>

                            <p className="priorities__item__condition__text">
                                Minimalna ilość warunków, które muszą spełniać próg procentowy %
                                aby krok uznać za spełniony:
                            </p>
                            <div className="center numberOfRequiredConditionsLabel">
                                <button className="btn btn--numberOfRequiredConditions center"
                                        onClick={() => { updateNumberOfRequiredConditions(priorityIndex, item.requiredConditions-1); }}>
                                    -
                                </button>
                                <input className="input input--numberOfRequiredConditions center"
                                       type="number"
                                       disabled={true}
                                       value={item?.requiredConditions}
                                       onChange={(e) => { updateNumberOfRequiredConditions(priorityIndex, e.target.value); }} />
                                <button className="btn btn--numberOfRequiredConditions center"
                                        onClick={() => { updateNumberOfRequiredConditions(priorityIndex, item.requiredConditions+1); }}>
                                    +
                                </button>
                            </div>

                            {item.conditions.map((item, index) => {
                                const conditionIndex = index;
                                const conditionMatchFunction = item.matchFunction;
                                const conditionMatchThreshold = item.matchThreshold;

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

                                    <h3 className="priorities__item__condition__text regular">
                                        Funkcja dopasowania
                                    </h3>

                                    <select className="select--logicalOperator select--matchFunction"
                                            value={conditionMatchFunction}
                                            onChange={(e) => { updateConditionProperty(priorityIndex, conditionIndex, 'matchFunction', e.target.value); }}>
                                        {matchFunctions.map((item, index) => {
                                            return <option key={index} value={index}>
                                                {item}
                                            </option>
                                        })}
                                    </select>

                                    <h3 className="priorities__item__condition__text regular">
                                        Przypisuj, jeśli dopasowanie procentowe jest większe niż
                                    </h3>

                                    <div className="modal__slider">
                                        <ReactSlider className="horizontal-slider"
                                                     thumbClassName="thumb"
                                                     trackClassName="track"
                                                     value={!isNaN(conditionMatchThreshold) ? conditionMatchThreshold : 0}
                                                     onChange={(val) => { updateConditionProperty(priorityIndex, conditionIndex, 'matchThreshold', val); }} />

                                        <div className="modal__slider__value">
                                            <input className="input--matchThreshold"
                                                   type="number"
                                                   value={conditionMatchThreshold}
                                                   onChange={(e) => { updateConditionProperty(priorityIndex, conditionIndex, 'matchThreshold', e.target.value); }} />
                                            <span className="modal__slider__value__percent">
                                                %
                                            </span>
                                        </div>
                                    </div>

                                    {priority.conditions.length > 1 ? <div className="priorities__item__condition__operator">
                                        warunek jest:
                                        <select className="select--logicalOperator" value={priority.conditions[index].required}
                                                onChange={(e) => { updateConditionProperty(priorityIndex, conditionIndex, 'required', e.target.value); }}>
                                            <option value={0}>opcjonalny</option>
                                            <option value={1}>wymagany</option>
                                        </select>
                                    </div> : ''}
                                </div>
                            })}

                            <button className="btn btn--addCondition"
                                    onClick={() => { addCondition(priorityIndex); }}>
                                Dodaj warunek
                            </button>
                        </div>
                    })}
                </div>

                <button className="btn btn--addPriority"
                        onClick={addPriority}>
                    + Dodaj krok
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
};

export default AutoMatchModal;
