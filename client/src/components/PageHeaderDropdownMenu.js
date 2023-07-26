import React, {useContext} from 'react';
import passwordIcon from "../static/img/password-icon.svg";
import {logout} from "../api/users";
import logoutIcon from "../static/img/logout.svg";
import {TranslationContext} from "../App";

const PageHeaderDropdownMenu = ({visible}) => {
    const { content } = useContext(TranslationContext);

    return visible ? <div className="dropdownMenu shadow">
        <a href="/zmien-haslo"
           className="dropdownMenu__item">
            <img className="img" src={passwordIcon} alt="change-password" />
            {content.topDropdownMenu[0]}
        </a>
        <button className="dropdownMenu__item"
                onClick={logout}>
            <img className="img" src={logoutIcon} alt="logout" />
            {content.topDropdownMenu[1]}
        </button>
    </div> : '';
}

export default PageHeaderDropdownMenu;
