import axios from 'axios';
import {getLoggedUserEmail} from "./users";
import {getAuthHeader} from "./others";

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
    return axios.delete(`/files/deleteSheet/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getFilesByUser = () => {
    return axios.get(`/files/getFilesByUser/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const assignFileOwnershipToTeam = (fileId, teamId) => {
    return axios.patch(`/files/assignFileOwnershipToTeam`, {
        fileId, teamId
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

export { saveSheet, deleteSheet, getFilesByUser, assignFileOwnershipToTeam }
