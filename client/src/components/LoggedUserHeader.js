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
    </header>
};

export default LoggedUserHeader;
