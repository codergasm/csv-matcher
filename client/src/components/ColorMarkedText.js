import React from 'react';

const ColorMarkedText = ({string, indexes}) => {
    return <>
        {string ? string.split('').map((item, index) => {
            if(indexes.includes(index)) {
                return string[index] === ' ' ? <span className="color emptySpan">
                    {string[index]}
                </span> : <span className="color">
                    {string[index]}
                </span>
            }
            else {
                return string[index] === ' ' ? <span className="notColor emptySpan">
                    {string[index]}
                </span> : <span className="notColor">
                    {string[index]}
                </span>
            }
        }) : ''}
    </>;
}

export default ColorMarkedText;
