import axios from "axios";
import {getLoggedUserEmail} from "./users";
import {getAuthHeader} from "./others";

const getTeamById = (id) => {
    return axios.get(`/teams/getTeamById/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getAllTeams = () => {
    return axios.get(`/teams/getAllTeams`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const generateTeamUrl = (name) => {
    const nonEnglishChars = /[^a-zA-Z]/g;
    const whitespace = /\s/g;
    const englishName = name.replace(nonEnglishChars, '').replace(whitespace, '').toLowerCase();
    return `${englishName}.rowmatcher.com`;
}

const createTeam = (name) => {
    return axios.post(`/teams/createTeam`, {
        name,
        teamUrl: generateTeamUrl(name),
        email: getLoggedUserEmail()
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const updateTeamName = (id, name, team_url) => {
    return axios.patch(`/teams/updateTeamName`, {
        id, name, team_url
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getWaitingJoinTeamRequests = (id) => {
    return axios.get(`/teams/getWaitingJoinTeamRequests/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getTeamMembers = (id) => {
    return axios.get(`/teams/getTeamMembers/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

export { getTeamById, getAllTeams, generateTeamUrl, createTeam, updateTeamName,
    getWaitingJoinTeamRequests, getTeamMembers }
