import React from 'react';
import passwordIcon from "../static/img/password-icon.svg";
import {logout} from "../api/users";
import logoutIcon from "../static/img/logout.svg";

const PageHeaderDropdownMenu = ({visible}) => {
    return visible ? <div className="dropdownMenu shadow">
        <a href="/zmien-haslo"
           className="dropdownMenu__item">
            <img className="img" src={passwordIcon} alt="haslo" />
            Zmień hasło
        </a>
        <button className="dropdownMenu__item"
                onClick={logout}>
            <img className="img" src={logoutIcon} alt="wylogowanie" />
            Wyloguj się
        </button>
    </div> : '';
}

export default PageHeaderDropdownMenu;
