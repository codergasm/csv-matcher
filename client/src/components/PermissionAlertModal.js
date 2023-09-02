import React from 'react';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import CloseModalButton from "./CloseModalButton";
import lockIcon from "../static/img/padlock.svg";

const PermissionAlertModal = ({children, closeModal, content}) => {
    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    return <div className="modal modal--alertNotTeamMember">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
            <img className="img img--modalWarning img--padlock" src={lockIcon} alt="ostrzezenie" />

            {children ? children : <p className="modal__header modal__header--text">
                {content}
            </p>}

            <button className="btn btn--neutral btn--alertNotTeamMember"
                    onClick={closeModal}>
                Ok
            </button>
        </div>
    </div>
}

export default PermissionAlertModal;
