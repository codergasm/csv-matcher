import React from 'react';

const ButtonTile = ({onClick, children, icon}) => {
    return <button className="homepage__menu__item shadow"
                   onClick={onClick}>
        <img className="img" src={icon} alt={children} />

        <span>
            {children}
        </span>
    </button>
};

export default ButtonTile;
