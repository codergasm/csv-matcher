import React, {useEffect, useState} from 'react';
import LoadFilesView from "../components/LoadFilesView";
import CorelationView from "../components/CorrelationView";
import {getSchemasByUser} from "../helpers/schemas";
import {getFileById} from "../helpers/files";

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
    const [currentSchema, setCurrentSchema] = useState(-1);
    const [updateSchemas, setUpdateSchemas] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sheet1 = params.get('sheet1');
        const sheet2 = params.get('sheet2');
        const schema = params.get('schema');

        if(sheet1 && sheet2) {
            getFileById(sheet1)
                .then((res) => {
                    console.log(res?.data);
                });

            getFileById(sheet2)
                .then((res) => {
                    console.log(res?.data);
                });
        }
    }, []);

    useEffect(() => {
        getSchemasByUser()
            .then((res) => {
                if(res?.data) {
                    setSchemas(res.data.map((item) => {
                        return {
                            value: item.id,
                            label: item.name
                        }
                    }));
                }
            });
    }, [updateSchemas]);

    useEffect(() => {
        if(user) {
            switch(currentView) {
                case 0:
                    setMainComponent(<LoadFilesView user={user} />);
                    break;
                case 1:
                    setMainComponent(<CorelationView user={user} />);
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
        schemas, setSchemas, currentSchema, setCurrentSchema, updateSchemas, setUpdateSchemas
    }}>
        {mainComponent}
    </AppContext.Provider>
};

export default CorrelationPage;
export { AppContext }
