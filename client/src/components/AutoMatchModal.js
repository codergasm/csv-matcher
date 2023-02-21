import React, {useContext, useEffect} from 'react';
import {ViewContext} from "./CorrelationView";
import {TailSpin} from "react-loader-spinner";

const matchTypes = ['Jeden do jednego', 'Jeden (arkusz 1) do wielu (arkusz 2)',
    'Wiele (arkusz 1) do jednego (arkusz 2),', 'Wiele do wielu'];

const AutoMatchModal = ({dataSheetColumns, relationSheetColumns, closeModal}) => {
    const { priorities, setPriorities, matchType, setMatchType,
        correlate, correlationStatus } = useContext(ViewContext);

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
        if(correlationStatus === 2) {
            closeModal();
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

    useEffect(() => {
        console.log(correlationStatus);
    }, [correlationStatus]);

    return <div className="modal">
        <div className="modal__inner scroll">
            {correlationStatus !== 1 ? <>
                <h3 className="modal__header">
                    Typ dopasowania
                </h3>

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
                                    <select className="priorities__item__condition__select"
                                            value={item.dataSheet}
                                            onChange={(e) => { updateCondition(priorityIndex, index, 'dataSheet', e.target.value); }}>
                                        {dataSheetColumns.map((item, index) => {
                                            return <option key={index} value={item}>
                                                {item}
                                            </option>
                                        })}
                                    </select>
                                    <p className="priorities__item__condition__text">
                                        Szukaj dopasowania w kolumnie arkusza 2:
                                    </p>
                                    <select className="priorities__item__condition__select"
                                            value={item.relationSheet}
                                            onChange={(e) => { updateCondition(priorityIndex, index, 'relationSheet', e.target.value); }}>
                                        {relationSheetColumns.map((item, index) => {
                                            return <option key={index} value={item}>
                                                {item}
                                            </option>
                                        })}
                                    </select>

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

                <button className="btn btn--startAutoMatch"
                        disabled={!priorities.length}
                        onClick={() => { correlate(); }}>
                    Uruchom automatyczne dopasowanie
                </button>
            </> : <div className="center">
                <TailSpin />
                <h5 className="center__header">
                    Trwa korelowanie rekordów...
                </h5>
            </div>}
        </div>
    </div>
};

export default AutoMatchModal;
