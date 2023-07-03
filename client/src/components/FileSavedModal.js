import React from 'react';
import checkIcon from '../static/img/yes.svg';
import CloseModalButton from "./CloseModalButton";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";

const FileSavedModal = ({closeModal}) => {
    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    return <div className="modal modal--fileSaved">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
            <img className="img img--modalWarning" src={checkIcon} alt="potwierdzenie" />

           <h2 className="modal__header">
               Plik został dodany
           </h2>

            <button className="btn btn--backToHomepage"
                    onClick={closeModal}>
                Powrót
            </button>
        </div>
    </div>
};

export default FileSavedModal;
