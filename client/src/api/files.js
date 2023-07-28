import axios from 'axios';
import {getLoggedUserEmail} from "./users";
import {getAuthHeader} from "../helpers/others";
import getConfigWithAuthHeader from "../helpers/getConfigWithAuthHeader";

const getFileById = (id) => {
    return axios.get(`/files/getFileById/${id}`, getConfigWithAuthHeader());
}

const saveSheet = (file, teamId, teamOwner) => {
    const formData = new FormData();
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
    }

    formData.append('email', getLoggedUserEmail());
    formData.append('sheet', file);
    formData.append('teamId', teamId);
    formData.append('teamOwner', teamOwner);

    return axios.post(`/files/saveSheet`, formData, config);
}

const deleteSheet = (id) => {
    return axios.delete(`/files/deleteSheet/${id}`, getConfigWithAuthHeader());
}

const getFilesByUser = () => {
    return axios.get(`/files/getFilesByUser/${getLoggedUserEmail()}`, getConfigWithAuthHeader());
}

const getFilesByUserId = (id) => {
    return axios.get(`/files/getFilesByUserId/${id}`);
}

const assignFileOwnershipToTeam = (fileId, teamId) => {
    return axios.patch(`/files/assignFileOwnershipToTeam`, {
        fileId, teamId
    }, getConfigWithAuthHeader());
}

const updateSheet = (file, teamId, id, name) => {
    if(file) {
        const formData = new FormData();
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            Authorization: getAuthHeader()
        }

        formData.append('email', getLoggedUserEmail());
        formData.append('sheet', file);
        formData.append('teamId', teamId);
        formData.append('name', name);
        formData.append('id', id);

        return axios.patch(`/files/updateFile`, formData, config);
    }
    else {
        return axios.patch(`/files/updateFileName`, {
            id, name
        }, getConfigWithAuthHeader());
    }
}

export { saveSheet, deleteSheet, getFilesByUser, getFileById,
    assignFileOwnershipToTeam, updateSheet, getFilesByUserId }
