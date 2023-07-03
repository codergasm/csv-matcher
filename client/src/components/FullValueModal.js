import React from 'react';
import ColorMarkedText from "./ColorMarkedText";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";

const FullValueModal = ({closeModal, indexes, value}) => {
    const closeModalWrapper = (e) => {
        e?.stopPropagation();
        closeModal();
    }

    useCloseModalOnOutsideClick(closeModalWrapper);
    useActionOnEscapePress(closeModalWrapper);

    return <div className="modal modal--cellsFormat">
        <button className="btn btn--closeModal"
                onClick={closeModalWrapper}>
            &times;
        </button>

        <div className="modal__inner">
           <div>
               <ColorMarkedText string={value}
                                indexes={indexes || []} />
           </div>
        </div>
    </div>
};

export default FullValueModal;
