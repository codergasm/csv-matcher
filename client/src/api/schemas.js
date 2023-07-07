import axios from 'axios';
import {getLoggedUserEmail} from "./users";
import getConfigWithAuthHeader from "../helpers/getConfigWithAuthHeader";

const getSchemaById = (id) => {
    return axios.get(`/schemas/getSchemaById/${id}`, getConfigWithAuthHeader());
}

const getSchemasByUser = () => {
    return axios.get(`/schemas/getSchemasByUser/${getLoggedUserEmail()}`, getConfigWithAuthHeader());
}

const saveSchema = (name, matchedStringsArray, automaticMatcherSettingsObject, columnsSettingsObject,
                    matchType, matchFunction,
                    email, teamOwner, dataSheetId, relationSheetId) => {
    return axios.post(`/schemas/saveSchema`, {
        name, matchedStringsArray, automaticMatcherSettingsObject, columnsSettingsObject,
        matchType, matchFunction,
        email, teamOwner, dataSheetId, relationSheetId
    }, getConfigWithAuthHeader());
}

const updateSchema = (id, name, matchedStringsArray, automaticMatcherSettingsObject, columnsSettingsObject,
                      matchType, matchFunction,
                      dataSheetId, relationSheetId) => {
    return axios.patch(`/schemas/updateSchema`, {
        id, name, matchedStringsArray, automaticMatcherSettingsObject, columnsSettingsObject,
        matchType, matchFunction,
        dataSheetId, relationSheetId
    }, getConfigWithAuthHeader());
}

const updateSchemaName = (id, name) => {
    return axios.patch(`/schemas/updateSchemaName`, {
        id, name
    }, getConfigWithAuthHeader());
}

const assignSchemaToTeam = (id) => {
    return axios.patch(`/schemas/assignSchemaToTeam`, {
        id,
        email: getLoggedUserEmail()
    }, getConfigWithAuthHeader());
}

const deleteSchema = (id) => {
    return axios.delete(`/schemas/deleteSchema/${id}`, getConfigWithAuthHeader());
}

const assignSheetsToSchema = (dataSheet, relationSheet, matchSchema) => {
    return axios.post(`/schemas/assignSheetsToSchema`, {
        dataSheet, relationSheet, matchSchema
    }, getConfigWithAuthHeader());
}

const detachSheetsFromSchema = (dataSheet, relationSheet, matchSchema) => {
    return axios.delete(`/schemas/detachSheetsFromSchema/${dataSheet}/${relationSheet}/${matchSchema}`, getConfigWithAuthHeader());
}

const detachSheetsFromSchemaById = (id) => {
    return axios.delete(`/schemas/detachSheetsFromSchema/${id}`, getConfigWithAuthHeader());
}

const getNumberOfMatchedRows = (id) => {
    return axios.get(`/schemas/getNumberOfMatchedRows/${id}`, getConfigWithAuthHeader());
}

export { getSchemasByUser, saveSchema, updateSchema, updateSchemaName, assignSchemaToTeam, deleteSchema, getSchemaById,
    assignSheetsToSchema, detachSheetsFromSchema, getNumberOfMatchedRows, detachSheetsFromSchemaById }
