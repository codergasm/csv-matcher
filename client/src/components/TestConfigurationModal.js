import React, {useContext, useEffect, useState} from 'react';
import {ViewContext} from "./CorrelationView";
import {AppContext} from "../App";

const TestConfigurationModal = ({closeModal, relationSheetColumnsVisibility}) => {
    const { dataSheet, relationSheet } = useContext(AppContext);
    const { showInSelectMenuColumns } = useContext(ViewContext);

    const [dataSheetRowNumber, setDataSheetRowNumber] = useState(1);

    useEffect(() => {
        console.log(dataSheet);
    }, [dataSheet]);

    return <div className="modal modal--testConfiguration">
        <button className="btn btn--closeModal"
                onClick={() => { closeModal(); }}>
            &times;
        </button>

        <div className="modal__inner scroll">
            <div className="modal__top">
                <button className="btn btn--openTestConfigurationModal"
                        onClick={() => { closeModal(); }}>
                    Powrót
                </button>

                <h3 className="modal__header">
                    Przetestuj konfigurację
                </h3>
            </div>

            <div className="modal__line">
                <span>
                    Arkusz - numer wiersza: <input className="input input--number"
                                                   value={dataSheetRowNumber}
                                                   onChange={(e) => { setDataSheetRowNumber(parseInt(e.target.value)); }} />
                </span>
                {dataSheetRowNumber > dataSheet?.length ? <span className="red">
                    Nie ma takiego wiersza. Liczba wierszy w arkuszu 1 to: {dataSheet?.length}
                </span> : ''}

            </div>
        </div>

    </div>
};

export default TestConfigurationModal;
