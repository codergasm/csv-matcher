import React, {useContext, useEffect, useState} from 'react';
import {ViewContext} from "./CorrelationView";
import {AppContext} from "../pages/CorrelationPage";
import { stringSimilarity } from "string-similarity-js";
import getSimilarityColor from "../helpers/getSimilarityColor";
import {findSubstrings} from "../helpers/others";
import ColorMarkedText from "./ColorMarkedText";
import CloseModalButton from "./CloseModalButton";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";

const TestConfigurationModal = ({closeModal, relationSheetColumnsVisibility}) => {
    const { dataSheet, relationSheet } = useContext(AppContext);
    const { showInSelectMenuColumns, priorities, matchThreshold } = useContext(ViewContext);

    const [relationSheetRowNumber, setRelationSheetRowNumber] = useState(1);
    const [relationSheetColumnsNames, setRelationSheetColumnsNames] = useState([]);
    const [dataSheetColumnsNames, setDataSheetColumnsNames] = useState([]);
    const [selectList, setSelectList] = useState([]);
    const [joinStringOfColumnsFromRelationSheet, setJoinStringOfColumnsFromRelationSheet] = useState('');
    const [columnsNamesInConditions, setColumnsNamesInConditions] = useState([]);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    useEffect(() => {
        setColumnsNamesInConditions(priorities.map((item) => (item.conditions.map((item) => (item.dataSheet)))).flat());
    }, [priorities]);

    useEffect(() => {
        if(relationSheet) {
            setRelationSheetColumnsNames(Object.entries(relationSheet[0]).map((item) => (item[0] === '0' ? 'l.p.' : item[0])));
        }
    }, [relationSheet]);

    useEffect(() => {
        setDataSheetColumnsNames(Object.entries(dataSheet[0]).map((item) => (item[0] === '0' ? 'l.p.' : item[0])))
    }, [dataSheet]);

    const getSimilarityScores = (conditions, logicalOperators, relationRow) => {
        let relationRowSimilarities = [];

        for(const dataRow of dataSheet) {
            // Calculate similarities
            let similarities = [];
            for(let i=0; i<conditions.length; i++) {
                const dataSheetPart = dataRow[conditions[i].dataSheet];
                const relationSheetPart = relationRow[conditions[i].relationSheet];

                if(dataSheetPart && relationSheetPart) {
                    const pairSimilarity = stringSimilarity(dataSheetPart.toString(), relationSheetPart.toString());
                    similarities.push(pairSimilarity);
                }
                else {
                    similarities.push(0);
                }
            }

            // Calculate final similarity based on conditions - default first similarity
            // (if no conditions, loop will be omitted)
            let finalSimilarity = similarities[0];

            if(similarities.length > 1) {
                for(let i=0; i<similarities.length-1; i++) {
                    if(logicalOperators[i] === 1) { // or
                        let firstNumber = finalSimilarity === -1 ? similarities[i] : finalSimilarity;
                        let secondNumber = similarities[i+1];

                        finalSimilarity = Math.max(firstNumber, secondNumber);
                    }
                    else { // and
                        let firstNumber = finalSimilarity === -1 ? similarities[i] : finalSimilarity;
                        let secondNumber = similarities[i+1];

                        finalSimilarity = Math.min(firstNumber, secondNumber);
                    }
                }
            }

            relationRowSimilarities.push(Math.max(finalSimilarity * 100, 0));
        }

        return relationRowSimilarities;
    }

    const getCorrelationMatrix = () => {
        let correlationMatrixTmp = [];
        let priorityIndex = 0;

        for(const priority of priorities) {
            // Get similarities for all rows for current priority
            // [[relation row 1 similarities], [relation row 2 similarities] ...]
            const logicalOperators = priority.logicalOperators.map((item) => (parseInt(item)));
            const similarityScores = getSimilarityScores(priority.conditions, logicalOperators, relationSheet[relationSheetRowNumber-1]);

            let relationRowIndex = 0;
            for(const relationRowSimilarities of similarityScores) {
                correlationMatrixTmp.push(relationRowSimilarities);

                relationRowIndex++;
            }

            priorityIndex++;
        }

        return correlationMatrixTmp;
    }

    useEffect(() => {
        setJoinStringOfColumnsFromRelationSheet(priorities.map((item) => {
            return item.conditions.map((item) => {
                return item.relationSheet;
            });
        })
            .flat()
            .map((item, i) => {
                return relationSheet[relationSheetRowNumber-1] ? relationSheet[relationSheetRowNumber-1][item] : '';
            })
            .join(' '));
    }, [relationSheetRowNumber]);

    const startTestCorrelation = () => {
        // Get array of correlation value by dataSheet row index
        let correlationMatrixTmp = getCorrelationMatrix();

        const selectListTmp = correlationMatrixTmp.map((similarity, dataRowIndex) => {
           return {
               dataRowIndex,
               similarity
           }
        }).sort((a, b) => {
            if(parseInt(a.similarity) < parseInt(b.similarity)) {
                return 1;
            }
            else if(parseInt(a.similarity) > parseInt(b.similarity)) {
                return -1;
            }
            else {
                return a.dataRowIndex > b.dataRowIndex ? 1 : -1;
            }
        });

        setSelectList(selectListTmp);
    }

    return <div className="modal modal--testConfiguration">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner scroll">
            <div className="modal__top">
                <button className="btn btn--openTestConfigurationModal"
                        onClick={closeModal}>
                    Powrót
                </button>

                <h3 className="modal__header">
                    Przetestuj konfigurację
                </h3>
            </div>

            <div className="modal__line">
                <span>
                    Arkusz 2 - numer wiersza: <input className="input input--number"
                                                   value={relationSheetRowNumber}
                                                   onChange={(e) => { setRelationSheetRowNumber(isNaN(parseInt(e.target.value)) ? '' : parseInt(e.target.value)); }} />
                </span>
                {relationSheetRowNumber > dataSheet?.length ? <span className="red">
                    Nie ma takiego wiersza. Liczba wierszy w arkuszu 2 to: {relationSheet?.length}
                </span> : ''}

                <div className="marginTop">
                    <div className="container--scrollX scroll">
                        <div className="flex">
                            {relationSheetColumnsNames.map((item, index) => {
                                if(relationSheetColumnsVisibility[index]) {
                                    return <div className={index === 0 ? "sheet__header__cell sheet__header__cell--first" : "sheet__header__cell"}
                                                style={{
                                                    minWidth: `300px`
                                                }}
                                                key={index}>
                                        {item}
                                    </div>
                                }
                            })}
                        </div>
                        <div className="line line--tableRow">
                            {/* Relation sheet columns */}
                            {relationSheet[relationSheetRowNumber-1] ? Object.entries(relationSheet[relationSheetRowNumber-1]).map((item, index) => {
                                const cellValue = item[1];

                                if(relationSheetColumnsVisibility[index]) {
                                    return <div className={index === 0 ? "sheet__body__row__cell sheet__body__row__cell--first" : "sheet__body__row__cell"}
                                                style={{
                                                    minWidth: `300px`
                                                }}
                                                key={index}>
                                        {cellValue}
                                    </div>
                                }
                            }) : ''}
                        </div>
                    </div>
                </div>

                <button className="btn btn--startAutoMatch btn--startAutoMatchTest"
                        onClick={() => { startTestCorrelation(); }}>
                    Uruchom automatyczne dopasowanie testowo tylko dla wiersza powyżej
                </button>

                {selectList?.length ? <div className="testConfiguration__selectList">
                    {selectList[0].similarity > matchThreshold ? <>
                        <p className="text-center">
                            Znaleziono dopasowanie do wiersza <b>nr {selectList[0].dataRowIndex}</b> z arkusza 1.
                        </p>

                        <div className="center">
                            <div className="container--scrollX scroll">
                                <div className="line line--noFlex">
                                    {dataSheetColumnsNames.map((item, index) => {
                                        if(showInSelectMenuColumns[index]) {
                                            return <div className={index === 0 ? "sheet__header__cell sheet__header__cell--first" : "sheet__header__cell"}
                                                        style={{
                                                            minWidth: `300px`
                                                        }}
                                                        key={index}>

                                                {item}
                                            </div>
                                        }
                                        else {
                                            return '';
                                        }
                                    })}

                                    <div className="sheet__header__cell">
                                        Dopasowanie
                                    </div>
                                </div>
                                <div className="line line--tableRow">
                                    {Object.entries(dataSheet[selectList[0].dataRowIndex]).map((item, index) => {
                                        const cellValue = item[1];
                                        let substringIndexes = [];

                                        if(columnsNamesInConditions.includes(item[0])) {
                                            substringIndexes = findSubstrings(joinStringOfColumnsFromRelationSheet, cellValue);
                                        }

                                        if(showInSelectMenuColumns[index]) {
                                            return <div className={index === 0 ? "sheet__body__row__cell sheet__body__row__cell--first" : "sheet__body__row__cell"}
                                                        style={{
                                                            minWidth: `300px`
                                                        }}
                                                        key={index}>
                                                <ColorMarkedText string={cellValue}
                                                                 indexes={substringIndexes} />
                                            </div>
                                        }
                                        else {
                                            return '';
                                        }
                                    })}

                                    <div className="sheet__body__row__cell sheet__body__row__cell--center" style={{
                                        background: getSimilarityColor(selectList[0].similarity)
                                    }}>
                                        {selectList[0].similarity}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-center">
                            Poniżej znajduje się lista pozostałych dziesięciu najwyżej dopasowanych rekordów.
                        </p>

                        <div className="center">
                            <div className="container--scrollX scroll">
                                <div className="line line--noFlex">
                                    {dataSheetColumnsNames.map((item, index) => {
                                        if(showInSelectMenuColumns[index]) {
                                            return <div className={index === 0 ? "sheet__header__cell sheet__header__cell--first" : "sheet__header__cell"}
                                                        style={{
                                                            minWidth: `300px`
                                                        }}
                                                        key={index}>

                                                {item}
                                            </div>
                                        }
                                        else {
                                            return '';
                                        }
                                    })}

                                    <div className="sheet__header__cell">
                                        Dopasowanie
                                    </div>
                                </div>
                                {selectList.slice(1, 11).map((item, index) => {
                                    const similarity = item.similarity?.toFixed();

                                    return <div className="line line--tableRow" key={index}>
                                        {Object.entries(dataSheet[item.dataRowIndex]).map((item, index) => {
                                            const cellValue = item[1];
                                            let substringIndexes = [];

                                            if(columnsNamesInConditions.includes(item[0])) {
                                                substringIndexes = findSubstrings(joinStringOfColumnsFromRelationSheet, cellValue);
                                            }

                                            if(showInSelectMenuColumns[index]) {
                                                return <div className={index === 0 ? "sheet__body__row__cell sheet__body__row__cell--first" : "sheet__body__row__cell"}
                                                            style={{
                                                                minWidth: `300px`
                                                            }}
                                                            key={index}>
                                                    <ColorMarkedText string={cellValue}
                                                                     indexes={substringIndexes} />
                                                </div>
                                            }
                                            else {
                                                return '';
                                            }
                                        })}

                                        <div className="sheet__body__row__cell sheet__body__row__cell--center" style={{
                                            background: getSimilarityColor(similarity)
                                        }}>
                                            {similarity}%
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </> : <>
                        <p className="text-center">
                            Nie znaleziono dopasowania powyżej wyznaczonego progu ({matchThreshold}%).
                            Poniżej znajduje się lista dziesięciu najwyżej dopasowanych rekordów.
                        </p>

                        <div className="center">
                            <div className="container--scrollX scroll">
                                <div className="line line--noFlex">
                                    {dataSheetColumnsNames.map((item, index) => {
                                        if(showInSelectMenuColumns[index]) {
                                            return <div className={index === 0 ? "sheet__header__cell sheet__header__cell--first" : "sheet__header__cell"}
                                                        style={{
                                                            minWidth: `300px`
                                                        }}
                                                        key={index}>

                                                {item}
                                            </div>
                                        }
                                        else {
                                            return '';
                                        }
                                    })}

                                    <div className="sheet__header__cell">
                                        Dopasowanie
                                    </div>
                                </div>
                                {selectList.slice(0, 10).map((item, index) => {
                                    const similarity = item.similarity.toFixed();

                                    return <div className="line line--tableRow" key={index}>
                                        {Object.entries(dataSheet[item.dataRowIndex]).map((item, index) => {
                                            const cellValue = item[1];
                                            let substringIndexes = [];

                                            if(columnsNamesInConditions.includes(item[0])) {
                                                substringIndexes = findSubstrings(joinStringOfColumnsFromRelationSheet, cellValue);
                                            }

                                            if(showInSelectMenuColumns[index]) {
                                                return <div className={index === 0 ? "sheet__body__row__cell sheet__body__row__cell--first" : "sheet__body__row__cell"}
                                                            style={{
                                                                minWidth: `300px`
                                                            }}
                                                            key={index}>
                                                    <ColorMarkedText string={cellValue}
                                                                     indexes={substringIndexes} />
                                                </div>
                                            }
                                            else {
                                                return '';
                                            }
                                        })}

                                        <div className="sheet__body__row__cell sheet__body__row__cell--center" style={{
                                            background: getSimilarityColor(similarity)
                                        }}>
                                            {similarity}%
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </>}
                </div> : ''}
            </div>
        </div>
    </div>
}

export default TestConfigurationModal;
