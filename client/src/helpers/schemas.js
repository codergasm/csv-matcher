import axios from 'axios';
import {getLoggedUserEmail} from "./users";
import {getAuthHeader} from "./others";

const getSchemaById = (id) => {
    return axios.get(`/schemas/getSchemaById/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getSchemasByUser = () => {
    return axios.get(`/schemas/getSchemasByUser/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const saveSchema = (name, matchedStringsArray, automaticMatcherSettingsObject, email,
                    teamOwner, dataSheetId, relationSheetId) => {
    return axios.post(`/schemas/saveSchema`, {
        name, matchedStringsArray, automaticMatcherSettingsObject, email, teamOwner,
        dataSheetId, relationSheetId
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const updateSchema = (id, name, matchedStringsArray, automaticMatcherSettingsObject, dataSheetId, relationSheetId) => {
    return axios.patch(`/schemas/updateSchema`, {
        id, name, matchedStringsArray, automaticMatcherSettingsObject, dataSheetId, relationSheetId
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const updateSchemaName = (id, name) => {
    return axios.patch(`/schemas/updateSchemaName`, {
        id, name
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const assignSchemaToTeam = (id) => {
    return axios.patch(`/schemas/assignSchemaToTeam`, {
        id,
        email: getLoggedUserEmail()
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const deleteSchema = (id) => {
    return axios.delete(`/schemas/deleteSchema/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const assignSheetsToSchema = (dataSheet, relationSheet, matchSchema) => {
    return axios.post(`/schemas/assignSheetsToSchema`, {
        dataSheet, relationSheet, matchSchema
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const detachSheetsFromSchema = (dataSheet, relationSheet, matchSchema) => {
    return axios.delete(`/schemas/detachSheetsFromSchema/${dataSheet}/${relationSheet}/${matchSchema}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const detachSheetsFromSchemaById = (id) => {
    return axios.delete(`/schemas/detachSheetsFromSchema/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getNumberOfMatchedRows = (id) => {
    return axios.get(`/schemas/getNumberOfMatchedRows/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

export { getSchemasByUser, saveSchema, updateSchema, updateSchemaName, assignSchemaToTeam, deleteSchema, getSchemaById,
    assignSheetsToSchema, detachSheetsFromSchema, getNumberOfMatchedRows, detachSheetsFromSchemaById }
