import React from 'react';
import ColorMarkedText from "./ColorMarkedText";

const FullValueModal = ({closeModal, indexes, value}) => {
    return <div className="modal modal--cellsFormat">
        <button className="btn btn--closeModal"
                onClick={(e) => { e.stopPropagation(); closeModal(); }}>
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
