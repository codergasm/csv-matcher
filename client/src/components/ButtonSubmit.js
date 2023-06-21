import React from 'react';

const ButtonSubmit = ({children, onClick}) => {
    return <button className="btn btn--submitForm"
                   onClick={onClick}>
        {children}
    </button>
};

export default ButtonSubmit;
