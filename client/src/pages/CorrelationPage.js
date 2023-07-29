import React, {useContext, useEffect, useState} from 'react';
import LoadFilesView from "../components/LoadFilesView";
import CorrelationView from "../components/CorrelationView";
import {getSchemasByUser} from "../api/schemas";
import {getFileById} from "../api/files";
import getUrlParam from "../helpers/getUrlParam";
import {ApiContext} from "../components/LoggedUserWrapper";
import {getFilesByApiRequest, getSchemasByUserApiToken} from "../api/api";
import redirectToHomepage from "../helpers/redirectToHomepage";
import {TranslationContext} from "../App";
import useAlertOnPageLeave from "../hooks/useAlertOnPageLeave";

const AppContext = React.createContext(null);

const CorrelationPage = ({user}) => {
    const { content } = useContext(TranslationContext);
    const { api, apiRequestId, apiToken } = useContext(ApiContext);

    const [currentView, setCurrentView] = useState(0);
    const [mainComponent, setMainComponent] = useState(<LoadFilesView />);
    const [dataSheet, setDataSheet] = useState({});
    const [relationSheet, setRelationSheet] = useState({});
    const [dataFile, setDataFile] = useState(null);
    const [relationFile, setRelationFile] = useState(null);
    const [dataFileSize, setDataFileSize] = useState(0);
    const [relationFileSize, setRelationFileSize] = useState(0);
    const [dataFileOwnerUserId, setDataFileOwnerUserId] = useState(null);
    const [relationFileOwnerUserId, setRelationFileOwnerUserId] = useState(null);
    const [dataFileOwnerTeamId, setDataFileOwnerTeamId] = useState(null);
    const [relationFileOwnerTeamId, setRelationFileOwnerTeamId] = useState(null);
    const [dataDelimiter, setDataDelimiter] = useState('');
    const [relationDelimiter, setRelationDelimiter] = useState('');
    const [schemas, setSchemas] = useState([]);
    const [availableForUserSchemas, setAvailableForUserSchemas] = useState([]);
    const [currentSchemaId, setCurrentSchemaId] = useState(-1);
    const [currentSchemaChangedAndNotSaved, setCurrentSchemaChangedAndNotSaved] = useState(false);
    const [updateSchemas, setUpdateSchemas] = useState(false);
    const [dataSheetId, setDataSheetId] = useState(0);
    const [relationSheetId, setRelationSheetId] = useState(0);
    const [dataSheetName, setDataSheetName] = useState('');
    const [relationSheetName, setRelationSheetName] = useState('');
    const [isDataSheetColumnTypeNumber, setIsDataSheetColumnTypeNumber] = useState([]);
    const [isRelationSheetColumnTypeNumber, setIsRelationSheetColumnTypeNumber] = useState([]);

    useAlertOnPageLeave(dataSheetId || relationSheetId, content.leaveCorrelationPageAlert);

    useEffect(() => {
        const sheet1 = getUrlParam('sheet1');
        const sheet2 = getUrlParam('sheet2');
        const schema = getUrlParam('schema');

        const sheet1Id = parseInt(sheet1);
        const sheet2Id = parseInt(sheet2);

        if(sheet1Id && sheet2Id) {
            setFilenames(sheet1Id, sheet2Id);

            setDataSheetId(sheet1Id);
            setRelationSheetId(sheet2Id);

            if(parseInt(schema)) {
                setCurrentSchemaId(parseInt(schema));
            }
        }
    }, []);

    useEffect(() => {
        if(api && apiRequestId && apiToken) {
            getFilesByApiRequest(apiRequestId, apiToken)
                .then((res) => {
                    if(res?.data?.length > 1) {
                        const dataFileRow = res.data[0];
                        const relationFileRow = res.data[1];

                        setDataSheetId(dataFileRow.id);
                        setRelationSheetId(relationFileRow.id);
                        setDataSheetName(dataFileRow.filename);
                        setRelationSheetName(relationFileRow.filename);
                    }
                    else {
                        redirectToHomepage();
                    }
                })
        }
    }, [api, apiRequestId, apiToken]);

    useEffect(() => {
        if(apiToken && dataSheetId && user) {
            getSchemasByUserApiToken(apiToken)
                .then((res) => {
                    if(res?.data) {
                        setUserSchemas(res.data);
                    }
                });
        }
    }, [apiToken, user, dataSheetId]);

    useEffect(() => {
        if(user) {
            getSchemasByUser()
                .then((res) => {
                    if(res?.data) {
                        setUserSchemas(res.data);
                    }
                });
        }
    }, [updateSchemas, user]);

    useEffect(() => {
        if(user) {
            switch(currentView) {
                case 0:
                    setMainComponent(<LoadFilesView user={user} />);
                    break;
                case 1:
                    setMainComponent(<CorrelationView user={user} />);
                    break;
                default:
                    break;
            }
        }
    }, [currentView, user]);

    const setUserSchemas = (data) => {
        const allSchemas = data.map((item) => {
            return {
                value: item.schemas_id,
                label: item.schemas_name
            }
        });

        setSchemas(allSchemas);

        if(user.canEditTeamMatchSchemas) {
            setAvailableForUserSchemas(allSchemas);
        }
        else {
            setAvailableForUserSchemas(data.filter((item) => {
                return item.schemas_owner_user_id;
            }).map((item) => {
                return item.schemas_id;
            }));
        }
    }

    const setFilenames = (sheet1Id, sheet2Id) => {
        getFileById(sheet1Id)
            .then((res) => {
                if(res?.data) {
                    setDataSheetName(res.data.filename);
                }
            });

        getFileById(sheet2Id)
            .then((res) => {
                if(res?.data) {
                    setRelationSheetName(res.data.filename);
                }
            });
    }

    return <AppContext.Provider value={{
            currentView, setCurrentView,
            dataFile, setDataFile, relationFile, setRelationFile,
            dataSheet, setDataSheet, relationSheet, setRelationSheet,
            dataDelimiter, setDataDelimiter, relationDelimiter, setRelationDelimiter,
            schemas, setSchemas, currentSchemaId, setCurrentSchemaId, updateSchemas, setUpdateSchemas,
            availableForUserSchemas, setAvailableForUserSchemas,
            dataSheetId, setDataSheetId, relationSheetId, setRelationSheetId,
            dataSheetName, setDataSheetName, relationSheetName, setRelationSheetName,
            dataFileSize, setDataFileSize, relationFileSize, setRelationFileSize,
            dataFileOwnerUserId, setDataFileOwnerUserId, relationFileOwnerUserId, setRelationFileOwnerUserId,
            dataFileOwnerTeamId, setDataFileOwnerTeamId, relationFileOwnerTeamId, setRelationFileOwnerTeamId,
            isDataSheetColumnTypeNumber, setIsDataSheetColumnTypeNumber,
            isRelationSheetColumnTypeNumber, setIsRelationSheetColumnTypeNumber,
            currentSchemaChangedAndNotSaved, setCurrentSchemaChangedAndNotSaved
        }}>
            {mainComponent}
    </AppContext.Provider>
};

export default CorrelationPage;
export { AppContext }
