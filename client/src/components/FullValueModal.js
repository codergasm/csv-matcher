import React from 'react';

const FullValueModal = ({closeModal, value}) => {
    return <div className="modal modal--cellsFormat">
        <button className="btn btn--closeModal"
                onClick={(e) => { e.stopPropagation(); closeModal(); }}>
            &times;
        </button>

        <div className="modal__inner">
           <div>
               {value}
           </div>
        </div>
    </div>
};

export default FullValueModal;
