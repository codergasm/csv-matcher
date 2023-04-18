import React, {useState} from 'react';
import {getDateFromString, getStringWithFileSize} from "../helpers/others";
import {assignFileOwnershipToTeam, deleteSheet} from "../helpers/files";
import DecisionModal from "./DecisionModal";
import editIcon from '../static/img/edit.svg';
import deleteIcon from '../static/img/no.svg';
import EditFileModal from "./EditFileModal";

const MyFilesTable = ({files, teamId, setUpdateFiles}) => {
    const columnsNames = [
        'nazwa pliku', 'data uploadu', 'ilość wierszy', 'rozmiar pliku', 'edycja'
    ];

    const [fileToAssignToTeamId, setFileToAssignToTeamId] = useState(null);
    const [assignFileToTeamModalVisible, setAssignFileToTeamModalVisible] = useState(false);
    const [deleteFileId, setDeleteFileId] = useState(null);
    const [deleteFileModalVisible, setDeleteFileModalVisible] = useState(false);
    const [editFile, setEditFile] = useState(null);
    const [editFileModalVisible, setEditFileModalVisible] = useState(false);

    return <div className="teamTable w scroll">
        {assignFileToTeamModalVisible ? <DecisionModal closeModal={() => { setAssignFileToTeamModalVisible(false); }}
                                                       closeSideEffectsFunction={() => { setUpdateFiles(p => !p); }}
                                                       submitFunction={assignFileOwnershipToTeam}
                                                       submitFunctionParameters={[fileToAssignToTeamId, teamId]}
                                                       text="Uwaga! Jeśli uczynisz Twój zespół właścicielem, to będziesz posiadać dostęp do tego pliku, gdy tylko przestaniesz być członkiem tego zespołu. Dzięki temu podejściu zespół nie musi martwić się o osoby odchodzące z zespołu i utworzone przez nich pliki. Jeżeli Twoje uprawnienia w zespole są ograniczone (np. nie możesz edytować lub usuwać schematów) - to utracisz tą możliwość po zmianie właścicielstwa."
                                                       successText="Plik został przypisany do zespołu"
                                                       confirmBtnText="Przypisz"
                                                       backBtnText="Powrót"
                                                       backBtnLink="/pliki"
        /> : ''}

        {deleteFileModalVisible ? <DecisionModal closeModal={() => { setDeleteFileModalVisible(false); }}
                                                 closeSideEffectsFunction={() => { setUpdateFiles(p => !p); }}
                                                 submitFunction={deleteSheet}
                                                 submitFunctionParameters={[deleteFileId]}
                                                 text="Czy na pewno chcesz usunąć ten plik?"
                                                 successText="Plik został usunięty"
                                                 confirmBtnText="Usuń"
                                                 backBtnText="Powrót"
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
                        <div className="sheet__header__cell">
                            {item.filename}
                        </div>
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
                            <div className="flex flex--action">
                                <button className="btn--action"
                                        onClick={() => { setEditFile(item); setEditFileModalVisible(true); }}>
                                    <img className="img" src={editIcon} alt="edytuj" />
                                </button>
                                <button className="btn--action"
                                        onClick={() => { setDeleteFileId(item.id); setDeleteFileModalVisible(true); }}>
                                    <img className="img" src={deleteIcon} alt="usuń" />
                                </button>
                            </div>
                            <button className="btn--ownership"
                                    onClick={() => { setFileToAssignToTeamId(item.id); setAssignFileToTeamModalVisible(true); }}>
                                Uczyń zespół właścicielem pliku
                            </button>
                        </div>
                    </div>
                })}
        </div>
    </div>
};

export default MyFilesTable;
