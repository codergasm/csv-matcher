import React, {useState} from 'react';
import {getDateFromString} from "../helpers/others";
import {assignFileOwnershipToTeam} from "../helpers/files";
import DecisionModal from "./DecisionModal";

const MyFilesTable = ({files, setUpdateFiles}) => {
    const columnsNames = [
        'nazwa pliku', 'data uploadu', 'ilość wierszy', 'rozmiar pliku'
    ];

    const [fileToAssignToTeamId, setFileToAssignToTeamId] = useState(null);
    const [assignFileToTeamModalVisible, setAssignFileToTeamModalVisible] = useState(false);

    return <div className="teamTable w scroll">
        {assignFileToTeamModalVisible ? <DecisionModal closeModal={() => { setAssignFileToTeamModalVisible(false); }}
                                                       closeSideEffectsFunction={() => { setUpdateFiles(p => !p); }}
                                                       submitFunction={assignFileOwnershipToTeam}
                                                       submitFunctionParameters={[fileToAssignToTeamId, 1]}
                                                       text="Uwaga! Jeśli uczynisz Twój zespół właścicielem, to będziesz posiadać dostęp do tego pliku/ schematu [wpisz właściwe] gdy tylko przestaniesz być członkiem tego zespołu. Dzięki temu podejściu zespół nie musi martwić się o osoby odchodzące z zespołu i utworzone przez nich pliki. Jeżeli Twoje uprawnienia w zespole są ograniczone (np. nie możesz edytować lub usuwać schematów) - to utracisz tą możliwość po zmianie właścicielstwa."
                                                       successText="Plik został przypisany do zespołu"
                                                       confirmBtnText="Przypisz"
                                                       backBtnText="Powrót"
                                                       backBtnLink="/pliki"
        /> : ''}

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
                            {item.filesize}
                        </div>
                        <div className="sheet__header__cell">
                            <button className="btn--ownership"
                                    onClick={() => { setFileToAssignToTeamId(item.id); setAssignFileToTeamModalVisible(true); }}>
                                Uczyń zespół właścicielem pliku
                            </button>
                        </div>
                    </div>
                })}
        </div>
    </div>;
};

export default MyFilesTable;
