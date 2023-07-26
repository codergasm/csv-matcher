import React, {useContext} from 'react';
import checkIcon from '../static/img/yes.svg';
import CloseModalButton from "./CloseModalButton";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import {TranslationContext} from "../App";

const FileSavedModal = ({closeModal}) => {
    const { content } = useContext(TranslationContext);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    return <div className="modal modal--fileSaved">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
            <img className="img img--modalWarning" src={checkIcon} alt="check" />

           <h2 className="modal__header">
               {content.fileAdded}
           </h2>

            <button className="btn btn--backToHomepage"
                    onClick={closeModal}>
                {content.back}
            </button>
        </div>
    </div>
};

export default FileSavedModal;
