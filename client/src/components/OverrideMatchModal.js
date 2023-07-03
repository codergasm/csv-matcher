import React from 'react';
import noIcon from '../static/img/no.svg';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";

const OverrideMatchModal = ({closeModal, doOverride}) => {
    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    const handleSubmit = () => {
        doOverride();
        closeModal();
    }

    return <div className="modal modal--leaveTeam">
        <button className="btn btn--closeModal"
                onClick={closeModal}>
            &times;
        </button>

        <div className="modal__inner">
            <img className="img img--modalWarning" src={noIcon} alt="ostrzezenie" />

            <p className="modal__header modal__header--text">
                Rekord jest już przypisany. Czy na pewno chcesz nadpisać przypisanie?
            </p>

            <div className="flex flex--twoButtons">
                <button className="btn btn--neutral btn--overrideMatch"
                        onClick={handleSubmit}>
                    Nadpisz przypisanie
                </button>
                <button className="btn btn--neutral"
                        onClick={closeModal}>
                    Anuluj
                </button>
            </div>
        </div>
    </div>
};

export default OverrideMatchModal;
