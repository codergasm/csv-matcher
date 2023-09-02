import React from 'react';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import CloseModalButton from "./CloseModalButton";
import noIcon from "../static/img/no.svg";

const AlertNotTeamMemberModal = ({closeModal}) => {
    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    return <div className="modal modal--alertNotTeamMember">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
            <img className="img img--modalWarning" src={noIcon} alt="ostrzezenie" />

            <p className="modal__header modal__header--text">
                Tylko zespoły mogą korzystać z płatnego planu. Jeżeli Twoi współpracownicy korzystają już z rowMatcher
                - niech dodadzą Cię do swojego zespołu. Płatność za plan dokonuje zawsze administrator zespołu.
            </p>

            <p className="modal__header modal__header--text">
                Załóż swój zespół - jeśli zamierzasz korzystać z rowMatcher samodzielnie,
                lub jeśli zamierzasz jako administrator dodać w przyszłości użytkowników.
            </p>

            <a href="/zespol" className="btn btn--neutral btn--alertNotTeamMember">
                Utwórz zespół (na razie jednoosobowy)
            </a>
        </div>
    </div>
};

export default AlertNotTeamMemberModal;
