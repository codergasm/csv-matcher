import axios from "axios";
import {getLoggedUserEmail} from "./users";
import {getAuthHeader} from "./others";

const getTeamById = (id) => {
    return axios.get(`/teams/getTeamById/${id}`);
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

export { getTeamById, getAllTeams, generateTeamUrl, createTeam }
