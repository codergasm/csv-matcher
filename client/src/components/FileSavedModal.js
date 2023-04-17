import React from 'react';
import checkIcon from '../static/img/yes.svg';

const FileSavedModal = ({closeModal}) => {
    return <div className="modal modal--fileSaved">
        <button className="btn btn--closeModal"
                onClick={(e) => { e.stopPropagation(); closeModal(); }}>
            &times;
        </button>

        <div className="modal__inner">
            <img className="img img--modalWarning" src={checkIcon} alt="potwierdzenie" />

           <h2 className="modal__header">
               Plik został dodany
           </h2>

            <button className="btn btn--backToHomepage"
                    onClick={() => { closeModal(); }}>
                Powrót
            </button>
        </div>
    </div>
};

export default FileSavedModal;
