import React, {useContext} from 'react';
import noIcon from '../static/img/no.svg';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import CloseModalButton from "./CloseModalButton";
import {TranslationContext} from "../App";

const SchemaChangedAndNotSavedModal = ({closeModal, handleSubmit}) => {
    const { content } = useContext(TranslationContext);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    return <div className="modal modal--leaveTeam">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
            <img className="img img--modalWarning" src={noIcon} alt="ostrzezenie" />

            <p className="modal__header modal__header--text">
                {content.apiModeSchemaNotSavedAlert}
            </p>

            <div className="flex flex--twoButtons">
                <button className="btn btn--leaveTeam"
                        onClick={handleSubmit}>
                    {content.next}
                </button>
                <button className="btn btn--neutral"
                        onClick={closeModal}>
                    {content.back}
                </button>
            </div>
        </div>
    </div>
};

export default SchemaChangedAndNotSavedModal;
