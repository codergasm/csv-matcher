import React, {useState} from 'react';
import {updateSheet} from "../api/files";
import saveIcon from "../static/img/check.svg";
import editIcon from "../static/img/edit.svg";

const FilenameEditionCell = ({setUpdateFiles, item, index, files, canUpdate}) => {
    const [editNameMode, setEditNameMode] = useState(-1);
    const [newName, setNewName] = useState('');

    const handleEditNameClick = (id, index) => {
        if(editNameMode !== -1 && newName) {
            updateSheet(null, null, id, newName)
                .then(() => {
                    setEditNameMode(-1);
                    setUpdateFiles(p => !p);
                })
                .catch(() => {
                    setEditNameMode(-1);
                });
        }
        else {
            setNewName(files[index].filename);
            setEditNameMode(index);
        }
    }

    return <div className="sheet__header__cell">
        {editNameMode === index && canUpdate ? <input className="input input--teamName input--schemaName--edit"
                     onKeyDown={(e) => { if(e.key === 'Enter') handleEditNameClick(item.id, index); }}
                     onChange={(e) => { setNewName(e.target.value); }}
                     value={newName} /> : <span>
            {item.filename}
        </span>}

        {canUpdate ? <button className="btn btn--edit btn--editSchema"
                             onClick={() => { handleEditNameClick(item.id, index); }}>
            <img className="img" src={editNameMode === index ? saveIcon : editIcon} alt="edytuj" />
        </button> : ''}
    </div>
};

export default FilenameEditionCell;
