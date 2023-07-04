import React, {useEffect, useState} from 'react';
import DecisionModal from "./DecisionModal";
import {getDateFromString} from "../helpers/others";
import deleteIcon from "../static/img/no.svg";
import arrowIcon from '../static/img/arrow-expand.svg';
import {deleteSchema, detachSheetsFromSchemaById} from "../api/schemas";
import AssignSheetsToSchemaModal from "./AssignSheetsToSchemaModal";
import BottomNotification from "./BottomNotification";
import MatchProgressBar from "./MatchProgressBar";
import SchemaNameEditionCell from "./SchemaNameEditionCell";

const TeamSchemasTable = ({schemas, canEdit, canDelete, allFiles, user, setUpdateSchemas}) => {
    const columnsNames = [
        'nazwa schematu', 'data utworzenia', 'edycja', 'zwiń/rozwiń'
    ];
    const sheetsColumnsNames = [
        'arkusz 1', 'arkusz 2', 'ilość rekordów w arkuszu 1 z dopasowaniem do arkusza 2',
        'ilość rekordów w arkuszu 2 z dopasowaniem do arkusza 1', 'opcje'
    ];

    const [deleteSchemeId, setDeleteSchemeId] = useState(null);
    const [deleteSchemeModalVisible, setDeleteSchemeModalVisible] = useState(false);
    const [detachSheetFromSchemaId, setDetachSheetFromSchemaId] = useState(null);
    const [detachSheetFromSchemaModalVisible, setDetachSheetFromSchemaModalVisible] = useState(false);
    const [sheetsVisible, setSheetsVisible] = useState([]);
    const [chooseSheetsModalVisible, setChooseSheetsModalVisible] = useState(false);
    const [chooseSheetsSchemaId, setChooseSheetsSchemaId] = useState(null);

    useEffect(() => {
        if(schemas) {
            setSheetsVisible(Object.entries(schemas).map(() => false));
        }
    }, [schemas]);

    useEffect(() => {
        if(chooseSheetsSchemaId === 0 || chooseSheetsSchemaId === -1) {
            setTimeout(() => {
                setChooseSheetsSchemaId(null);
            }, 3000);
        }
    }, [chooseSheetsSchemaId]);

    const handleSheetsVisibilityChange = (i, value) => {
        setSheetsVisible(prevState => (prevState.map((item, index) => {
            if(i === index) return value;
            else return item;
        })));
    }

    const getFileName = (id) => {
        const file = allFiles.find((item) => (item.id === id));

        if(file) return file.filename;
        else return '';
    }

    const getFileRowCount = (id) => {
        const file = allFiles.find((item) => (item.id === id));

        if(file) return file.row_count;
        else return '';
    }

    return <div className="teamTable teamTable--schemas w">
        {deleteSchemeModalVisible ? <DecisionModal closeModal={() => { setDeleteSchemeModalVisible(false); }}
                                                   closeSideEffectsFunction={() => { setUpdateSchemas(p => !p); }}
                                                   submitFunction={deleteSchema}
                                                   submitFunctionParameters={[deleteSchemeId]}
                                                   text="Czy na pewno chcesz usunąć ten schemat?"
                                                   successText="Schemat został usunięty"
                                                   confirmBtnText="Usuń"
                                                   backBtnText="Powrót"
                                                   backBtnLink="/schematy-dopasowania" /> : ''}

        {detachSheetFromSchemaModalVisible ? <DecisionModal closeModal={() => { setDetachSheetFromSchemaModalVisible(false); }}
                                                            closeSideEffectsFunction={() => { setUpdateSchemas(p => !p); }}
                                                            submitFunction={detachSheetsFromSchemaById}
                                                            submitFunctionParameters={[detachSheetFromSchemaId]}
                                                            text="Czy na pewno chcesz odłączyć te pliki od tego schematu?"
                                                            successText="Pliki zostały odłączone od schematu"
                                                            confirmBtnText="Odłącz"
                                                            backBtnText="Powrót"
                                                            backBtnLink="/schematy-dopasowania"
        /> : ''}

        {chooseSheetsModalVisible ? <AssignSheetsToSchemaModal setUpdateSchemas={setUpdateSchemas}
                                                               matchSchema={chooseSheetsSchemaId}
                                                               user={user}
                                                               showBottomNotification={setChooseSheetsSchemaId}
                                                               closeModal={() => { setChooseSheetsModalVisible(false); }} /> : ''}

        {chooseSheetsSchemaId === 0 || chooseSheetsSchemaId === -1 ? <BottomNotification text={chooseSheetsSchemaId === 0 ? 'Pliki zostały przypisane do schematu' : 'Coś poszło nie tak... Prosimy spróbować później'}
                                                                                         background={chooseSheetsSchemaId === 0 ? null : '#ff0000'} /> : ''}

        {Object.entries(schemas)?.length ? <div className="sheet__table">
            <div className="line line--membersHeader">
                {columnsNames.map((item, index, array) => {
                    return <div className={index === array.length-1 ? "sheet__header__cell sheet__header__cell--expand" : "sheet__header__cell"}
                                key={index}>
                        {item}
                    </div>
                })}
            </div>

            {Object.entries(schemas).map((item, index) => {
                const schema = item[1][0];
                const sheets = item[1];

                return <div className="schemaLine" key={index}>
                    {/* Main row */}
                    <div className="line line--member line--borderBottom">
                        <SchemaNameEditionCell schemas={schemas}
                                               schema={schema}
                                               index={index}
                                               canEdit={canEdit}
                                               setUpdateSchemas={setUpdateSchemas} />

                        <div className="sheet__header__cell" dangerouslySetInnerHTML={{
                            __html: getDateFromString(schema.schemas_created_datetime)
                        }}>

                        </div>
                        <div className="sheet__header__cell sheet__header__cell--column">
                            {canDelete ? <div className="flex flex--action">
                                <button className="btn--action"
                                        onClick={() => { setDeleteSchemeId(schema.schemas_id); setDeleteSchemeModalVisible(true); }}>
                                    <img className="img" src={deleteIcon} alt="usuń" />
                                </button>
                            </div> : ''}
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
                        {sheets[0]?.sheets_data_sheet ? <>
                            <div className="line">
                                {sheetsColumnsNames.map((item, index) => {
                                    return <div className="subTable__cell subTable__cell--header"
                                                key={index}>
                                        {item}
                                    </div>
                                })}
                            </div>

                            {sheets.map((item, index) => {
                                return <div className="line" key={index}>
                                    <div className="subTable__cell">
                                        {getFileName(item.sheets_data_sheet)}
                                    </div>
                                    <div className="subTable__cell">
                                        {getFileName(item.sheets_relation_sheet)}
                                    </div>
                                    <div className="subTable__cell subTable__cell--progress">
                                        <MatchProgressBar progress={item.sheets_number_of_matched_rows / getFileRowCount(item.sheets_data_sheet)} />
                                        {item.sheets_number_of_matched_rows} z {getFileRowCount(item.sheets_data_sheet)}
                                    </div>
                                    <div className="subTable__cell subTable__cell--progress">
                                        <MatchProgressBar progress={item.sheets_number_of_matched_rows / getFileRowCount(item.sheets_relation_sheet)} />
                                        {item.sheets_number_of_matched_rows} z {getFileRowCount(item.sheets_relation_sheet)}
                                    </div>
                                    <div className="subTable__cell">
                                        <div className="flex">
                                            <a className="btn btn--goToEditor"
                                               href={`/edytor-dopasowania?sheet1=${item.sheets_data_sheet}&sheet2=${item.sheets_relation_sheet}&schema=${item.schemas_id}`}>
                                                Uruchom edytor
                                            </a>
                                            {canDelete ? <button className="btn--action btn--action--detachSheets"
                                                                 onClick={() => { setDetachSheetFromSchemaId(item.sheets_id); setDetachSheetFromSchemaModalVisible(true); }}>
                                                <img className="img" src={deleteIcon} alt="usuń" />
                                            </button> : ''}
                                        </div>
                                    </div>
                                </div>
                            })}
                        </> : <h5 className="noSheetsInfo">
                            Nie masz jeszcze żadnych arkuszy przypisanych do tego schematu
                        </h5>}

                        {canEdit ? <button className="btn btn--assignSheetsToSchema"
                                           onClick={() => { setChooseSheetsSchemaId(schema.schemas_id); setChooseSheetsModalVisible(true); }}>
                            Dodaj nowe arkusze do schematu
                        </button> : ''}
                    </div> : ''}
                </div>
            })}
        </div> : <h5 className="emptyTableInfo">
            Nie masz żadnych schematów dopasowania
        </h5>}
    </div>
};

export default TeamSchemasTable;
