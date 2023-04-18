import React from 'react';

const ColorMarkedText = ({string, indexes}) => {
    return <>
        {string ? string.split('').map((item, index) => {
            if(indexes.includes(index)) {
                return string[index] === ' ' ? <span className="color emptySpan" key={index}>
                    {string[index]}
                </span> : <span className="color" key={index}>
                    {string[index]}
                </span>
            }
            else {
                return string[index] === ' ' ? <span className="notColor emptySpan" key={index}>
                    {string[index]}
                </span> : <span className="notColor" key={index}>
                    {string[index]}
                </span>
            }
        }) : ''}
    </>;
}

export default ColorMarkedText;
