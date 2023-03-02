import React, {useContext} from 'react';
import {ViewContext} from "./CorrelationView";

const TestConfigurationModal = ({closeModal}) => {
    const { dataSheet, relationSheet } = useContext(ViewContext);

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
        </div>

    </div>
};

export default TestConfigurationModal;
