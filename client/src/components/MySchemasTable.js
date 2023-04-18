import React, {useEffect, useState} from 'react';
import DecisionModal from "./DecisionModal";
import {getDateFromString} from "../helpers/others";
import deleteIcon from "../static/img/no.svg";
import arrowIcon from '../static/img/arrow-expand.svg';
import {assignSchemaToTeam, deleteSchema} from "../helpers/schemas";

const MySchemasTable = ({schemas, teamId, setUpdateSchemas}) => {
    const columnsNames = [
        'nazwa schematu', 'data utworzenia', 'edycja', 'zwiń/rozwiń'
    ];
    const sheetsColumnsNames = [
        'arkusz 1', 'arkusz 2', 'ilość rekordów w arkuszu 1 z dopasowaniem do arkusza 2',
        'ilość rekordów w arkuszu 2 z dopasowaniem do arkusza 1', 'uruchom'
    ];

    const [schemeToAssignToTeamId, setSchemeToAssignToTeamId] = useState(null);
    const [assignSchemeToTeamModalVisible, setAssignSchemeToTeamModalVisible] = useState(false);
    const [deleteSchemeId, setDeleteSchemeId] = useState(null);
    const [deleteSchemeModalVisible, setDeleteSchemeModalVisible] = useState(false);
    const [sheetsVisible, setSheetsVisible] = useState([]);

    useEffect(() => {
        if(schemas) {
            setSheetsVisible(schemas.map(() => true));
        }
    }, [schemas]);

    const handleSheetsVisibilityChange = (i, value) => {
        setSheetsVisible(prevState => (prevState.map((item, index) => {
            if(i === index) return value;
            else return item;
        })));
    }

    return <div className="teamTable teamTable--schemas w scroll">
        {assignSchemeToTeamModalVisible ? <DecisionModal closeModal={() => { setAssignSchemeToTeamModalVisible(false); }}
                                                       closeSideEffectsFunction={() => { setUpdateSchemas(p => !p); }}
                                                       submitFunction={assignSchemaToTeam}
                                                       submitFunctionParameters={[schemeToAssignToTeamId, teamId]}
                                                       text="Uwaga! Jeśli uczynisz Twój zespół właścicielem, to będziesz posiadać dostęp do tego schematu, gdy tylko przestaniesz być członkiem tego zespołu. Dzięki temu podejściu zespół nie musi martwić się o osoby odchodzące z zespołu i utworzone przez nich pliki. Jeżeli Twoje uprawnienia w zespole są ograniczone (np. nie możesz edytować lub usuwać schematów) - to utracisz tą możliwość po zmianie właścicielstwa."
                                                       successText="Schemat został przypisany do zespołu"
                                                       confirmBtnText="Przypisz"
                                                       backBtnText="Powrót"
                                                       backBtnLink="/schematy-dopasowania"
        /> : ''}

        {deleteSchemeModalVisible ? <DecisionModal closeModal={() => { setDeleteSchemeModalVisible(false); }}
                                                 closeSideEffectsFunction={() => { setUpdateSchemas(p => !p); }}
                                                 submitFunction={deleteSchema}
                                                 submitFunctionParameters={[deleteSchemeId]}
                                                 text="Czy na pewno chcesz usunąć ten schemat?"
                                                 successText="Schemat został usunięty"
                                                 confirmBtnText="Usuń"
                                                 backBtnText="Powrót"
                                                 backBtnLink="/schematy-dopasowania" /> : ''}

        <div className="sheet__table">
            <div className="line line--membersHeader">
                {columnsNames.map((item, index, array) => {
                    return <div className={index === array.length-1 ? "sheet__header__cell sheet__header__cell--expand" : "sheet__header__cell"}
                                key={index}>
                        {item}
                    </div>
                })}
            </div>

            {schemas.map((item, index) => {
                return <div className="schemaLine" key={index}>
                    {/* Main row */}
                    <div className="line line--member">
                        <div className="sheet__header__cell">
                            {item.name}
                        </div>
                        <div className="sheet__header__cell" dangerouslySetInnerHTML={{
                            __html: getDateFromString(item.created_datetime)
                        }}>

                        </div>
                        <div className="sheet__header__cell sheet__header__cell--column">
                            <div className="flex flex--action">
                                <button className="btn--action"
                                        onClick={() => { setDeleteSchemeId(item.id); setDeleteSchemeModalVisible(true); }}>
                                    <img className="img" src={deleteIcon} alt="usuń" />
                                </button>
                            </div>
                            <button className="btn--ownership"
                                    onClick={() => { setSchemeToAssignToTeamId(item.id); setAssignSchemeToTeamModalVisible(true); }}>
                                Uczyń zespół właścicielem pliku
                            </button>
                        </div>
                        <div className="sheet__header__cell sheet__header__cell--expand">
                            {sheetsVisible[index] ? <button className="btn btn--toggleVisibility btn--toggleVisibility--hide"
                                                            onClick={() => { handleSheetsVisibilityChange(index, false); }}>
                                <img className="img" src={arrowIcon} alt="rozwin" />
                                zwiń arkusze
                            </button> : <button className="btn btn--toggleVisibility btn--toggleVisibility--show"
                                                onClick={() => { handleSheetsVisibilityChange(index, true); }}>
                                <img className="img" src={arrowIcon} alt="rozwin" />
                                rozwiń arkusze
                            </button>}
                        </div>
                    </div>

                    {/* Assigned sheets */}
                    {sheetsVisible[index] ? <div className="subTable">
                        <div className="line">
                            {sheetsColumnsNames.map((item, index) => {
                                return <div className="subTable__cell"
                                            key={index}>
                                    {item}
                                </div>
                            })}
                        </div>
                    </div> : ''}
                </div>
            })}
        </div>
    </div>
};

export default MySchemasTable;
