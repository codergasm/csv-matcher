import React, {useEffect, useState} from 'react';
import LoadFilesView from "../components/LoadFilesView";
import CorrelationView from "../components/CorrelationView";
import {getSchemasByUser} from "../api/schemas";
import {getFileById} from "../api/files";

const AppContext = React.createContext(null);

const CorrelationPage = ({user}) => {
    const [currentView, setCurrentView] = useState(0);
    const [mainComponent, setMainComponent] = useState(<LoadFilesView />);
    const [dataSheet, setDataSheet] = useState({});
    const [relationSheet, setRelationSheet] = useState({});
    const [dataFile, setDataFile] = useState(null);
    const [relationFile, setRelationFile] = useState(null);
    const [dataDelimiter, setDataDelimiter] = useState('');
    const [relationDelimiter, setRelationDelimiter] = useState('');
    const [schemas, setSchemas] = useState([]);
    const [availableForUserSchemas, setAvailableForUserSchemas] = useState([]);
    const [currentSchemaId, setCurrentSchemaId] = useState(-1);
    const [updateSchemas, setUpdateSchemas] = useState(false);
    const [dataSheetId, setDataSheetId] = useState(0);
    const [relationSheetId, setRelationSheetId] = useState(0);
    const [dataSheetName, setDataSheetName] = useState('');
    const [relationSheetName, setRelationSheetName] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sheet1 = params.get('sheet1');
        const sheet2 = params.get('sheet2');
        const schema = params.get('schema');

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
        getSchemasByUser()
            .then((res) => {
                if(res?.data) {
                    const allSchemas = res.data.map((item) => {
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
                        setAvailableForUserSchemas(res.data.filter((item) => {
                            return item.schemas_owner_user_id;
                        }).map((item) => {
                            return item.schemas_id;
                        }));
                    }
                }
            });
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
            })
    }

    return <AppContext.Provider value={{
        currentView, setCurrentView,
        dataFile, setDataFile, relationFile, setRelationFile,
        dataSheet, setDataSheet, relationSheet, setRelationSheet,
        dataDelimiter, setDataDelimiter, relationDelimiter, setRelationDelimiter,
        schemas, setSchemas, currentSchemaId, setCurrentSchemaId, updateSchemas, setUpdateSchemas,
        availableForUserSchemas, setAvailableForUserSchemas,
        dataSheetId, setDataSheetId, relationSheetId, setRelationSheetId,
        dataSheetName, setDataSheetName, relationSheetName, setRelationSheetName
    }}>
        {mainComponent}
    </AppContext.Provider>
};

export default CorrelationPage;
export { AppContext }
