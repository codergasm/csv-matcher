import React, {useContext} from 'react';
import {ViewContext} from "./CorrelationView";

const ButtonCorrelationViewPicker = ({children, index}) => {
    const { currentSheet, setCurrentSheet } = useContext(ViewContext);

    return <button className={currentSheet === index ? "btn btn--correlationViewPicker btn--correlationViewPicker--current" : "btn btn--correlationViewPicker"}
                   onClick={() => { setCurrentSheet(index); }}>
        {children}
    </button>
};

export default ButtonCorrelationViewPicker;
