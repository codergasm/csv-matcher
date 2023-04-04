import axios from "axios";

const getProgressByJobId = (jobId) => {
    return axios.get(`/getProgress/${jobId}`);
}

const getSelectList = (jobId, priorities, dataFile, relationFile, dataDelimiter, relationDelimiter,
                       isCorrelationMatrixEmpty, showInSelectMenuColumns, dataSheetLength, relationSheetLength) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    formData.append('jobId', jobId);
    formData.append('priorities', JSON.stringify(priorities));
    formData.append('files', dataFile);
    formData.append('files', relationFile);
    formData.append('dataDelimiter', dataDelimiter);
    formData.append('relationDelimiter', relationDelimiter);
    formData.append('isCorrelationMatrixEmpty', isCorrelationMatrixEmpty);
    formData.append('showInSelectMenuColumns', JSON.stringify(showInSelectMenuColumns));
    formData.append('dataSheetLength', dataSheetLength);
    formData.append('relationSheetLength', relationSheetLength);

    return axios.post('/getSelectList', formData, config);
}

const matching = (jobId, priorities, correlationMatrix,
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

    formData.append('jobId', jobId);
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

export { getSelectList, matching, getProgressByJobId }
