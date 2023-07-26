import React, {useContext} from 'react';
import noIcon from '../static/img/no.svg';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import CloseModalButton from "./CloseModalButton";
import {TranslationContext} from "../App";

const OverrideMatchModal = ({closeModal, doOverride}) => {
    const { content } = useContext(TranslationContext);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    const handleSubmit = () => {
        doOverride();
        closeModal();
    }

    return <div className="modal modal--leaveTeam">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
            <img className="img img--modalWarning" src={noIcon} alt="warning" />

            <p className="modal__header modal__header--text">
                {content.overrideMatchAlert}
            </p>

            <div className="flex flex--twoButtons">
                <button className="btn btn--neutral btn--overrideMatch"
                        onClick={handleSubmit}>
                    {content.overrideMatch}
                </button>
                <button className="btn btn--neutral"
                        onClick={closeModal}>
                    {content.cancel}
                </button>
            </div>
        </div>
    </div>
};

export default OverrideMatchModal;
