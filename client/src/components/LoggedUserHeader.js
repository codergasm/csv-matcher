import React, {useEffect, useState} from 'react';
import placeholderProfileImage from '../static/img/user-placeholder.svg';
import passwordIcon from '../static/img/password-icon.svg';
import logoutIcon from '../static/img/logout.svg';
import {logout} from "../helpers/users";

const LoggedUserHeader = () => {
    const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

    useEffect(() => {
        document.addEventListener('click', () => {
            setDropdownMenuVisible(false);
        });

        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') {
                setDropdownMenuVisible(false);
            }
        });
    }, []);

    return <header className="header">
        <div className="w flex">
            <a className="header__logo" href="/home">
                RowMatcher.com
            </a>

            <div className="header__menu flex">
                <a className="header__menu__item"
                   href="/zespol">
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
                        onClick={(e) => { e.stopPropagation(); setDropdownMenuVisible(p => !p); }}>
                    <img className="img" src={placeholderProfileImage} alt="profilowe" />
                </button>

                {dropdownMenuVisible ? <div className="dropdownMenu shadow">
                    <a href="/zmien-haslo"
                       className="dropdownMenu__item">
                        <img className="img" src={passwordIcon} alt="haslo" />
                        Zmień hasło
                    </a>
                    <button className="dropdownMenu__item"
                            onClick={() => { logout(); }}>
                        <img className="img" src={logoutIcon} alt="wylogowanie" />
                        Wyloguj się
                    </button>
                </div> : ''}
            </div>
        </div>
    </header>
};

export default LoggedUserHeader;
