import React, {useState, useEffect, useRef} from 'react';
import Select from "react-select";

const RelationColumnSelect = ({n, selectOption, setSelectOption, addRelationColumn}) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if(!isNaN(n)) {
            setOptions(Array.from(Array(n).keys()).map((item) => {
                return {
                    label: item+1,
                    value: item
                }
            }));
        }
    }, [n]);

    let selectRef = useRef(null);
    let selectLabel = useRef(null);

    const menuOpen = () => {
        selectLabel.current.style.zIndex = '1999';
    }

    const menuClose = () => {
        selectLabel.current.style.zIndex = '10';
    }

    const handleChoose = (e) => {
        setSelectOption(e.value);
    }

    return <div className="matchTypeSelectLabel matchTypeSelectLabel--relationColumn"
                ref={selectLabel}>
        <span>
            Kolumna relacji
        </span>

        <div className="flex">
            <Select ref={selectRef}
                    onMenuClose={menuClose}
                    onMenuOpen={menuOpen}
                    options={options}
                    placeholder="Typ dopasowania"
                    value={options[selectOption]}
                    onChange={handleChoose}
                    isSearchable={false} />

            <button className="btn btn--addRelationColumn"
                    onClick={addRelationColumn}>
                + Dodaj relację
            </button>
        </div>
    </div>
};

export default RelationColumnSelect;
