import React, {useContext, useEffect, useState} from 'react';
import Select from 'react-select';
import {AppContext} from "../pages/CorrelationPage";
import {ViewContext} from "./CorrelationView";
import {saveSchema, updateSchema} from "../api/schemas";
import BottomNotification from "./BottomNotification";
import {TranslationContext} from "../App";

const ChooseAndSaveSchema = ({user}) => {
    const { content } = useContext(TranslationContext);
    const { schemas, availableForUserSchemas, currentSchemaId, setCurrentSchemaId, setUpdateSchemas,
        dataSheetId, relationSheetId } = useContext(AppContext);
    const { priorities, matchSchemaArray, showInSelectMenuColumnsDataSheet, showInSelectMenuColumnsRelationSheet,
        outputSheetExportColumns, dataSheetColumnsVisibility,
        relationSheetColumnsVisibility, outputSheetColumnsVisibility, matchType, matchFunction } = useContext(ViewContext);

    const [name, setName] = useState('');
    const [notificationText, setNotificationText] = useState('');
    const [notificationColor, setNotificationColor] = useState('');
    const [isCurrentSchemaTeam, setIsCurrentSchemaTeam] = useState(true);
    const [tooltip, setTooltip] = useState(false);

    useEffect(() => {
        setIsCurrentSchemaTeam(!availableForUserSchemas.includes(currentSchemaId));
    }, [currentSchemaId, schemas, availableForUserSchemas]);

    useEffect(() => {
        if(currentSchemaId === -1) {
            setName(content.newSchema);
        }
        else {
            setName('');
        }
    }, [currentSchemaId]);

    useEffect(() => {
        if(notificationText) {
            setTimeout(() => {
                setNotificationText('');
            }, 3000);
        }
    }, [notificationText]);

    const getColumnsSettingsObject = () => {
        return {
            showInSelectMenuColumnsDataSheet, showInSelectMenuColumnsRelationSheet,
            outputSheetExportColumns,
            dataSheetColumnsVisibility, relationSheetColumnsVisibility, outputSheetColumnsVisibility
        }
    }

    const createSchemaWrapper = () => {
        saveSchema(name, matchSchemaArray, priorities, getColumnsSettingsObject(),
            matchType, matchFunction,
            user.email, false, dataSheetId, relationSheetId)
            .then((res) => {
                setUpdateSchemas(p => !p);
                setCurrentSchemaId(res?.data?.id);
                setNotificationColor('#508345');
                setNotificationText(content.schemaAdded);
            })
            .catch(() => {
                setNotificationText(content.error);
                setNotificationColor('#ff0000');
            });
    }

    const updateSchemaWrapper = () => {
        updateSchema(currentSchemaId, name, matchSchemaArray, priorities,
            getColumnsSettingsObject(), matchType, matchFunction, dataSheetId, relationSheetId)
            .then(() => {
                setNotificationColor('#508345');
                setNotificationText(content.schemaUpdated);
            })
            .catch(() => {
                setNotificationText(content.error);
                setNotificationColor('#ff0000');
            });
    }

    const handleChange = (el) => {
        setCurrentSchemaId(el.value);
    }

    return <div className="schemaPicker">
        {notificationText ? <BottomNotification text={notificationText}
                                                background={notificationColor} /> : ''}

        <div className="schemaPicker__inner">
                <span className="schemaPicker__tooltip"
                      onMouseLeave={() => { setTooltip(false); }}
                      onMouseOver={() => { setTooltip(true); }}>
                    ?

                    {tooltip ? <span className="tooltip">
                        {content.schemaTooltip}
                    </span> : ''}
                </span>

            {content.currentSchema}:

            <div className="selectWrapper">
                {currentSchemaId !== -1 ? <Select options={schemas}
                                                  placeholder={content.chooseSchemaPlaceholder}
                                                  value={schemas.find((item) => (item.value === currentSchemaId))}
                                                  onChange={handleChange}
                                                  isSearchable={true}
                /> : <input className="input input--schemaName"
                            placeholder={content.schemaNamePlaceholder}
                            value={name}
                            onChange={(e) => { setName(e.target.value); }} />}
            </div>

            {(!isCurrentSchemaTeam || user.canEditTeamMatchSchemas || currentSchemaId === -1) ? (currentSchemaId === -1 ? <button className="btn btn--saveSchema"
                                           onClick={createSchemaWrapper}>
                {content.createAndSaveSchema}
            </button> : <button className="btn btn--saveSchema"
                                onClick={updateSchemaWrapper}>
                {content.updateSchema}
            </button>) : ''}
        </div>
    </div>
};

export default ChooseAndSaveSchema;
