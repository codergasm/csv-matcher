import React, {useContext, useRef} from 'react';
import Select from "react-select";
import {ViewContext} from "./CorrelationView";

const matchTypes = [
    {
        label: 'Jeden do jednego',
        value: 0
    },
    {
        label: 'Jeden (arkusz 1) do wielu (arkusz 2)',
        value: 1,
        isDisabled: true
    },
    {
        label: 'Wiele (arkusz 1) do jednego (arkusz 2)',
        value: 2,
        isDisabled: true
    },
    {
        label: 'Wiele do wielu',
        value: 3,
        isDisabled: true
    }
]

const MatchTypeSelect = () => {
    const { matchType, setMatchType } = useContext(ViewContext);

    let selectRef = useRef(null);
    let selectLabel = useRef(null);

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
            Typ relacji
        </span>

        <Select ref={selectRef}
                onMenuClose={menuClose}
                onMenuOpen={menuOpen}
                options={matchTypes}
                placeholder="Typ dopasowania"
                value={matchTypes[matchType]}
                onChange={handleChoose}
                isSearchable={true} />
    </div>
};

export default MatchTypeSelect;
