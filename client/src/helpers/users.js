import axios from "axios";
import Cookies from "universal-cookie";

const getAuthHeader = () => {
    const cookies = new Cookies();
    const jwt = cookies.get('access_token');
    return `Bearer ${jwt}`;
}

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

export { registerUser, loginUser, verifyUser, authUser, getUserData, logout, changeUserPassword, getUserTeam }
