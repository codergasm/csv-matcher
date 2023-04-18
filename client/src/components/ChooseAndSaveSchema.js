import React, {useContext, useEffect, useState} from 'react';
import {Tooltip} from "react-tippy";
import Select from 'react-select';
import {AppContext} from "../pages/CorrelationPage";
import {ViewContext} from "./CorrelationView";
import {saveSchema, updateSchema} from "../helpers/schemas";
import BottomNotification from "./BottomNotification";

const ChooseAndSaveSchema = ({user}) => {
    const { schemas, currentSchema, setCurrentSchema, setUpdateSchemas } = useContext(AppContext);
    const { priorities, matchSchemaArray } = useContext(ViewContext);

    const [name, setName] = useState('');
    const [notificationText, setNotificationText] = useState('');
    const [notificationColor, setNotificationColor] = useState('');
    const [newSchemaId, setNewSchemaId] = useState(-1);

    useEffect(() => {
        if(currentSchema === -1) {
            setName('nowy schemat');
        }
        else {
            setName('');
        }
    }, [currentSchema]);

    useEffect(() => {
        if(notificationText) {
            setTimeout(() => {
                setNotificationText('');
            }, 3000);
        }
    }, [notificationText]);

    useEffect(() => {
        if(newSchemaId !== -1) {
            setCurrentSchema(schemas.findIndex((item) => (item.value === newSchemaId)))
        }
    }, [newSchemaId, schemas]);

    const createSchemaWrapper = () => {
        saveSchema(name, matchSchemaArray, priorities, user.email, false)
            .then((res) => {
                setUpdateSchemas(p => !p);
                setNewSchemaId(res?.data?.id);
                setNotificationColor('#508345');
                setNotificationText('Schemat został dodany');
            })
            .catch(() => {
                setNotificationText('Coś poszło nie tak... Prosimy spróbować później');
                setNotificationColor('#ff0000');
            });
    }

    const updateSchemaWrapper = () => {
        updateSchema(schemas[currentSchema.value].id, name, matchSchemaArray, priorities)
            .then((res) => {
                setNotificationColor('#508345');
                setNotificationText('Schemat został zaktualizowany');
            })
            .catch(() => {
                setNotificationText('Coś poszło nie tak... Prosimy spróbować później');
                setNotificationColor('#ff0000');
            });
    }

    return <div className="schemaPicker">
        {notificationText ? <BottomNotification text={notificationText}
                                                background={notificationColor} /> : ''}

        <div className="schemaPicker__inner">
            <Tooltip title="Schemat dopasowania pozwala zapisać sposób dopasowania rekordów w arkuszu 1 do arkusza 2 - zarówno dopasowań automatycznych, ręcznych, jak i wyboru użytkownika spośród tych automatycznie wygenerowanych propozycji przez system.   Jest to bardzo przydatna funkcja, jeżeli przynajmniej więcej niż raz będziesz dopasowywać podobne arkusze do siebie, a już na wagę złota gdy czynisz to regularnie (np. regularnie wprowadzasz dostawy od danego dostawcy/ porównujesz ceny od danego dostawcy/ czy generalnie korzystasz z tych samych lub zbliżonych plików wejściowych). Co istotne - jeśli pliki będą się różnić bo np. zostały zaktualizowane i doszły lub usunięto jakieś wiersze - nie ma problemu! aplikacja również sobie z tym poradzi!"
                     followCursor={true}
                     size="small"
                     position="top">
                <span className="schemaPicker__tooltip">
                    ?
                </span>
            </Tooltip>

            Aktualny schemat dopasowania:

            <div className="selectWrapper">
                {currentSchema !== -1 ? <Select
                    options={schemas}
                    placeholder="Wybierz schemat"
                    value={schemas[currentSchema]}
                    onChange={setCurrentSchema}
                    isSearchable={true}
                /> : <input className="input input--schemaName"
                            placeholder="Nazwa schematu dopasowania"
                            value={name}
                            onChange={(e) => { setName(e.target.value); }} />}
            </div>

            {currentSchema === -1 ? <button className="btn btn--saveSchema"
                                           onClick={() => { createSchemaWrapper(); }}>
                Utwórz i zapisz schemat
            </button> : <button className="btn btn--saveSchema"
                                onClick={() => { updateSchemaWrapper(); }}>
                Zapisz zmiany w schemacie
            </button>}
        </div>
    </div>
};

export default ChooseAndSaveSchema;
