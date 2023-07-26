import React, {useContext} from 'react';
import Select from 'react-select';
import {AppContext} from "../pages/CorrelationPage";
import {TranslationContext} from "../App";

const SchemaPicker = () => {
    const { content } = useContext(TranslationContext);
    const { schemas, currentSchemaId, setCurrentSchemaId } = useContext(AppContext);

    const handleChange = (el) => {
        setCurrentSchemaId(el.value);
    }

    return <div className="schemaPicker schemaPicker--loadFiles">
        <h5 className="schemaPicker__header">
            {content.chooseSchemaLabel}
        </h5>

        <Select options={schemas}
                placeholder={content.chooseSchemaPlaceholder}
                value={schemas.find((item) => (item.value === currentSchemaId))}
                onChange={handleChange}
                isSearchable={true} />
    </div>
}

export default SchemaPicker;
