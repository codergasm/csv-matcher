import React, {useContext} from 'react';
import {TranslationContext} from "../App";
import logoutIcon from "../static/img/logout.svg";
import {logoutAdmin} from "../api/admin";

const AdminHeaderDropdownMenu = ({visible}) => {
    const { content } = useContext(TranslationContext);

    return visible ? <div className="dropdownMenu shadow">
        <button className="dropdownMenu__item"
                onClick={logoutAdmin}>
            <img className="img" src={logoutIcon} alt="logout" />
            {content.topDropdownMenu[1]}
        </button>
    </div> : '';
};

export default AdminHeaderDropdownMenu;
