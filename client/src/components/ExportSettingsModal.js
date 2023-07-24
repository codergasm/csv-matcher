import React, {useContext} from 'react';
import CloseModalButton from "./CloseModalButton";
import SelectInModal from "./SelectInModal";
import {ViewContext} from "./CorrelationView";
import ToggleButton from 'react-toggle-button'
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";

const exportFormatOptions = [
    {
        value: 0,
        label: '.csv oddzielony przecinkiem'
    },
    {
        value: 1,
        label: '.csv oddzielny średnikiem'
    },
    {
        value: 2,
        label: 'tablica obiektów JSON'
    }
];

const duplicatedRecordsFormatOptions = [
    {
        value: 0,
        label: 'eksportuj duplikaty rekordów'
    },
    {
        value: 1,
        label: 'zawsze separuj przecinkiem'
    },
    {
        value: 2,
        label: 'sumuj wartości lub separuj przecinkiem'
    }
];

const exportBuildSystemOptions = [
    {
        value: 0,
        label: 'Tylko dopasowanych rekordów'
    },
    {
        value: 1,
        label: 'Wszystkie rekordy z arkusza 1'
    },
    {
        value: 2,
        label: 'Wszystkie rekordy z arkusza 2'
    }
];

const ExportSettingsModal = ({closeModal, columnsNames, exportOutputSheet}) => {
    const { matchType, exportFormat, setExportFormat, outputSheetExportColumns,
        duplicatedRecordsFormat, setDuplicatedRecordsFormat,
        columnsToSum, setColumnsToSum,
        exportBuildSystem, setExportBuildSystem,
        includeColumnWithMatchCounter, setIncludeColumnWithMatchCounter } = useContext(ViewContext);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    const updateColumnsToSum = (index) => {
        setColumnsToSum(prevState => (prevState.map((item, i) => {
            if(i === index) return !item;
            else return item;
        })));
    }

    return <div className="modal modal--export">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner scroll">
            <h4 className="modal__header modal__header--center">
                Ustawienia eksportu
            </h4>

            <SelectInModal label={'Format wyjściowy:'}
                           selectOption={exportFormat}
                           setSelectOption={setExportFormat}
                           options={exportFormatOptions} />

            {matchType !== 0 && exportFormat !== 2 ? <SelectInModal label={'Formatowanie zduplikowanych rekordów (w wyniku relacji wiele do...):'}
                                                                    selectOption={duplicatedRecordsFormat}
                                                                    setSelectOption={setDuplicatedRecordsFormat}
                                                                    options={duplicatedRecordsFormatOptions} /> : ''}

            {duplicatedRecordsFormat === 2 ? <div className="selectNumberColumns">
                <span>
                    Wskaź kolumny, które należy sumować:
                </span>

                {columnsNames.map((item, index) => {
                    return <label className="modal__label"
                                  key={index}>
                        <button className={columnsToSum[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                onClick={() => { updateColumnsToSum(index); }}>

                        </button>
                        {item}
                    </label>
                })}
            </div> : ''}

            <SelectInModal label={'Arkusz wyjściowy buduj z:'}
                           selectOption={exportBuildSystem}
                           setSelectOption={setExportBuildSystem}
                           options={exportBuildSystemOptions} />

            <div className="modal__label modal__label--select modal__label--toggle">
                 <span>
                    Dodaj kolumnę wskazującą ilość dopasowań dla danego rekordu:
                </span>

                <ToggleButton inactiveLabel={''}
                              activeLabel={''}
                              value={includeColumnWithMatchCounter}
                              onToggle={(value) => { setIncludeColumnWithMatchCounter(!value); }} />
            </div>

            <button className="btn btn--export"
                    onClick={exportOutputSheet}>
                Eksportuj arkusz wyjściowy
            </button>
        </div>
    </div>
};

export default ExportSettingsModal;
