import React, {useContext} from 'react';
import Select from 'react-select';
import {AppContext} from "../pages/CorrelationPage";

const SchemaPicker = () => {
    const { schemas, currentSchemaId, setCurrentSchemaId } = useContext(AppContext);

    const handleChange = (el) => {
        setCurrentSchemaId(el.value);
    }

    return <div className="schemaPicker schemaPicker--loadFiles">
        <h5 className="schemaPicker__header">
            Skorzystaj z uprzednio utworzonego schematu dopasowania
        </h5>

        <Select
            options={schemas}
            placeholder="Wybierz schemat"
            value={schemas.find((item) => (item.value === currentSchemaId))}
            onChange={handleChange}
            isSearchable={true} />
    </div>
}

export default SchemaPicker;
