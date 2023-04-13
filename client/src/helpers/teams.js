import axios from "axios";

const getTeamById = (id) => {
    return axios.get(`/teams/getTeamById/${id}`);
}

export { getTeamById }
