import React, {useRef} from 'react';
import Select from "react-select";

const SelectInModal = ({label, options, selectOption, setSelectOption}) => {
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

    return <div className="modal__label modal__label--select"
                ref={selectLabel}>
        <span>
            {label}
        </span>

        <div className="flex">
            <Select ref={selectRef}
                    onMenuClose={menuClose}
                    onMenuOpen={menuOpen}
                    options={options}
                    placeholder={label}
                    value={options[selectOption]}
                    onChange={handleChoose}
                    isSearchable={false} />
        </div>
    </div>
};

export default SelectInModal;
