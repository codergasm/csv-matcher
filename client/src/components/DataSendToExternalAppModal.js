import React, {useContext} from 'react';
import checkIcon from '../static/img/yes.svg';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import CloseModalButton from "./CloseModalButton";
import {TranslationContext} from "../App";

const DataSendToExternalAppModal = ({closeModal}) => {
    const { content } = useContext(TranslationContext);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    return <div className="modal modal--leaveTeam">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
            <img className="img img--modalWarning" src={checkIcon} alt="check" />

            <p className="modal__header modal__header--text">
                {content.dataSendToExternalAppDone}
            </p>

            <div className="flex flex--twoButtons">
                <button className="btn btn--neutral"
                        onClick={closeModal}>
                    {content.back}
                </button>
            </div>

            <a className="btn btn--afterRegister"
               href="/home">
                {content.backHomepage}
            </a>
        </div>
    </div>
};

export default DataSendToExternalAppModal;
