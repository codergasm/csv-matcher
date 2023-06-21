import React from 'react';

const AfterFormSubmitView = ({children}) => {
    return <div className="afterRegister shadow">
        <h4 className="afterRegister__header">
            {children}
        </h4>

        <a className="btn btn--afterRegister"
           href="/home">
            Strona główna
        </a>
    </div>
};

export default AfterFormSubmitView;
