import React from 'react';

const HeaderMenuLink = ({children, href}) => {
    return <a className="header__menu__item"
              href={href}>
        {children}
    </a>
};

export default HeaderMenuLink;
