import React, {useContext} from 'react';
import passwordIcon from "../static/img/password-icon.svg";
import {logout} from "../api/users";
import logoutIcon from "../static/img/logout.svg";
import subscriptionIcon from '../static/img/subscription-model.svg';
import SubscriptionHeaderInfo from "./SubscriptionHeaderInfo";

const PageHeaderDropdownMenu = ({visible}) => {
    return visible ? <div className="dropdownMenu shadow">
        <SubscriptionHeaderInfo />

        <a href="/plany"
           className="dropdownMenu__item">
            <img className="img" src={subscriptionIcon} alt="subskrypcja" />
            Zarządzaj subskrypcją
        </a>
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
