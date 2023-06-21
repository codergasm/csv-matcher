import React from 'react';

const CloseModalButton = ({onClick}) => {
    const handleModalClose = (e) => {
        e.stopPropagation();
        onClick();
    }

    return <button className="btn btn--closeModal"
                   onClick={handleModalClose}>
        &times;
    </button>
};

export default CloseModalButton;
