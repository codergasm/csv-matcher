import React, {useContext} from 'react';
import Select from 'react-select';
import {AppContext} from "../pages/CorrelationPage";

const SchemaPicker = () => {
    const { schemas, currentSchema, setCurrentSchema } = useContext(AppContext);

    return <div className="schemaPicker schemaPicker--loadFiles">
        <h5 className="schemaPicker__header">
            Skorzystaj z uprzednio utworzonego schematu dopasowania
        </h5>

        <Select
            options={schemas}
            placeholder="Wybierz schemat"
            value={schemas[currentSchema]}
            onChange={setCurrentSchema}
            isSearchable={true}
        />
    </div>
};

export default SchemaPicker;
