import React, {useContext} from 'react';
import {TranslationContext} from "../App";
import {ApiContext} from "./LoggedUserWrapper";

const SheetFileAddedView = ({removeFile}) => {
    const { content } = useContext(TranslationContext);
    const { api } = useContext(ApiContext);

    return <>
        <p className="sheetLoaded__text">
            {content.fileAdded}
        </p>
        {!api ? <button className="btn btn--remove"
                        onClick={removeFile}>
            {content.delete}
        </button> : ''}
    </>
};

export default SheetFileAddedView;
