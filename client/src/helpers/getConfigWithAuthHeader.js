import {getAuthHeader} from "./others";

const getConfigWithAuthHeader = () => {
    return {
        headers: {
            Authorization: getAuthHeader()
        }
    }
}

export default getConfigWithAuthHeader;
