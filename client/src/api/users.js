import axios from "axios";
import Cookies from "universal-cookie";
import redirectToHomepage from "../helpers/redirectToHomepage";
import getConfigWithAuthHeader from "../helpers/getConfigWithAuthHeader";

const getLoggedUserEmail = () => {
    const cookies = new Cookies();
    return `${cookies.get('email_rowmatcher')}@${cookies.get('email_rowmatcher_domain')}`;
}

const authUser = () => {
    return axios.post('/users/auth', {
        email: getLoggedUserEmail()
    }, getConfigWithAuthHeader());
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
    return axios.get(`/users/getUserData/${email ? email : getLoggedUserEmail()}`,
        getConfigWithAuthHeader());
}

const logout = () => {
    const cookies = new Cookies();
    cookies.remove('access_token', { path: '/' });
    cookies.remove('jwt', { path: '/' });
    cookies.remove('email_rowmatcher_domain', { path: '/' });
    cookies.remove('email_rowmatcher', { path: '/' });

    redirectToHomepage();
}

const changeUserPassword = (oldPassword, newPassword) => {
    return axios.patch('/users/changePassword', {
        oldPassword, newPassword,
        email: getLoggedUserEmail()
    }, getConfigWithAuthHeader());
}

const getUserTeam = () => {
    return axios.get(`/users/getTeam/${getLoggedUserEmail()}`);
}

const sendRequestToJoinTeam = (teamId) => {
    return axios.post(`/users/joinTeam`, {
        teamId,
        email: getLoggedUserEmail()
    }, getConfigWithAuthHeader());
}

const getUserWaitingJoinTeamRequest = () => {
    return axios.get(`/users/getWaitingJoinTeamRequest/${getLoggedUserEmail()}`,
        getConfigWithAuthHeader());
}

const deleteJoinTeamRequest = () => {
    return axios.delete(`/users/deleteJoinTeamRequest/${getLoggedUserEmail()}`,
        getConfigWithAuthHeader());
}

const leaveTeam = (email = null) => {
    return axios.patch(`/users/leaveTeam`, {
        email: email ? email : getLoggedUserEmail()
    }, getConfigWithAuthHeader());
}

const updateUserRights = (email,
                          can_edit_team_files,
                          can_delete_team_files,
                          can_edit_team_match_schemas,
                          can_delete_team_match_schemas) => {
    return axios.patch(`/users/updateUserRights`, {
        email,
        can_edit_team_match_schemas,
        can_delete_team_match_schemas,
        can_edit_team_files,
        can_delete_team_files
    }, getConfigWithAuthHeader());
}

const acceptJoinRequest = (userId, teamId) => {
    return axios.post(`/users/acceptJoinRequest`, {
        userId, teamId
    }, getConfigWithAuthHeader());
}

const rejectJoinRequest = (userId, teamId) => {
    return axios.post(`/users/rejectJoinRequest`, {
        userId, teamId
    }, getConfigWithAuthHeader());
}

const getUserTeamPlan = () => {
    const email = getLoggedUserEmail();
    return axios.get(`/users/getUserTeamPlan/${email}`, getConfigWithAuthHeader());
}

const checkIfUserCanLeaveTeam = (email = null) => {
    const userEmail = email ? email : getLoggedUserEmail();
    return axios.get(`/users/checkIfUserCanLeaveTeam/${userEmail}`, getConfigWithAuthHeader());
}

export { registerUser, loginUser, verifyUser, authUser, getLoggedUserEmail, getUserWaitingJoinTeamRequest,
    getUserData, logout, changeUserPassword, getUserTeam, sendRequestToJoinTeam, checkIfUserCanLeaveTeam,
    deleteJoinTeamRequest, updateUserRights, leaveTeam, acceptJoinRequest, rejectJoinRequest, getUserTeamPlan
}
