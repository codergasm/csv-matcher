import axios from 'axios';
import {getLoggedUserEmail} from "./users";
import {getAuthHeader} from "./others";

const getSchemasByUser = () => {
    return axios.get(`/schemas/getSchemasByUser/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const saveSchema = (name, matchedStringsArray, automaticMatcherSettingsObject, email, teamOwner) => {
    return axios.post(`/schemas/saveSchema`, {
        name, matchedStringsArray, automaticMatcherSettingsObject, email, teamOwner
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const updateSchema = (id, name, matchedStringsArray, automaticMatcherSettingsObject) => {
    return axios.patch(`/schemas/updateSchema`, {
        id, name, matchedStringsArray, automaticMatcherSettingsObject
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const assignSchemaToTeam = (id, email) => {
    return axios.patch(`/schemas/assignSchemaToTeam`, {
        id, email
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

export { getSchemasByUser, saveSchema, updateSchema, assignSchemaToTeam, deleteSchema,
    assignSheetsToSchema, detachSheetsFromSchema, getNumberOfMatchedRows, detachSheetsFromSchemaById }
