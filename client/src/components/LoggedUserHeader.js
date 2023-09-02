import React, {useContext, useState} from 'react';
import placeholderProfileImage from '../static/img/user-placeholder.svg';
import PageHeaderDropdownMenu from "./PageHeaderDropdownMenu";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import useActionOnMouseClick from "../hooks/useActionOnMouseClick";
import HeaderMenuLink from "./HeaderMenuLink";
import {TranslationContext} from "../App";
import {ApiContext} from "./LoggedUserWrapper";

const topMenuLinks = ['/home', '/pliki', '/schematy-dopasowania', '/edytor-dopasowania', '/zespol'];

const LoggedUserHeader = () => {
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
               href="/home">
                RowMatcher.com
            </a>

            <div className={api ? "header__menu header__menu--end flex" : "header__menu flex"}>
                {!api ? content.topMenu.map((item, index) => {
                    return <HeaderMenuLink key={index}
                                           href={topMenuLinks[index]}>
                        {item}
                    </HeaderMenuLink>
                }) : ''}

                <button className="header__profileImage"
                        onClick={toggleDropdownMenu}>
                    <img className="img" src={placeholderProfileImage} alt="profilowe" />
                </button>

                <PageHeaderDropdownMenu visible={dropdownMenuVisible}
                                        api={api} />
            </div>
        </div>
    </header>
};

export default LoggedUserHeader;
