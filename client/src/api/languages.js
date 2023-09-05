import axios from "axios";
import getConfigWithAuthHeader from "../helpers/getConfigWithAuthHeader";

const getLanguages = () => {
    return axios.get(`/getLanguages`, getConfigWithAuthHeader());
}

export { getLanguages }
