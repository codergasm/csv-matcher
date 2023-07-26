import React, {useContext} from 'react';
import {TranslationContext} from "../App";

const SheetFileAddedView = ({removeFile}) => {
    const { content } = useContext(TranslationContext);

    return <>
        <p className="sheetLoaded__text">
            {content.fileAdded}
        </p>
        <button className="btn btn--remove"
                onClick={removeFile}>
            {content.delete}
        </button>
    </>
};

export default SheetFileAddedView;
