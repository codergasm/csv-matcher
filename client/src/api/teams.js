import axios from "axios";
import {getLoggedUserEmail} from "./users";
import getConfigWithAuthHeader from "../helpers/getConfigWithAuthHeader";

const getTeamById = (id) => {
    return axios.get(`/teams/getTeamById/${id}`, getConfigWithAuthHeader());
}

const getAllTeams = () => {
    return axios.get(`/teams/getAllTeams`, getConfigWithAuthHeader());
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
    }, getConfigWithAuthHeader());
}

const updateTeamName = (id, name, teamUrl) => {
    return axios.patch(`/teams/updateTeamName`, {
        id, name, teamUrl
    }, getConfigWithAuthHeader());
}

const getWaitingJoinTeamRequests = (id) => {
    return axios.get(`/teams/getWaitingJoinTeamRequests/${id}`, getConfigWithAuthHeader());
}

const getTeamMembers = (id) => {
    return axios.get(`/teams/getTeamMembers/${id}`, getConfigWithAuthHeader());
}

export { getTeamById, getAllTeams, generateTeamUrl, createTeam, updateTeamName,
    getWaitingJoinTeamRequests, getTeamMembers }
