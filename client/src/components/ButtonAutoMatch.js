import React from 'react';

const ButtonAutoMatch = ({onClick, children}) => {
    return <button className="btn btn--autoMatch"
                   onClick={onClick}>
        {children}
    </button>
};

export default ButtonAutoMatch;
