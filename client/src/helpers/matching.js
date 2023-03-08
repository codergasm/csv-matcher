import axios from "axios";

const convertCsvToArray = (file, separator) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    formData.append('file', file);
    formData.append('separator', separator);

    return axios.post('/convertToArray', formData, config);
}

const getSelectList = (priorities, dataFile, relationFile, dataDelimiter, relationDelimiter,
                       isCorrelationMatrixEmpty, showInSelectMenuColumns) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    formData.append('priorities', JSON.stringify(priorities));
    formData.append('files', dataFile);
    formData.append('files', relationFile);
    formData.append('dataDelimiter', dataDelimiter);
    formData.append('relationDelimiter', relationDelimiter);
    formData.append('isCorrelationMatrixEmpty', isCorrelationMatrixEmpty);
    formData.append('showInSelectMenuColumns', JSON.stringify(showInSelectMenuColumns));

    return axios.post('/getSelectList', formData, config);
}

const matching = (priorities, correlationMatrix,
                  dataFile, relationFile, dataDelimiter, relationDelimiter,
                  indexesOfCorrelatedRows, overrideAllRows,
                  avoidOverrideForManuallyCorrelatedRows,
                  manuallyCorrelatedRows, matchThreshold) => {

    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    formData.append('files', dataFile);
    formData.append('files', relationFile);
    formData.append('dataFileDelimiter', dataDelimiter);
    formData.append('relationFileDelimiter', relationDelimiter);
    formData.append('correlationMatrix', correlationMatrix);
    formData.append('priorities', JSON.stringify(priorities));
    formData.append('indexesOfCorrelatedRows', JSON.stringify(indexesOfCorrelatedRows));
    formData.append('overrideAllRows', overrideAllRows);
    formData.append('avoidOverrideForManuallyCorrelatedRows', avoidOverrideForManuallyCorrelatedRows);
    formData.append('manuallyCorrelatedRows', manuallyCorrelatedRows);
    formData.append('matchThreshold', matchThreshold);

    return axios.post('/correlate', formData, config);
}

export { getSelectList, matching, convertCsvToArray }
