import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppContext} from "../pages/CorrelationPage";
import {addMissingKeys} from "../helpers/others";
import Loader from "./Loader";
import Papa from 'papaparse';
import {getFilesByUser, saveSheet} from "../api/files";
import SchemaPicker from "./SchemaPicker";
import {settings} from "../helpers/settings";
import FilePicker from "./FilePicker";
import Row from "./Row";

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
        if(e.target.files) {
            setRelationSheetId(0);
            setRelationSheetLoading(true);
            updateRelationSheet(e.target.files[0]);
        }
    }

    const handleDataSheetChange = (e) => {
        if(e.target.files) {
            setDataSheetId(0);
            setDataSheetLoading(true);
            updateDataSheet(e.target.files[0]);
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
                setRelationSheet(convertResponseToObject(results.data));
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
                setDataSheet(convertResponseToObject(results.data));
                setDataFile(file);
            }
        });
    }

    const convertResponseToObject = (data) => {
        const obj = data.map((item, index) => {
            return {
                '0': index+1,
                ...item
            }
        });

        // Add missing keys and convert values to string
        return addMissingKeys(obj, Object.keys(obj[0])).map((item) => {
            return Object.fromEntries(Object.entries(item).map((item) => ([item[0], item[1].toString()])));
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
            console.log(e);
            setLoading(false);
            alert('Nie udało się dodać plików. Pamiętaj, aby pliki były zapisane w formacie .csv lub .txt');
        }
    }

    return <div className="container container--loadFiles w">
        <div className="homepage homepage--loadFiles">
            <h1 className="loadFiles__header">
                Wczytaj arkusze
            </h1>

            <Row>
                <FilePicker label={'Dodaj plik źródłowy, do którego będziesz relacjonować - np. arkusz z towarami.'}
                            selectRef={selectDataSheetRef}
                            options={filesToChoose}
                            handleChoose={handleDataSheetChoose}
                            handleChange={handleDataSheetChange}
                            sheet={dataSheet}
                            sheetId={dataSheetId}
                            setSheet={setDataSheet}
                            setSheetId={setDataSheetId}
                            sheetLoading={dataSheetLoading}
                            assignToTeam={assignDataSheetOwnershipToTeam}
                            setAssignToTeam={setAssignDataSheetOwnershipToTeam} />

                <FilePicker label={`Dodaj plik źródłowy, z którego pobierzesz interesujące Cię kolumny uprzednio relacjonując
                        do nich rekordy z pliku pierwszego (np. arkusz z cenami/ kodami kreskowymi itd.)`}
                            selectRef={selectRelationSheetRef}
                            options={filesToChoose}
                            handleChoose={handleRelationSheetChoose}
                            handleChange={handleRelationSheetChange}
                            sheet={relationSheet}
                            sheetId={relationSheetId}
                            setSheet={setRelationSheet}
                            setSheetId={setRelationSheetId}
                            sheetLoading={relationSheetLoading}
                            assignToTeam={assignRelationSheetOwnershipToTeam}
                            setAssignToTeam={setAssignRelationSheetOwnershipToTeam} />
            </Row>

            <SchemaPicker />

            {!loading ? <button className="btn btn--loadFiles"
                                disabled={!dataSheet?.length || !relationSheet?.length}
                                onClick={saveFiles}>
                Przejdź do korelacji rekordów
            </button> : <Loader width={50} />}
        </div>
    </div>
};

export default LoadFilesView;
