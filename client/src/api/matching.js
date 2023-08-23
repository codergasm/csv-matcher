import axios from "axios";
import {settings} from "../helpers/settings";
import {getAuthHeader} from "../helpers/others";
import getConfigWithAuthHeader from "../helpers/getConfigWithAuthHeader";

const getProgressByJobId = (jobId) => {
    return axios.get(`/getProgress/${jobId}`, getConfigWithAuthHeader());
}

const getSelectList = (correlationId, jobId, priorities, dataFile, relationFile,
                       isCorrelationMatrixEmpty, showInSelectMenuColumnsDataSheet,
                       dataSheetLength, relationSheetLength, api, relationTestRow = -1) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getAuthHeader()
        }
    }

    formData.append('correlationId', correlationId);
    formData.append('jobId', jobId);
    formData.append('priorities', JSON.stringify(priorities));
    formData.append('isCorrelationMatrixEmpty', isCorrelationMatrixEmpty ? 'true' : 'false');
    formData.append('showInSelectMenuColumnsDataSheet', JSON.stringify(showInSelectMenuColumnsDataSheet));
    formData.append('dataSheetLength', dataSheetLength);
    formData.append('relationSheetLength', relationSheetLength);
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

    return axios.post(`/getSelectList${api}`, formData, config);
}

const matching = (correlationId, jobId, priorities,
                  dataFile, relationFile,
                  overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
                  manuallyCorrelatedRows, userId,
                  matchType, api, relationTestRow = -1) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getAuthHeader()
        }
    }

    formData.append('correlationId', correlationId);
    formData.append('jobId', jobId);
    formData.append('priorities', JSON.stringify(priorities));
    formData.append('overrideAllRows', overrideAllRows);
    formData.append('avoidOverrideForManuallyCorrelatedRows', avoidOverrideForManuallyCorrelatedRows);
    formData.append('manuallyCorrelatedRows', JSON.stringify(manuallyCorrelatedRows));
    formData.append('userId', userId);
    formData.append('matchType', matchType);
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

    return axios.post(`/correlate${api ? api : ''}`, formData, config);
}

const correlateUsingSchema = (dataSheetId, relationSheetId, matchSchemaId) => {
    return axios.get(`/schemas/correlateUsingSchema/${dataSheetId}/${relationSheetId}/${matchSchemaId}`, getConfigWithAuthHeader());
}

const getCorrelationArraysForDataSheet = (id, indexesToRender) => {
    return axios.get(`/getCorrelationArraysForDataSheet/${id}/${indexesToRender?.length ? indexesToRender.join(',') : Array.from(Array(20).keys()).join(',')}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getCorrelationArraysForRelationSheet = (id, indexesToRender) => {
    return axios.get(`/getCorrelationArraysForRelationSheet/${id}/${indexesToRender?.length ? indexesToRender.join(',') : Array.from(Array(20).keys()).join(',')}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

export { getSelectList, matching, getProgressByJobId,
    correlateUsingSchema, getCorrelationArraysForDataSheet,
    getCorrelationArraysForRelationSheet }
