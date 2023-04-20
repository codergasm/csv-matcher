import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppContext} from "../pages/CorrelationPage";
import {addMissingKeys} from "../helpers/others";
import Loader from "./Loader";
import Papa from 'papaparse';
import {getFilesByUser, saveSheet} from "../helpers/files";
import SchemaPicker from "./SchemaPicker";
import Select from "react-select";
import {settings} from "../helpers/settings";

const LoadFilesView = ({user}) => {
    const { setCurrentView, dataSheet, setDataSheet, dataFile, relationFile,
        setDataFile, setRelationFile, setDataDelimiter, setRelationDelimiter,
        relationSheet, setRelationSheet, dataSheetId, setDataSheetId,
        relationSheetId, setRelationSheetId } = useContext(AppContext);

    const [files, setFiles] = useState([]);
    const [filesToChoose, setFilesToChoose] = useState([]);

    const [dataSheetLoading, setDataSheetLoading] = useState(false);
    const [relationSheetLoading, setRelationSheetLoading] = useState(false);
    const [assignDataSheetOwnershipToTeam, setAssignDataSheetOwnershipToTeam] = useState(false);
    const [assignRelationSheetOwnershipToTeam, setAssignRelationSheetOwnershipToTeam] = useState(false);
    const [loading, setLoading] = useState(false);

    let selectRelationSheetRef = useRef(null);
    let selectDataSheetRef = useRef(null);

    useEffect(() => {
        getFilesByUser()
            .then((res) => {
               if(res?.data) {
                   setFiles(res.data);
                   setFilesToChoose(res.data.map((item) => {
                       return {
                           value: item.id,
                           label: item.filename
                       }
                   }));
               }
            });
    }, []);

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

    useEffect(() => {
        if(dataSheetId > 0 && files?.length) {
            const file = files.find((item) => (item.id === dataSheetId));
            if(file) {
                updateDataSheet(`${settings.API_URL}/${file.filepath.replace('./', '')}`, true);
            }
        }
    }, [files, dataSheetId]);

    useEffect(() => {
        if(relationSheetId > 0 && files?.length) {
            const file = files.find((item) => (item.id === relationSheetId));
            if(file) {
                updateRelationSheet(`${settings.API_URL}/${file.filepath.replace('./', '')}`, true);
            }
        }
    }, [files, relationSheetId]);

    const handleRelationSheetChange = (e) => {
        const files = e.target.files;
        if(files) {
            setRelationSheetId(0);
            setRelationSheetLoading(true);
            updateRelationSheet(files[0]);
        }
    }

    const handleDataSheetChange = (e) => {
        const files = e.target.files;
        if(files) {
            setDataSheetId(0);
            setDataSheetLoading(true);
            updateDataSheet(files[0]);
        }
    }

    const handleDataSheetChoose = (val) => {
        if(val) {
            setDataSheetId(val.value);
        }
    }

    const handleRelationSheetChoose = (val) => {
        if(val) {
            setRelationSheetId(val.value);
        }
    }

    const updateRelationSheet = (file, download = false) => {
        Papa.parse(file, {
            download: download,
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
                setRelationFile(file);
            }
        });
    }

    const updateDataSheet = (file, download = false) => {
        Papa.parse(file, {
            download: download,
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
                setDataFile(file);
            }
        });
    }

    const saveFiles = async () => {
        try {
            setLoading(true);

            if(!dataSheetId) {
                const newDataSheet = await saveSheet(dataFile, user.teamId, assignDataSheetOwnershipToTeam);

                if(newDataSheet) {
                    setDataSheetId(newDataSheet.data.id);
                }
            }
            if(!relationSheetId) {
                const newRelationSheet = await saveSheet(relationFile, user.teamId, assignRelationSheetOwnershipToTeam);

                if(newRelationSheet) {
                    setRelationSheetId(newRelationSheet.data.id);
                }
            }

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
                    <div className="loadFiles__choose">
                        <Select
                            ref={selectDataSheetRef}
                            options={filesToChoose}
                            placeholder="Wybierz arkusz"
                            value={filesToChoose.find((item) => (item.value === dataSheetId))}
                            onChange={handleDataSheetChoose}
                            isSearchable={true}
                        />
                    </div>

                    {!dataSheet?.length && !dataSheetLoading ? <div className="loadFiles__dropzone">
                            <span>
                                Dodaj plik
                            </span>
                            <input className="loadFiles__input"
                                   type="file"
                                   accept=".csv,.xlsx,.xls"
                                   onChange={(e) => { handleDataSheetChange(e); }} />
                        </div> :
                        <div className="sheetLoaded">
                            {dataSheetLoading ? <div className="center">
                                <Loader />
                            </div> : <>
                                <p className="sheetLoaded__text">
                                    Plik został dodany
                                </p>
                                <button className="btn btn--remove"
                                        onClick={() => { selectDataSheetRef.current.clearValue(); setDataSheetId(0); setDataSheet([]); }}>
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
                    <div className="loadFiles__choose">
                        <Select
                            ref={selectRelationSheetRef}
                            options={filesToChoose}
                            placeholder="Wybierz arkusz"
                            value={filesToChoose.find((item) => (item.value === relationSheetId))}
                            onChange={handleRelationSheetChoose}
                            isSearchable={true}
                        />
                    </div>

                    {!relationSheet?.length && !relationSheetLoading ? <div className="loadFiles__dropzone">
                            <span>
                                Dodaj plik
                            </span>
                            <input className="loadFiles__input"
                                   type="file"
                                   accept=".csv,.xlsx,.xls"
                                   onChange={(e) => { handleRelationSheetChange(e); }} />
                        </div> :
                        <div className="sheetLoaded">
                            {relationSheetLoading ? <div className="center">
                                <Loader />
                            </div> : <>
                                <p className="sheetLoaded__text">
                                    Plik został dodany
                                </p>
                                <button className="btn btn--remove"
                                        onClick={() => { selectRelationSheetRef.current.clearValue(); setRelationSheetId(0); setRelationSheet([]); }}>
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
