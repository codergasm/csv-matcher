import axios from "axios";
import getConfigWithAuthHeader from "../helpers/getConfigWithAuthHeader";
import Cookies from "universal-cookie";
import redirectToHomepage from "../helpers/redirectToHomepage";

const getLoggedAdminLogin = () => {
    const cookies = new Cookies();
    return cookies.get('rowmatcher_admin');
}

const loginAdmin = (login, password) => {
    return axios.post(`/admin/login`, {
        login, password
    });
}

const authAdmin = () => {
    return axios.post('/admin/auth', {
        login: getLoggedAdminLogin()
    }, getConfigWithAuthHeader());
}

const getAllTransactions = () => {
    return axios.get(`/admin/getAllTransactions`);
}

const logoutAdmin = () => {
    const cookies = new Cookies();
    cookies.remove('access_token', { path: '/' });
    cookies.remove('jwt', { path: '/' });
    cookies.remove('rowmatcher_admin', { path: '/' });

    redirectToHomepage();
}

export { getAllTransactions, loginAdmin, authAdmin, logoutAdmin }
