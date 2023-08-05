import React, {useContext, useEffect, useRef, useState} from 'react';
import Select from "react-select";
import {ViewContext} from "./CorrelationView";
import {TranslationContext} from "../App";
import {ApiContext} from "./LoggedUserWrapper";
import RelationTypeTooltip from "./RelationTypeTooltip";
import ChangeMatchTypeModal from "./ChangeMatchTypeModal";
import cleanCorrelationMatrix from "../helpers/cleanCorrelationMatrix";
import {AppContext} from "../pages/CorrelationPage";

const MatchTypeSelect = () => {
    const { content } = useContext(TranslationContext);
    const { dataSheet, relationSheet } = useContext(AppContext);
    const { apiRelationType } = useContext(ApiContext);
    const { matchType, setMatchType, indexesOfCorrelatedRows, setIndexesOfCorrelatedRows,
         setAfterMatchClean, setManuallyCorrelatedRows, setCorrelationMatrix } = useContext(ViewContext);

    const [options, setOptions] = useState([]);
    const [candidateValue, setCandidateValue] = useState(null);
    const [alertModalVisible, setAlertModalVisible] = useState(false);

    let selectRef = useRef(null);
    let selectLabel = useRef(null);

    useEffect(() => {
        if(apiRelationType !== -1) {
            setMatchType(apiRelationType);
        }
    }, [apiRelationType]);

    useEffect(() => {
        if(content) {
            setOptions(content.relationTypes.map((item, index) => {
                return {
                    label: item,
                    value: index
                }
            }));
        }
    }, [content]);

    const menuOpen = () => {
        selectLabel.current.style.zIndex = '1999';
    }

    const menuClose = () => {
        selectLabel.current.style.zIndex = '10';
    }

    const handleChoose = (e) => {
        if(indexesOfCorrelatedRows.length) {
            setAlertModalVisible(true);
            setCandidateValue(e.value);
        }
        else {
            setMatchType(e.value);
        }
    }

    const confirmMatchTypeChange = () => {
        setMatchType(candidateValue);
        setAlertModalVisible(false);

        setIndexesOfCorrelatedRows([]);
        setManuallyCorrelatedRows([]);
        setCorrelationMatrix(cleanCorrelationMatrix(dataSheet, relationSheet));
        setAfterMatchClean(true);
    }

    return <div className="matchTypeSelectLabel"
                ref={selectLabel}>
        {alertModalVisible ? <ChangeMatchTypeModal closeModal={() => { setAlertModalVisible(false); }}
                                                   handleSubmit={confirmMatchTypeChange} /> : ''}

        <span>
            {content.relationType}
        </span>

        <Select ref={selectRef}
                onMenuClose={menuClose}
                onMenuOpen={menuOpen}
                options={options}
                placeholder={content.relationTypePlaceholder}
                value={options[matchType]}
                onChange={handleChoose}
                isDisabled={apiRelationType !== -1}
                isSearchable={true} />

        <RelationTypeTooltip />
    </div>
};

export default MatchTypeSelect;
