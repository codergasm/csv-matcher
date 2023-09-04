import React, {useContext} from 'react';
import passwordIcon from "../static/img/password-icon.svg";
import {logout} from "../api/users";
import logoutIcon from "../static/img/logout.svg";
import {TranslationContext} from "../App";
import subscriptionIcon from '../static/img/subscription-model.svg';
import SubscriptionHeaderInfo from "./SubscriptionHeaderInfo";

const PageHeaderDropdownMenu = ({visible, api}) => {
    const { content } = useContext(TranslationContext);

    return visible ? <div className="dropdownMenu shadow">
        <SubscriptionHeaderInfo />

        <a href="/plany"
           className="dropdownMenu__item">
            <img className="img" src={subscriptionIcon} alt="subskrypcja" />
            {content.manageSubscription}
        </a>

        {!api ? <>
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
        </> : ''}
    </div> : '';
}

export default PageHeaderDropdownMenu;
