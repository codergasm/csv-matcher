import React, {useContext} from 'react';
import {TranslationContext} from "../App";

const AfterFormSubmitView = ({children}) => {
    const { content } = useContext(TranslationContext);

    return <div className="afterRegister shadow">
        <h4 className="afterRegister__header">
            {children}
        </h4>

        <a className="btn btn--afterRegister"
           href="/home">
            {content.homepage}
        </a>
    </div>
};

export default AfterFormSubmitView;
