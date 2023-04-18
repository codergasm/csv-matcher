import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../pages/CorrelationPage";
import {addMissingKeys} from "../helpers/others";
import Loader from "./Loader";
import Papa from 'papaparse';
import {saveSheet} from "../helpers/files";
import SchemaPicker from "./SchemaPicker";

const LoadFilesView = ({user}) => {
    const { setCurrentView, dataSheet, setDataSheet, dataFile, relationFile,
        setDataFile, setRelationFile, setDataDelimiter, setRelationDelimiter,
        relationSheet, setRelationSheet } = useContext(AppContext);

    const [dataSheetLoading, setDataSheetLoading] = useState(false);
    const [relationSheetLoading, setRelationSheetLoading] = useState(false);
    const [assignDataSheetOwnershipToTeam, setAssignDataSheetOwnershipToTeam] = useState(false);
    const [assignRelationSheetOwnershipToTeam, setAssignRelationSheetOwnershipToTeam] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(relationSheet?.length) {
            setRelationSheetLoading(false);
        }
    }, [relationSheet]);

    useEffect(() => {
        if(dataSheet?.length) {
            setDataSheetLoading(false);
        }
    }, [dataSheet]);

    const handleRelationSheetChange = (e) => {
        const files = e.target.files;
        if(files) {
            setRelationSheetLoading(true);

            Papa.parse(files[0], {
                header: true,
                complete: function(results) {
                    setRelationDelimiter(results.meta.delimiter);

                    const obj = results.data.map((item, index) => {
                        return {
                            '0': index+1,
                            ...item
                        }
                    });

                    // Add missing keys and convert values to string
                    const objComplete = addMissingKeys(obj, Object.keys(obj[0])).map((item) => {
                        return Object.fromEntries(Object.entries(item).map((item) => ([item[0], item[1].toString()])));
                    });

                    setRelationSheet(objComplete);
                    setRelationFile(files[0]);
                }
            });
        }
    }

    const handleDataSheetChange = (e) => {
        const files = e.target.files;
        if(files) {
            setDataSheetLoading(true);

            Papa.parse(files[0], {
                header: true,
                complete: function(results) {
                    setDataDelimiter(results.meta.delimiter);

                    const obj = results.data.map((item, index) => {
                        return {
                            '0': index+1,
                            ...item
                        }
                    });

                    // Add missing keys and convert values to string
                    const objComplete = addMissingKeys(obj, Object.keys(obj[0])).map((item) => {
                        return Object.fromEntries(Object.entries(item).map((item) => ([item[0], item[1].toString()])));
                    });

                    setDataSheet(objComplete);
                    setDataFile(files[0]);
                }
            });
        }
    }

    const saveFiles = async () => {
        try {
            setLoading(true);
            await saveSheet(dataFile, user.teamId, assignDataSheetOwnershipToTeam);
            await saveSheet(relationFile, user.teamId, assignRelationSheetOwnershipToTeam);
            setLoading(false);

            setCurrentView(1);
        }
        catch(e) {
            alert('Nie udało się dodać plików. Pamiętaj, aby pliki były zapisane w formacie .csv lub .txt');
        }
    }

    return <div className="container container--loadFiles w">
        <div className="homepage homepage--loadFiles">
            <h1 className="loadFiles__header">
                Wczytaj arkusze
            </h1>

            <div className="flex">
                <div className="loadFiles__inputWrapper">
                <span>
                    Dodaj plik źródłowy, do którego będziesz relacjonować - np. arkusz z towarami.
                </span>
                    {!dataSheet?.length && !dataSheetLoading ? <input className="loadFiles__input"
                                                                      type="file"
                                                                      accept=".csv,.xlsx,.xls"
                                                                      onChange={(e) => { handleDataSheetChange(e); }} /> :
                        <div className="sheetLoaded">
                            {dataSheetLoading ? <div className="center">
                                <Loader />
                            </div> : <>
                                <p className="sheetLoaded__text">
                                    Plik został dodany
                                </p>
                                <button className="btn btn--remove"
                                        onClick={() => { setDataSheet([]); }}>
                                    Usuń
                                </button>
                            </>}
                        </div>}

                    <label className="label label--ownership">
                        <button className={assignDataSheetOwnershipToTeam ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                onClick={() => { setAssignDataSheetOwnershipToTeam(p => !p); }}>

                        </button>
                        uczyń zespół właścicielem pliku
                    </label>
                </div>

                <div className="loadFiles__inputWrapper">
                <span>
                    Dodaj plik źródłowy, z którego pobierzesz interesujące Cię kolumny uprzednio relacjonując
                    do nich rekordy z pliku pierwszego (np. arkusz z cenami/ kodami kreskowymi itd.)
                </span>
                    {!relationSheet?.length && !relationSheetLoading ? <input className="loadFiles__input"
                                                                              type="file"
                                                                              accept=".csv,.xlsx,.xls"
                                                                              onChange={(e) => { handleRelationSheetChange(e); }} /> :
                        <div className="sheetLoaded">
                            {relationSheetLoading ? <div className="center">
                                <Loader />
                            </div> : <>
                                <p className="sheetLoaded__text">
                                    Plik został dodany
                                </p>
                                <button className="btn btn--remove"
                                        onClick={() => { setRelationSheet([]); }}>
                                    Usuń
                                </button>
                            </>}
                        </div>}

                    <label className="label label--ownership">
                        <button className={assignRelationSheetOwnershipToTeam ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                onClick={() => { setAssignRelationSheetOwnershipToTeam(p => !p); }}>

                        </button>
                        uczyń zespół właścicielem pliku
                    </label>
                </div>
            </div>

            <SchemaPicker />

            {!loading ? <button className="btn btn--loadFiles"
                                disabled={!dataSheet?.length || !relationSheet?.length}
                                onClick={() => { saveFiles(); }}>
                Przejdź do korelacji rekordów
            </button> : <Loader width={50} />}
        </div>
    </div>
};

export default LoadFilesView;
