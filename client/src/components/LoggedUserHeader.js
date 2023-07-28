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

    const displayInApiMode = (i) => {
        return i === 0 || i === 2;
    }

    useActionOnEscapePress(closeDropdownMenu);
    useActionOnMouseClick(closeDropdownMenu);

    return <header className="header">
        <div className="w flex">
            <a className="header__logo"
               href="/home">
                RowMatcher.com
            </a>

            <div className="header__menu flex">
                {content.topMenu.map((item, index) => {
                    if(!api || displayInApiMode(index)) {
                        return <HeaderMenuLink key={index}
                                               href={topMenuLinks[index]}>
                            {item}
                        </HeaderMenuLink>
                    }
                })}

                <button className="header__profileImage"
                        onClick={toggleDropdownMenu}>
                    <img className="img" src={placeholderProfileImage} alt="profilowe" />
                </button>

                {!api ? <PageHeaderDropdownMenu visible={dropdownMenuVisible} /> : ''}
            </div>
        </div>
    </header>
};

export default LoggedUserHeader;
