import React from 'react';

const ButtonSimple = ({children, onClick}) => {
    return <button className="btn btn--selectAll"
                   onClick={onClick}>
        {children}
    </button>
}

export default ButtonSimple;
