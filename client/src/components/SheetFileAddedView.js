import React from 'react';

const SheetFileAddedView = ({removeFile}) => {
    return <>
        <p className="sheetLoaded__text">
            Plik został dodany
        </p>
        <button className="btn btn--remove"
                onClick={removeFile}>
            Usuń
        </button>
    </>
};

export default SheetFileAddedView;
