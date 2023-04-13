import axios from "axios";
import Cookies from "universal-cookie";
import {getAuthHeader} from "./others";

const getLoggedUserEmail = () => {
    const cookies = new Cookies();
    return `${cookies.get('email_rowmatcher')}@${cookies.get('email_rowmatcher_domain')}`;
}

const authUser = () => {
    const cookies = new Cookies();

    return axios.post('/users/auth', {
        email: getLoggedUserEmail()
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const registerUser = (email, password) => {
    return axios.post(`/users/register`, {
        email, password
    });
}

const loginUser = (email, password) => {
    return axios.post('/users/login', {
        email, password
    });
}

const verifyUser = (token) => {
    return axios.post(`/users/verify`, {
        token
    });
}

const getUserData = (email = false) => {
    return axios.get(`/users/getUserData/${email ? email : getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const logout = () => {
    const cookies = new Cookies();
    cookies.remove('access_token', { path: '/' });
    cookies.remove('jwt', { path: '/' });
    cookies.remove('email_rowmatcher_domain', { path: '/' });
    cookies.remove('email_rowmatcher', { path: '/' });
    window.location = '/';
}

const changeUserPassword = (oldPassword, newPassword) => {
    return axios.patch('/users/changePassword', {
        oldPassword, newPassword,
        email: getLoggedUserEmail()
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getUserTeam = () => {
    return axios.get(`/users/getTeam/${getLoggedUserEmail()}`);
}

const sendRequestToJoinTeam = (teamId) => {
    return axios.post(`/users/joinTeam`, {
        teamId,
        email: getLoggedUserEmail()
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getUserWaitingJoinTeamRequest = () => {
    return axios.get(`/users/getWaitingJoinTeamRequest/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const deleteJoinTeamRequest = () => {
    return axios.delete(`/users/deleteJoinTeamRequest/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

export { registerUser, loginUser, verifyUser, authUser, getLoggedUserEmail, getUserWaitingJoinTeamRequest,
    getUserData, logout, changeUserPassword, getUserTeam, sendRequestToJoinTeam,
    deleteJoinTeamRequest
}
