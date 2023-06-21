import React from 'react';

const LinkTile = ({href, icon, children}) => {
    return <a className="homepage__menu__item shadow"
              href={href}>
        <img className="img" src={icon} alt={children} />

        <span>
            {children}
        </span>
    </a>
};

export default LinkTile;
