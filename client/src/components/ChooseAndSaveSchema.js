import React, {useContext, useEffect, useState} from 'react';
import {Tooltip} from "react-tippy";
import Select from 'react-select';
import {AppContext} from "../pages/CorrelationPage";
import {ViewContext} from "./CorrelationView";
import {saveSchema, updateSchema} from "../api/schemas";
import BottomNotification from "./BottomNotification";

const ChooseAndSaveSchema = ({user}) => {
    const { schemas, availableForUserSchemas, currentSchemaId, setCurrentSchemaId, setUpdateSchemas,
        dataSheetId, relationSheetId } = useContext(AppContext);
    const { priorities, matchSchemaArray } = useContext(ViewContext);

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
            setName('nowy schemat');
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

    const createSchemaWrapper = () => {
        saveSchema(name, matchSchemaArray, priorities, user.email, false, dataSheetId, relationSheetId)
            .then((res) => {
                setUpdateSchemas(p => !p);
                setCurrentSchemaId(res?.data?.id);
                setNotificationColor('#508345');
                setNotificationText('Schemat został dodany');
            })
            .catch(() => {
                setNotificationText('Coś poszło nie tak... Prosimy spróbować później');
                setNotificationColor('#ff0000');
            });
    }

    const updateSchemaWrapper = () => {
        updateSchema(currentSchemaId, name, matchSchemaArray, priorities, dataSheetId, relationSheetId)
            .then((res) => {
                setNotificationColor('#508345');
                setNotificationText('Schemat został zaktualizowany');
            })
            .catch(() => {
                setNotificationText('Coś poszło nie tak... Prosimy spróbować później');
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
                        Schemat dopasowania pozwala zapisać sposób dopasowania rekordów w arkuszu 1 do arkusza 2 - zarówno dopasowań automatycznych, ręcznych, jak i wyboru użytkownika spośród tych automatycznie wygenerowanych propozycji przez system. Jest to bardzo przydatna funkcja, jeżeli przynajmniej więcej niż raz będziesz dopasowywać podobne arkusze do siebie, a już na wagę złota gdy czynisz to regularnie (np. regularnie wprowadzasz dostawy od danego dostawcy/ porównujesz ceny od danego dostawcy/ czy generalnie korzystasz z tych samych lub zbliżonych plików wejściowych). Co istotne - jeśli pliki będą się różnić bo np. zostały zaktualizowane i doszły lub usunięto jakieś wiersze - nie ma problemu! aplikacja również sobie z tym poradzi!
                    </span> : ''}
                </span>

            Aktualny schemat dopasowania:

            <div className="selectWrapper">
                {currentSchemaId !== -1 ? <Select
                    options={schemas}
                    placeholder="Wybierz schemat"
                    value={schemas.find((item) => (item.value === currentSchemaId))}
                    onChange={handleChange}
                    isSearchable={true}
                /> : <input className="input input--schemaName"
                            placeholder="Nazwa schematu dopasowania"
                            value={name}
                            onChange={(e) => { setName(e.target.value); }} />}
            </div>

            {(!isCurrentSchemaTeam || user.canEditTeamMatchSchemas || currentSchemaId === -1) ? (currentSchemaId === -1 ? <button className="btn btn--saveSchema"
                                           onClick={() => { createSchemaWrapper(); }}>
                Utwórz i zapisz schemat
            </button> : <button className="btn btn--saveSchema"
                                onClick={() => { updateSchemaWrapper(); }}>
                Zapisz zmiany w schemacie
            </button>) : ''}
        </div>
    </div>
};

export default ChooseAndSaveSchema;
