import React from 'react';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";

const ColumnsSettingsModal = ({closeModal, columnsNames, columns, setColumns,
                                  header, hideFirstColumn, extraIndex}) => {
    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    const handleColumnsChange = (i) => {
        setColumns(prevState => {
            return prevState.map((item, index) => {
                return index === i ? !item : item;
            });
        });
    }

    const removeAllColumns = () => {
        setColumns(prevState => (prevState.map(() => false)));
    }

    const selectAllColumns = () => {
        setColumns(prevState => (prevState.map(() => true)));
    }

    return <div className="modal">
        <button className="btn btn--closeModal"
                onClick={closeModal}>
            &times;
        </button>

        <div className="modal__inner modal__inner--columnsSettings scroll">
            <h3 className="modal__header modal__header--center">
                {header}
            </h3>

            <div className="flex modal__inner__selectButtons">
                <button className="btn btn--selectAll btn--selectAll--modal"
                        onClick={selectAllColumns}>
                    Zaznacz wszystkie
                </button>
                <button className="btn btn--selectAll btn--selectAll--modal"
                        onClick={removeAllColumns}>
                    Odznacz wszystkie
                </button>
            </div>

            <div className="modal__inner__columns">
                {columnsNames.map((item, index) => {
                    if(!hideFirstColumn || index !== 0) {
                        return <label className="modal__inner__column"
                                      key={index}>
                            <span className="modal__inner__column__name">
                                {item}
                            </span>

                            <button className={columns[hideFirstColumn ? index-(!isNaN(extraIndex) ? 0 : 1) : index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                    onClick={() => { handleColumnsChange(index+(!isNaN(extraIndex) ? extraIndex : 0)); }}>

                            </button>
                        </label>
                    }
                    else {
                        return '';
                    }
                })}
            </div>

            <button className="btn btn--modalConfirm"
                    onClick={closeModal}>
                Zamknij
            </button>
        </div>
    </div>
};

export default ColumnsSettingsModal;
