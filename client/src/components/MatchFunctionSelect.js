import React, {useContext, useRef} from 'react';
import {ViewContext} from "./CorrelationView";
import Select from "react-select";

const matchFunctions = [
    {
        label: 'Dopasowanie stringów',
        value: 0
    },
    {
        label: 'Pokrycie wartości z ark. 1 w ark. 2',
        value: 1
    },
    {
        label: 'Pokrycie wartości z ark. 2 w ark. 1',
        value: 2
    }
];

const MatchFunctionSelect = () => {
    const { matchFunction, setMatchFunction } = useContext(ViewContext);

    let selectRef = useRef(null);
    let selectLabel = useRef(null);

    const menuOpen = () => {
        selectLabel.current.style.zIndex = '1999';
    }

    const menuClose = () => {
        selectLabel.current.style.zIndex = '10';
    }

    const handleChoose = (e) => {
        setMatchFunction(e.value);
    }

    return <div className="matchTypeSelectLabel"
                ref={selectLabel}>
        <span>
            Funkcja dopasowania
        </span>

        <Select ref={selectRef}
                onMenuClose={menuClose}
                onMenuOpen={menuOpen}
                options={matchFunctions}
                placeholder="Typ dopasowania"
                value={matchFunctions[matchFunction]}
                onChange={handleChoose}
                isSearchable={true} />
    </div>
};

export default MatchFunctionSelect;
