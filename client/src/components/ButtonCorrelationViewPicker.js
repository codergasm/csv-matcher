import React, {useContext} from 'react';
import {ViewContext} from "./CorrelationView";

const ButtonCorrelationViewPicker = ({children, index, fileName}) => {
    const { currentSheet, setCurrentSheet } = useContext(ViewContext);

    return <button className={currentSheet === index ? "btn btn--correlationViewPicker btn--correlationViewPicker--current" : "btn btn--correlationViewPicker"}
                   onClick={() => { setCurrentSheet(index); }}>
        {children}

        {fileName ? <span className="fileNameInfo">
            Wczytany plik: <span className="bold">{fileName}</span>
        </span> : ''}
    </button>
};

export default ButtonCorrelationViewPicker;
