import React, {useContext} from 'react';
import Papa from "papaparse";
import {AppContext} from "../App";

const LoadFilesView = () => {
    const { setCurrentView, setDataSheet, setRelationSheet } = useContext(AppContext);

    const handleRelationSheetChange = (e) => {
        const files = e.target.files;
        if(files) {
            Papa.parse(files[0], {
                header: true,
                complete: function(results) {
                    setRelationSheet(results.data);
                }}
            );
        }
    }

    const handleDataSheetChange = (e) => {
        const files = e.target.files;
        if(files) {
            Papa.parse(files[0], {
                header: true,
                complete: function(results) {
                    setDataSheet(results.data);
                }}
            );
        }
    }

    return <div className="container container--loadFiles w">
        <h1 className="loadFiles__header">
            Wczytaj arkusze
        </h1>

        <div className="flex">
            <div className="loadFiles__inputWrapper">
                <span>
                    Dodaj plik źródłowy, do którego będziesz relacjonować - np. arkusz z towarami.
                </span>
                <input className="loadFiles__input"
                       type="file"
                       accept=".csv,.xlsx,.xls"
                       onChange={(e) => { handleDataSheetChange(e); }} />
            </div>

            <div className="loadFiles__inputWrapper">
                <span>
                    Dodaj plik źródłowy, z którego pobierzesz interesujące Cię kolumny uprzednio relacjonując
                    do nich rekordy z pliku pierwszego (np. arkusz z cenami/ kodami kreskowymi itd.)
                </span>
                <input className="loadFiles__input"
                       type="file"
                       accept=".csv,.xlsx,.xls"
                       onChange={(e) => { handleRelationSheetChange(e); }} />
            </div>
        </div>

        <button className="btn btn--loadFiles"
                onClick={() => { setCurrentView(1); }}>
            Przejdź do korelacji rekordów
        </button>
    </div>
};

export default LoadFilesView;
