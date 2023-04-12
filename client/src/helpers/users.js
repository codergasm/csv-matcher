import axios from "axios";

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

export { registerUser, loginUser, verifyUser }
