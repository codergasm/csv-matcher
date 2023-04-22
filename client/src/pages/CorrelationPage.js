import React, {useEffect, useState} from 'react';
import LoadFilesView from "../components/LoadFilesView";
import CorrelationView from "../components/CorrelationView";
import {getSchemasByUser} from "../helpers/schemas";

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

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sheet1 = params.get('sheet1');
        const sheet2 = params.get('sheet2');
        const schema = params.get('schema');

        if(parseInt(sheet1) && parseInt(sheet2)) {
            setDataSheetId(parseInt(sheet1));
            setRelationSheetId(parseInt(sheet2));

            if(parseInt(schema)) {
                setCurrentSchemaId(parseInt(schema));
            }
        }
    }, []);


    useEffect(() => {
        console.log(availableForUserSchemas);
    }, [availableForUserSchemas]);

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

    return <AppContext.Provider value={{
        currentView, setCurrentView,
        dataFile, setDataFile, relationFile, setRelationFile,
        dataSheet, setDataSheet, relationSheet, setRelationSheet,
        dataDelimiter, setDataDelimiter, relationDelimiter, setRelationDelimiter,
        schemas, setSchemas, currentSchemaId, setCurrentSchemaId, updateSchemas, setUpdateSchemas,
        availableForUserSchemas, setAvailableForUserSchemas,
        dataSheetId, setDataSheetId, relationSheetId, setRelationSheetId
    }}>
        {mainComponent}
    </AppContext.Provider>
};

export default CorrelationPage;
export { AppContext }
