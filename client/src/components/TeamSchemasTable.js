import React, {useContext, useState} from 'react';
import DecisionModal from "./DecisionModal";
import {getDateFromString} from "../helpers/others";
import deleteIcon from "../static/img/no.svg";
import arrowIcon from '../static/img/arrow-expand.svg';
import {deleteSchema, detachSheetsFromSchemaById} from "../api/schemas";
import AssignSheetsToSchemaModal from "./AssignSheetsToSchemaModal";
import BottomNotification from "./BottomNotification";
import MatchProgressBar from "./MatchProgressBar";
import SchemaNameEditionCell from "./SchemaNameEditionCell";
import withSchemasTable from "../hoc/withSchemasTable";
import {TranslationContext} from "../App";

const TeamSchemasTable = (props) => {
    const {schemas, setUpdateSchemas, user,
        canEdit, canDelete, getFileName,
        getFileRowCount, sheetsVisible,
        handleSheetsVisibilityChange,
        columnsNames, sheetsColumnsNames,
        chooseSheetsModalVisible, setChooseSheetsModalVisible,
        chooseSheetsSchemaId, setChooseSheetsSchemaId} = props;

    const { content } = useContext(TranslationContext);

    const [deleteSchemeId, setDeleteSchemeId] = useState(null);
    const [deleteSchemeModalVisible, setDeleteSchemeModalVisible] = useState(false);
    const [detachSheetFromSchemaId, setDetachSheetFromSchemaId] = useState(null);
    const [detachSheetFromSchemaModalVisible, setDetachSheetFromSchemaModalVisible] = useState(false);

    return <div className="teamTable teamTable--schemas w">
        {deleteSchemeModalVisible ? <DecisionModal closeModal={() => { setDeleteSchemeModalVisible(false); }}
                                                   closeSideEffectsFunction={() => { setUpdateSchemas(p => !p); }}
                                                   submitFunction={deleteSchema}
                                                   submitFunctionParameters={[deleteSchemeId]}
                                                   text={content.deleteSchemaAlert}
                                                   successText={content.schemaDeleteDone}
                                                   confirmBtnText={content.delete}
                                                   backBtnText={content.back}
                                                   backBtnLink="/schematy-dopasowania" /> : ''}

        {detachSheetFromSchemaModalVisible ? <DecisionModal closeModal={() => { setDetachSheetFromSchemaModalVisible(false); }}
                                                            closeSideEffectsFunction={() => { setUpdateSchemas(p => !p); }}
                                                            submitFunction={detachSheetsFromSchemaById}
                                                            submitFunctionParameters={[detachSheetFromSchemaId]}
                                                            text={content.detachFilesFromSchemaAlert}
                                                            successText={content.detachFilesFromSchemaDone}
                                                            confirmBtnText={content.detach}
                                                            backBtnText={content.back}
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
                                {content.hideSheets}
                            </button> : <button className="btn btn--toggleVisibility btn--toggleVisibility--show"
                                                onClick={() => { handleSheetsVisibilityChange(index, true); }}>
                                <img className="img" src={arrowIcon} alt="rozwin" />
                                {content.showSheets}
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
                                        {item.sheets_number_of_matched_rows} {content.outOf} {getFileRowCount(item.sheets_data_sheet)}
                                    </div>
                                    <div className="subTable__cell subTable__cell--progress">
                                        <MatchProgressBar progress={item.sheets_number_of_matched_rows / getFileRowCount(item.sheets_relation_sheet)} />
                                        {item.sheets_number_of_matched_rows} {content.outOf} {getFileRowCount(item.sheets_relation_sheet)}
                                    </div>
                                    <div className="subTable__cell">
                                        <div className="flex">
                                            <a className="btn btn--goToEditor"
                                               href={`/edytor-dopasowania?sheet1=${item.sheets_data_sheet}&sheet2=${item.sheets_relation_sheet}&schema=${item.schemas_id}`}>
                                                {content.runEditor}
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
                            {content.noSheetsAssignedToSchema}
                        </h5>}

                        {canEdit ? <button className="btn btn--assignSheetsToSchema"
                                           onClick={() => { setChooseSheetsSchemaId(schema.schemas_id); setChooseSheetsModalVisible(true); }}>
                            {content.addNewSheetsToSchema}
                        </button> : ''}
                    </div> : ''}
                </div>
            })}
        </div> : <h5 className="emptyTableInfo">
            {content.noSchemasFound}
        </h5>}
    </div>
};

export default withSchemasTable(TeamSchemasTable);
