import React from 'react';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import CloseModalButton from "./CloseModalButton";
import noIcon from "../static/img/no.svg";

const AlertNotTeamOwnerModal = ({closeModal}) => {
    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    return <div className="modal modal--alertNotTeamOwner">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
            <img className="img img--modalWarning" src={noIcon} alt="ostrzezenie" />

            <p className="modal__header modal__header--text">
                Tylko administrator zespołu może wykupić abonament - skontaktuj się z nim, lub stwórz własny zespół
                uprzednio odchodząc z obecnego.
            </p>

            <a href="/zespol" className="btn btn--neutral btn--alertNotTeamMember">
                Przejdź do zespołu
            </a>
        </div>
    </div>
};

export default AlertNotTeamOwnerModal;
