import React, {useContext, useEffect, useState} from 'react';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import CloseModalButton from "./CloseModalButton";
import {TranslationContext} from "../App";

const SelectMenuSettingsModal = ({closeModal, columnsNames, columns, setColumns,
                                  visibleColumns, header, warning}) => {
    const { content } = useContext(TranslationContext);

    const [showOnlyVisibleColumns, setShowOnlyVisibleColumns] = useState(false);
    const [warningExist, setWarningExist] = useState(false);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    useEffect(() => {
        if(warning) {
            setWarningExist(true);
        }
    }, [warning]);

    const handleColumnsChange = (i) => {
        setColumns(prevState => {
            return prevState.map((item, index) => {
                return index === i ? !item : item;
            });
        });
    }

    return <div className="modal modal--selectMenuSettings">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner modal__inner--columnsSettings scroll">
            {warningExist ? <h3 className="modal__header modal__header--center">
                {content.noColumnsInSelectMenu}
            </h3> : ''}

            <h3 className={warningExist ? "modal__header modal__header--center modal__header--marginTop" : "modal__header modal__header--center"}>
                {warningExist ? content.checkColumnsForSelectMenu : header}
            </h3>

            <div className="flex modal__inner__selectButtons">
                <button className={showOnlyVisibleColumns ? "btn btn--selectAll btn--selectAll--modal btn--selectAll--selected" : "btn btn--selectAll btn--selectAll--modal"}
                        onClick={() => { setShowOnlyVisibleColumns(true); }}>
                    {content.onlyVisibleColumns}
                </button>
                <button className={!showOnlyVisibleColumns ? "btn btn--selectAll btn--selectAll--modal btn--selectAll--selected" : "btn btn--selectAll btn--selectAll--modal"}
                        onClick={() => { setShowOnlyVisibleColumns(false); }}>
                    {content.showAllColumns}
                </button>
            </div>

            <div className="modal__inner__columns">
                {columnsNames.map((item, index) => {
                    if(!showOnlyVisibleColumns || visibleColumns[index]) {
                        return <label className="modal__inner__column"
                                      key={index}>
                            <span className="modal__inner__column__name">
                                {item}
                            </span>

                            <button className={columns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                    onClick={() => { handleColumnsChange(index); }}>

                            </button>
                        </label>
                    }
                })}
            </div>

            <button className="btn btn--modalConfirm"
                    onClick={closeModal}>
                {content.close}
            </button>
        </div>
    </div>
}

export default SelectMenuSettingsModal;
