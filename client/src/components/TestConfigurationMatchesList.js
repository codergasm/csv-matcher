import React, {useContext} from 'react';
import {findSubstrings} from "../helpers/others";
import ColorMarkedText from "./ColorMarkedText";
import getSimilarityColor from "../helpers/getSimilarityColor";
import {ViewContext} from "./CorrelationView";
import {AppContext} from "../pages/CorrelationPage";

const TestConfigurationMatchesList = ({from, to, testSelectList, joinStringOfColumnsFromRelationSheet, columnsNamesInConditions}) => {
    const { dataSheet } = useContext(AppContext);
    const { showInSelectMenuColumnsDataSheet } = useContext(ViewContext);

    return testSelectList.slice(from, to).map((item, index) => {
        const similarity = item.similarity?.toFixed();

        return <div className="line line--tableRow" key={index}>
            {Object.entries(dataSheet[item.dataRowIndex]).map((item, index) => {
                const cellValue = item[1];
                let substringIndexes = [];

                if(columnsNamesInConditions.includes(item[0])) {
                    substringIndexes = findSubstrings(joinStringOfColumnsFromRelationSheet, cellValue);
                }

                if(showInSelectMenuColumnsDataSheet[index]) {
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
    })
};

export default TestConfigurationMatchesList;
