import React from 'react';
import Select from "react-select";
import Loader from "./Loader";
import SheetFileAddedView from "./SheetFileAddedView";

const FilePicker = ({label, selectRef, options, sheet, sheetId, sheetLoading,
                        setSheetId, setSheet, handleChoose, handleChange, assignToTeam, setAssignToTeam}) => {
    const toggleAssignOwnershipToTeam = () => {
        setAssignToTeam(p => !p);
    }

    const removeFile = () => {
        selectRef.current.clearValue();
        setSheetId(0);
        setSheet([]);
    }

    const isSheetAdded = () => {
        return sheet?.length || sheetLoading;
    }

    return <div className="loadFiles__inputWrapper">
        <span>
            {label}
        </span>
        <div className="loadFiles__choose">
            <Select ref={selectRef}
                    options={options}
                    placeholder="Wybierz arkusz"
                    value={options.find((item) => (item.value === sheetId))}
                    onChange={handleChoose}
                    isSearchable={true} />
        </div>

        {isSheetAdded() ? <div className="sheetLoaded">
            {sheetLoading ? <div className="center">
                <Loader />
            </div> : <SheetFileAddedView removeFile={removeFile} />}
        </div> : <div className="loadFiles__dropzone">
                <span>
                    Dodaj plik
                </span>
                <input className="loadFiles__input"
                       type="file"
                       accept=".csv,.xlsx,.xls"
                       onChange={handleChange} />
            </div>}

        <label className="label label--ownership">
            <button className={assignToTeam ? "btn btn--check btn--check--selected" : "btn btn--check"}
                    onClick={toggleAssignOwnershipToTeam}>

            </button>
            uczyń zespół właścicielem pliku
        </label>
    </div>
};

export default FilePicker;
