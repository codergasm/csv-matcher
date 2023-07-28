import React, {useContext, useEffect, useRef, useState} from 'react';
import Select from "react-select";
import {ViewContext} from "./CorrelationView";
import {TranslationContext} from "../App";
import {ApiContext} from "./LoggedUserWrapper";

const MatchTypeSelect = () => {
    const { content } = useContext(TranslationContext);
    const { apiRelationType } = useContext(ApiContext);
    const { matchType, setMatchType } = useContext(ViewContext);

    const [options, setOptions] = useState([]);

    let selectRef = useRef(null);
    let selectLabel = useRef(null);

    useEffect(() => {
        if(apiRelationType !== -1) {
            setMatchType(apiRelationType);
        }
    }, [apiRelationType]);

    useEffect(() => {
        if(content) {
            setOptions(content.relationTypes.map((item, index) => {
                return {
                    label: item,
                    value: index
                }
            }));
        }
    }, [content]);

    const menuOpen = () => {
        selectLabel.current.style.zIndex = '1999';
    }

    const menuClose = () => {
        selectLabel.current.style.zIndex = '10';
    }

    const handleChoose = (e) => {
        setMatchType(e.value);
    }

    return <div className="matchTypeSelectLabel"
                ref={selectLabel}>
        <span>
            {content.relationType}
        </span>

        <Select ref={selectRef}
                onMenuClose={menuClose}
                onMenuOpen={menuOpen}
                options={options}
                placeholder={content.relationTypePlaceholder}
                value={options[matchType]}
                onChange={handleChoose}
                isDisabled={apiRelationType !== -1}
                isSearchable={true} />
    </div>
};

export default MatchTypeSelect;
