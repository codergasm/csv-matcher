import axios from "axios";
import {settings} from "../helpers/settings";
import {getAuthHeader} from "../helpers/others";
import getConfigWithAuthHeader from "../helpers/getConfigWithAuthHeader";

const getProgressByJobId = (jobId) => {
    return axios.get(`/getProgress/${jobId}`, getConfigWithAuthHeader());
}

const getSelectList = (jobId, priorities, dataFile, relationFile, dataDelimiter, relationDelimiter,
                       isCorrelationMatrixEmpty, showInSelectMenuColumnsDataSheet,
                       dataSheetLength, relationSheetLength, selectListIndicators, relationTestRow = -1) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getAuthHeader()
        }
    }

    formData.append('jobId', jobId);
    formData.append('priorities', JSON.stringify(priorities));
    formData.append('dataDelimiter', dataDelimiter);
    formData.append('relationDelimiter', relationDelimiter);
    formData.append('isCorrelationMatrixEmpty', isCorrelationMatrixEmpty ? 'true' : 'false');
    formData.append('showInSelectMenuColumnsDataSheet', JSON.stringify(showInSelectMenuColumnsDataSheet));
    formData.append('dataSheetLength', dataSheetLength);
    formData.append('relationSheetLength', relationSheetLength);
    formData.append('selectListIndicators', JSON.stringify(selectListIndicators));
    formData.append('relationTestRow', relationTestRow.toString());

    if(typeof dataFile === 'string') {
        formData.append('dataFilePath', dataFile.replace(settings.API_URL, ''));
    }
    else {
        formData.append('files', dataFile);
    }

    if(typeof relationFile === 'string') {
        formData.append('relationFilePath', relationFile.replace(settings.API_URL, ''));
    }
    else {
        formData.append('files', relationFile);
    }

    return axios.post('/getSelectList', formData, config);
}

const matching = (jobId, priorities, correlationMatrix,
                  dataFile, relationFile, dataDelimiter, relationDelimiter,
                  indexesOfCorrelatedRows, overrideAllRows,
                  avoidOverrideForManuallyCorrelatedRows,
                  manuallyCorrelatedRows, userId, relationTestRow = -1) => {

    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getAuthHeader()
        }
    }

    formData.append('jobId', jobId);
    formData.append('dataFileDelimiter', dataDelimiter);
    formData.append('relationFileDelimiter', relationDelimiter);
    formData.append('correlationMatrix', correlationMatrix);
    formData.append('priorities', JSON.stringify(priorities));
    formData.append('indexesOfCorrelatedRows', JSON.stringify(indexesOfCorrelatedRows));
    formData.append('overrideAllRows', overrideAllRows);
    formData.append('avoidOverrideForManuallyCorrelatedRows', avoidOverrideForManuallyCorrelatedRows);
    formData.append('manuallyCorrelatedRows', manuallyCorrelatedRows);
    formData.append('userId', userId);
    formData.append('relationTestRow', relationTestRow.toString());

    if(typeof dataFile === 'string') {
        formData.append('dataFilePath', dataFile.replace(settings.API_URL, '.'));
    }
    else {
        formData.append('files', dataFile);
    }

    if(typeof relationFile === 'string') {
        formData.append('relationFilePath', relationFile.replace(settings.API_URL, '.'));
    }
    else {
        formData.append('files', relationFile);
    }

    return axios.post('/correlate', formData, config);
}

const correlateUsingSchema = (dataSheetId, relationSheetId, matchSchemaId) => {
    return axios.get(`/schemas/correlateUsingSchema/${dataSheetId}/${relationSheetId}/${matchSchemaId}`, getConfigWithAuthHeader());
}

export { getSelectList, matching, getProgressByJobId, correlateUsingSchema }
