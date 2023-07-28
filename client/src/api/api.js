import axios from "axios";

const apiAuthorization = (id, token) => {
    return axios.post(`/api/auth`, {
        id, token
    });
}

const getFilesByApiRequest = (id, token) => {
    return axios.get(`/api/getFilesByApiRequest/${id}/${token}`);
}


const getSchemasByUserApiToken = (token) => {
    return axios.get(`/api/getSchemasByUserApiToken/${token}`);
}

const getFilesByUserApiToken = (token) => {
    return axios.get(`/api/getFilesByUserApiToken/${token}`);
}

const getApiRequestById = (id, token) => {
    return axios.get(`/api/getApiRequestById/${id}/${token}`);
}

export { apiAuthorization, getFilesByApiRequest, getApiRequestById,
    getSchemasByUserApiToken, getFilesByUserApiToken }
