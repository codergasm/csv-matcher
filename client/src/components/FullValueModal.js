import React from 'react';
import ColorMarkedText from "./ColorMarkedText";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import CloseModalButton from "./CloseModalButton";

const FullValueModal = ({closeModal, indexes, value}) => {
    const closeModalWrapper = (e) => {
        e?.stopPropagation();
        closeModal();
    }

    useCloseModalOnOutsideClick(closeModalWrapper);
    useActionOnEscapePress(closeModalWrapper);

    return <div className="modal modal--cellsFormat">
        <CloseModalButton onClick={closeModalWrapper} />

        <div className="modal__inner">
           <div>
               <ColorMarkedText string={value}
                                indexes={indexes || []} />
           </div>
        </div>
    </div>
};

export default FullValueModal;
