import axios from "axios";

const getSelectList = (dataSheet, correlationMatrix, showInSelectMenuColumns) => {
    return axios.post(`/getSelectList`, {
        dataSheet, correlationMatrix, showInSelectMenuColumns
    });
}

const matching = (priorities, correlationMatrix,
                  dataSheet, relationSheet, indexesOfCorrelatedRows,
                  overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
                  manuallyCorrelatedRows, matchThreshold) => {
    return axios.post('/correlate', {
        priorities, correlationMatrix,
        dataSheet, relationSheet, indexesOfCorrelatedRows,
        overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
        manuallyCorrelatedRows, matchThreshold
    });
}

export { getSelectList, matching }
