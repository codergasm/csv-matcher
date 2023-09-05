import React, {useContext, useEffect, useState} from 'react';
import {TranslationContext} from "../App";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import useActionOnMouseClick from "../hooks/useActionOnMouseClick";
import defaultFlag from '../static/img/flags/pl.svg';

const LanguageSwitcher = () => {
    const { languages, lang, setLang } = useContext(TranslationContext);

    const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);
    const [currentLanguageFlag, setCurrentLanguageFlag] = useState(defaultFlag);
    const [flags, setFlags] = useState([]);

    useEffect(() => {
        (async () => {
            let newFlags = [];

            for(const language of languages) {
                const img = await import(`../static/img/flags/${language.shortcut}.svg`);

                if(img) {
                    newFlags.push(img.default);
                }
                else {
                    newFlags.push(defaultFlag);
                }
            }

            setFlags(newFlags);
        })();
    }, [languages]);

    useEffect(() => {
        (async () => {
            const img = await import(`../static/img/flags/${lang}.svg`);

            if(img) {
                setCurrentLanguageFlag(img.default);
            }
            else {
                setCurrentLanguageFlag(defaultFlag);
            }
        })();
    }, [lang]);

    const toggleDropdownMenu = (e) => {
        e.stopPropagation();
        setDropdownMenuVisible(p => !p);
    }

    const closeDropdownMenu = () => {
        setDropdownMenuVisible(false);
    }

    const selectLanguage = (newLanguage) => {
        setLang(newLanguage);
    }

    useActionOnEscapePress(closeDropdownMenu);
    useActionOnMouseClick(closeDropdownMenu);

    return <div className="languageSwitcher">
        <button className="languageSwitcher__btn"
                onClick={toggleDropdownMenu}>
            <img className="img" src={currentLanguageFlag} alt="flaga" />
        </button>

        {dropdownMenuVisible ? <div className="languageSwitcher__dropdownMenu shadow">
            {languages.map((item, index) => {
                return <button className="languageSwitcher__dropdownMenu__btn"
                               key={index}
                               onClick={() => { selectLanguage(item.shortcut); }}>
                    <img className="img" src={flags[index]} alt={item.shortcut} />
                </button>
            })}
        </div> : ''}
    </div>
}

export default LanguageSwitcher;
