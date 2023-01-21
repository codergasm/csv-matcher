import React, {useState} from 'react';

const AutoMatchModal = ({dataSheetColumns, relationSheetColumns}) => {
    const [matchType, setMatchType] = useState(0);
    const [priorities, setPriorities] = useState([]);

    const matchTypes = ['Jeden do jednego', 'Jeden (arkusz 1) do wielu (arkusz 2)',
        'Wiele (arkusz 1) do jednego (arkusz 2),', 'Wiele do wielu'];

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

    const updateCondition = () => {

    }

    return <div className="modal">
        <div className="modal__inner scroll">
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

            <button className="btn btn--addPriority"
                    onClick={() => { addPriority(); }}>
                Dodaj priorytet
            </button>
        </div>
    </div>
};

export default AutoMatchModal;
