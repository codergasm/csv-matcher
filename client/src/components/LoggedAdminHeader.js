import React, {useContext, useState} from 'react';
import {TranslationContext} from "../App";
import {ApiContext} from "./LoggedUserWrapper";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import useActionOnMouseClick from "../hooks/useActionOnMouseClick";
import HeaderMenuLink from "./HeaderMenuLink";
import placeholderProfileImage from "../static/img/user-placeholder.svg";
import AdminHeaderDropdownMenu from "./AdminHeaderDropdownMenu";

const topMenuLinks = ['/transakcje'];

const LoggedAdminHeader = () => {
    const { content } = useContext(TranslationContext);
    const { api } = useContext(ApiContext);

    const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

    const closeDropdownMenu = () => {
        setDropdownMenuVisible(false);
    }

    const toggleDropdownMenu = (e) => {
        e.stopPropagation();
        setDropdownMenuVisible(p => !p);
    }

    useActionOnEscapePress(closeDropdownMenu);
    useActionOnMouseClick(closeDropdownMenu);

    return <header className="header">
        <div className="w flex">
            <a className="header__logo"
               href="/transakcje">
                RowMatcher.com
            </a>

            <div className={api ? "header__menu header__menu--end flex" : "header__menu flex"}>
                {!api ? content.topMenuAdmin.map((item, index) => {
                    return <HeaderMenuLink key={index}
                                           href={topMenuLinks[index]}>
                        {item}
                    </HeaderMenuLink>
                }) : ''}

                <div className="header__right">
                    <button className="header__profileImage"
                            onClick={toggleDropdownMenu}>
                        <img className="img" src={placeholderProfileImage} alt="profilowe" />
                    </button>

                    <AdminHeaderDropdownMenu visible={dropdownMenuVisible} />
                </div>
            </div>
        </div>
    </header>
};

export default LoggedAdminHeader;
