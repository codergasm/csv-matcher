import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../App";
import {addMissingKeys} from "../helpers/others";
import Loader from "./Loader";
import {convertCsvToArray} from "../helpers/matching";
import Papa from 'papaparse';

const LoadFilesView = () => {
    const { setCurrentView, dataSheet, setDataSheet,
        setDataFile, setRelationFile, setDataDelimiter, setRelationDelimiter,
        relationSheet, setRelationSheet } = useContext(AppContext);

    const [dataSheetLoading, setDataSheetLoading] = useState(false);
    const [relationSheetLoading, setRelationSheetLoading] = useState(false);

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

                    // Add missing keys
                    const objComplete = addMissingKeys(obj, Object.keys(obj[0]));

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

                    // Add missing keys
                    const objComplete = addMissingKeys(obj, Object.keys(obj[0]));

                    setDataSheet(objComplete);
                    setDataFile(files[0]);
                }
            });
        }
    }

    return <div className="container container--loadFiles w">
        <h1 className="loadFiles__header">
            Wczytaj arkusze
        </h1>

        <div className="flex">
            <div className="loadFiles__inputWrapper">
                <span>
                    Dodaj plik ??r??d??owy, do kt??rego b??dziesz relacjonowa?? - np. arkusz z towarami.
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
                                Plik zosta?? dodany
                            </p>
                            <button className="btn btn--remove"
                                    onClick={() => { setDataSheet([]); }}>
                                Usu??
                            </button>
                        </>}
                </div>}
            </div>

            <div className="loadFiles__inputWrapper">
                <span>
                    Dodaj plik ??r??d??owy, z kt??rego pobierzesz interesuj??ce Ci?? kolumny uprzednio relacjonuj??c
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
                                Plik zosta?? dodany
                            </p>
                            <button className="btn btn--remove"
                                    onClick={() => { setRelationSheet([]); }}>
                                Usu??
                            </button>
                        </>}
                    </div>}
            </div>
        </div>

        <button className="btn btn--loadFiles"
                disabled={!dataSheet?.length || !relationSheet?.length}
                onClick={() => { setCurrentView(1); }}>
            Przejd?? do korelacji rekord??w
        </button>
    </div>
};

export default LoadFilesView;
