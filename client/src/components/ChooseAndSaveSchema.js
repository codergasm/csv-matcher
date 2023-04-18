import React, {useContext} from 'react';
import {Tooltip} from "react-tippy";
import Select from 'react-select';
import {AppContext} from "../pages/CorrelationPage";

const ChooseAndSaveSchema = () => {
    const { schemas, currentSchema, setCurrentSchema } = useContext(AppContext);

    const createSchemaWrapper = () => {

    }

    const updateSchemaWrapper = () => {

    }

    return <div className="schemaPicker">
        <div className="schemaPicker__inner">
            <Tooltip title="Schemat dopasowania pozwala zapisać sposób dopasowania rekordów w arkuszu 1 do arkusza 2 - zarówno dopasowań automatycznych, ręcznych, jak i wyboru użytkownika spośród tych automatycznie wygenerowanych propozycji przez system.   Jest to bardzo przydatna funkcja, jeżeli przynajmniej więcej niż raz będziesz dopasowywać podobne arkusze do siebie, a już na wagę złota gdy czynisz to regularnie (np. regularnie wprowadzasz dostawy od danego dostawcy/ porównujesz ceny od danego dostawcy/ czy generalnie korzystasz z tych samych lub zbliżonych plików wejściowych). Co istotne - jeśli pliki będą się różnić bo np. zostały zaktualizowane i doszły lub usunięto jakieś wiersze - nie ma problemu! aplikacja również sobie z tym poradzi!"
                     followCursor={true}
                     size="small"
                     position="top">
                <span className="schemaPicker__tooltip">
                    ?
                </span>
            </Tooltip>
            Schemat dopasowania

            <Select
                options={schemas}
                placeholder="Wybierz schemat"
                value={schemas[currentSchema]}
                onChange={setCurrentSchema}
                isSearchable={true}
            />

            {currentSchema === 0 ? <button className="btn btn--saveSchema"
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
