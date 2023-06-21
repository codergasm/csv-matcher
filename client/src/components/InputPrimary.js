import React from 'react';

const InputPrimary = ({label, type = 'text', placeholder, value, setValue}) => {
    const handleChange = (e) => {
        setValue(e.target.value);
    }

    return <label className="label">
        {label}
        <input className="input"
               type={type}
               value={value}
               onChange={handleChange}
               placeholder={placeholder} />
    </label>
};

export default InputPrimary;
