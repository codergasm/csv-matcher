import React, {useContext} from 'react';
import Papa from "papaparse";
import {AppContext} from "../App";

const LoadFilesView = () => {
    const { setCurrentView, dataSheet, setDataSheet, relationSheet, setRelationSheet } = useContext(AppContext);

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
                {!dataSheet?.length ? <input className="loadFiles__input"
                                     type="file"
                                     accept=".csv,.xlsx,.xls"
                                     onChange={(e) => { handleDataSheetChange(e); }} /> :
                    <div className="sheetLoaded">
                        <p className="sheetLoaded__text">
                            Plik został dodany
                        </p>
                        <button className="btn btn--remove"
                                onClick={() => { setDataSheet([]); }}>
                            Usuń
                        </button>
                </div>}
            </div>

            <div className="loadFiles__inputWrapper">
                <span>
                    Dodaj plik źródłowy, z którego pobierzesz interesujące Cię kolumny uprzednio relacjonując
                    do nich rekordy z pliku pierwszego (np. arkusz z cenami/ kodami kreskowymi itd.)
                </span>
                {!relationSheet?.length ? <input className="loadFiles__input"
                                                 type="file"
                                                 accept=".csv,.xlsx,.xls"
                                                 onChange={(e) => { handleRelationSheetChange(e); }} /> :
                    <div className="sheetLoaded">
                        <p className="sheetLoaded__text">
                            Plik został dodany
                        </p>
                        <button className="btn btn--remove"
                                onClick={() => { setRelationSheet([]); }}>
                            Usuń
                        </button>
                    </div>}
            </div>
        </div>

        <button className="btn btn--loadFiles"
                disabled={!dataSheet?.length || !relationSheet?.length}
                onClick={() => { setCurrentView(1); }}>
            Przejdź do korelacji rekordów
        </button>
    </div>
};

export default LoadFilesView;
