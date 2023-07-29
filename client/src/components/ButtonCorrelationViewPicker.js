import React, {useContext} from 'react';
import {ViewContext} from "./CorrelationView";
import {TranslationContext} from "../App";

const ButtonCorrelationViewPicker = ({children, index, fileName, numberOfRecords}) => {
    const { content } = useContext(TranslationContext);
    const { currentSheet, setCurrentSheet } = useContext(ViewContext);

    return <button className={currentSheet === index ? "btn btn--correlationViewPicker btn--correlationViewPicker--current" : "btn btn--correlationViewPicker"}
                   onClick={() => { setCurrentSheet(index); }}>
        {children}

        {fileName ? <span className="fileNameInfo">
            {content.loadedFile}: <span className="bold">{fileName}</span>
        </span> : ''}

        {numberOfRecords ? <span className="fileNameInfo">
            {content.numberOfRecords}: <span className="bold">{numberOfRecords}</span>
        </span> : ''}
    </button>
};

export default ButtonCorrelationViewPicker;
