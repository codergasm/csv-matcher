import React, {useContext, useState} from 'react';
import {getDateFromString, getStringWithFileSize} from "../helpers/others";
import {deleteSheet} from "../api/files";
import DecisionModal from "./DecisionModal";
import editIcon from "../static/img/edit.svg";
import deleteIcon from "../static/img/no.svg";
import EditFileModal from "./EditFileModal";
import viewIcon from "../static/img/eye.svg";
import FilenameEditionCell from "./FilenameEditionCell";
import {TranslationContext} from "../App";

const TeamFilesTable = ({files, setUpdateFiles, canUpdate, canDelete, teamId}) => {
    const columnsNames = [
        'nazwa pliku', 'data uploadu', 'ilość wierszy', 'rozmiar pliku', 'edycja'
    ];

    const { content } = useContext(TranslationContext);

    const [deleteFileId, setDeleteFileId] = useState(null);
    const [deleteFileModalVisible, setDeleteFileModalVisible] = useState(false);
    const [editFile, setEditFile] = useState(null);
    const [editFileModalVisible, setEditFileModalVisible] = useState(false);

    return <div className="teamTable w scroll">
        {deleteFileModalVisible ? <DecisionModal closeModal={() => { setDeleteFileModalVisible(false); }}
                                                 closeSideEffectsFunction={() => { setUpdateFiles(p => !p); }}
                                                 submitFunction={deleteSheet}
                                                 submitFunctionParameters={[deleteFileId]}
                                                 text={content.deleteFileModalAlert}
                                                 successText={content.deleteFileDone}
                                                 confirmBtnText={content.delete}
                                                 backBtnText={content.back}
                                                 backBtnLink="/pliki" /> : ''}

        {editFileModalVisible ? <EditFileModal setUpdateFiles={setUpdateFiles}
                                               closeModal={() => { setEditFileModalVisible(false); }}
                                               teamId={teamId}
                                               id={editFile.id}
                                               name={editFile.filename} /> : ''}

        <div className="sheet__table">
            <div className="line line--membersHeader">
                {columnsNames.map((item, index) => {
                    return <div className="sheet__header__cell"
                                key={index}>
                        {item}
                    </div>
                })}
            </div>

            {files.map((item, index) => {
                    return <div className="line line--member"
                                key={index}>

                        <FilenameEditionCell item={item}
                                             index={index}
                                             files={files}
                                             canUpdate={canUpdate}
                                             setUpdateFiles={setUpdateFiles} />

                        <div className="sheet__header__cell" dangerouslySetInnerHTML={{
                            __html: getDateFromString(item.created_datetime)
                        }}>

                        </div>
                        <div className="sheet__header__cell">
                            {item.row_count}
                        </div>
                        <div className="sheet__header__cell">
                            {getStringWithFileSize(item.filesize)}
                        </div>

                        <div className="sheet__header__cell sheet__header__cell--column">
                            {canUpdate || canDelete ? <div className="flex flex--action">
                                <button className="btn--action"
                                        disabled={!canUpdate}
                                        onClick={() => { setEditFile(item); setEditFileModalVisible(true); }}>
                                    <img className="img" src={editIcon} alt="edytuj" />
                                </button>
                                <a className="btn--action"
                                   target="_blank"
                                   href={`/podglad-pliku?id=${item.id}`}>
                                    <img className="img" src={viewIcon} alt="zobacz" />
                                </a>
                                <button className="btn--action"
                                        disabled={!canDelete}
                                        onClick={() => { setDeleteFileId(item.id); setDeleteFileModalVisible(true); }}>
                                    <img className="img" src={deleteIcon} alt="usuń" />
                                </button>
                            </div> : <span className="small">
                                Nie posiadasz praw do edycji pliku
                            </span> }
                        </div>
                    </div>
                })}
        </div>
    </div>;
};

export default TeamFilesTable;
