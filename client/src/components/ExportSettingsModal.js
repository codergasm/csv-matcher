import React, {useContext} from 'react';
import CloseModalButton from "./CloseModalButton";
import SelectInModal from "./SelectInModal";
import {ViewContext} from "./CorrelationView";
import ToggleButton from 'react-toggle-button'
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import {TranslationContext} from "../App";

const ExportSettingsModal = ({closeModal, columnsNames, exportOutputSheet}) => {
    const { content } = useContext(TranslationContext);
    const { matchType, exportFormat, setExportFormat,
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
                {content.exportSettings}
            </h4>

            <SelectInModal label={content.exportFormatLabel}
                           selectOption={exportFormat}
                           setSelectOption={setExportFormat}
                           options={content.exportFormatOptions} />

            {matchType !== 0 && exportFormat !== 2 ? <SelectInModal label={content.duplicatedRecordsFormatLabel}
                                                                    selectOption={duplicatedRecordsFormat}
                                                                    setSelectOption={setDuplicatedRecordsFormat}
                                                                    options={content.duplicatedRecordsFormatOptions} /> : ''}

            {duplicatedRecordsFormat === 2 ? <div className="selectNumberColumns">
                <span>
                    {content.columnsToSumLabel}
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

            <SelectInModal label={content.exportBuildSystemLabel}
                           selectOption={exportBuildSystem}
                           setSelectOption={setExportBuildSystem}
                           options={content.exportBuildSystemOptions} />

            {matchType > 0 ? <div className="modal__label modal__label--select modal__label--toggle">
                 <span>
                    {content.includeColumnWithMatchCounterLabel}
                </span>

                <ToggleButton inactiveLabel={''}
                              activeLabel={''}
                              value={includeColumnWithMatchCounter}
                              onToggle={(value) => { setIncludeColumnWithMatchCounter(!value); }} />
            </div> : ''}

            <button className="btn btn--export"
                    onClick={exportOutputSheet}>
                {content.exportOutputSheet}
            </button>
        </div>
    </div>
};

export default ExportSettingsModal;
