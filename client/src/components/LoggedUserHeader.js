import React, {useState} from 'react';
import placeholderProfileImage from '../static/img/user-placeholder.svg';
import PageHeaderDropdownMenu from "./PageHeaderDropdownMenu";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import useActionOnMouseClick from "../hooks/useActionOnMouseClick";

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
            <a className="header__logo" href="/home">
                RowMatcher.com
            </a>

            <div className="header__menu flex">
                <a className="header__menu__item"
                   href="/home">
                    Home
                </a>
                <a className="header__menu__item"
                   href="/pliki">
                    Moje pliki
                </a>
                <a className="header__menu__item"
                   href="/schematy-dopasowania">
                    Moje schematy
                </a>
                <a className="header__menu__item"
                   href="/edytor-dopasowania">
                    Nowe dopasowanie
                </a>
                <a className="header__menu__item"
                   href="/zespol">
                    Zespół
                </a>

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
