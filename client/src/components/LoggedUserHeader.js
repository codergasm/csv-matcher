import React, {useState} from 'react';
import placeholderProfileImage from '../static/img/user-placeholder.svg';
import PageHeaderDropdownMenu from "./PageHeaderDropdownMenu";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import useActionOnMouseClick from "../hooks/useActionOnMouseClick";
import HeaderMenuLink from "./HeaderMenuLink";

const LoggedUserHeader = () => {
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

            <div className="header__menu flex">
                <HeaderMenuLink href={'/home'}>
                    Home
                </HeaderMenuLink>
                <HeaderMenuLink href={'/pliki'}>
                    Moje pliki
                </HeaderMenuLink>
                <HeaderMenuLink href={'/schematy-dopasowania'}>
                    Moje schematy
                </HeaderMenuLink>
                <HeaderMenuLink href={'/edytor-dopasowania'}>
                    Nowe dopasowanie
                </HeaderMenuLink>
                <HeaderMenuLink href={'/zespol'}>
                    Zespół
                </HeaderMenuLink>
                <HeaderMenuLink href={'/plany'}>
                    Plany
                </HeaderMenuLink>

                <button className="header__profileImage"
                        onClick={toggleDropdownMenu}>
                    <img className="img" src={placeholderProfileImage} alt="profilowe" />
                </button>

                <PageHeaderDropdownMenu visible={dropdownMenuVisible} />
            </div>
        </div>
    </header>
};

export default LoggedUserHeader;
