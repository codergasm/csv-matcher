import React, {useState} from 'react';
import {updateSchemaName} from "../api/schemas";
import saveIcon from "../static/img/check.svg";
import editIcon from "../static/img/edit.svg";

const SchemaNameEditionCell = ({schemas, setUpdateSchemas, canEdit, schema, index}) => {
    const [newName, setNewName] = useState('');
    const [editNameMode, setEditNameMode] = useState(-1);

    const handleEditNameClick = (id, index) => {
        if(editNameMode !== -1 && newName) {
            updateSchemaName(id, newName)
                .then(() => {
                    setEditNameMode(-1);
                    setUpdateSchemas(p => !p);
                })
                .catch(() => {
                    setEditNameMode(-1);
                });
        }
        else {
            setNewName(Object.entries(schemas)[index][1][0].schemas_name);
            setEditNameMode(index);
        }
    }

    return <div className="sheet__header__cell">
        {editNameMode !== -1 && canEdit ? <input className="input input--teamName input--schemaName--edit"
                             onKeyDown={(e) => { if(e.key === 'Enter') handleEditNameClick(schema.schemas_id, index); }}
                             onChange={(e) => { setNewName(e.target.value); }}
                             value={newName} /> : <span>
            {schema.schemas_name}
        </span>}

        {canEdit ? <button className="btn btn--edit btn--editSchema"
                           onClick={() => { handleEditNameClick(schema.schemas_id, index); }}>
            <img className="img" src={editNameMode !== -1 ? saveIcon : editIcon} alt="edit" />
        </button> : ''}
    </div>
};

export default SchemaNameEditionCell;
