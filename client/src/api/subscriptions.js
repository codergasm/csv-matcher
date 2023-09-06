import axios from "axios";
import {getLoggedUserEmail} from "./users";
import getConfigWithAuthHeader from "../helpers/getConfigWithAuthHeader";

const getAllSubscriptionPlans = () => {
    return axios.get('/subscriptions/getAll');
}

const getPlanById = (id) => {
    return axios.get(`/subscriptions/getPlanById/${id}`);
}

const getNumberOfAutoMatchOperationsInCurrentMonth = (teamId) => {
    return axios.get(`/subscriptions/getNumberOfAutoMatchOperationsInCurrentMonth/${teamId}`);
}

const getTeamLimitsUsage = (teamId) => {
    return axios.get(`/subscriptions/getTeamLimitsUsage/${teamId}`);
}

const convertSubscription = (teamId, newPlanId, newPlanDeadline) => {
    return axios.post(`/subscriptions/convertSubscription`, {
        teamId, newPlanId, newPlanDeadline
    }, getConfigWithAuthHeader());
}

const getTeamTransactions = (teamId) => {
    return axios.get(`/subscriptions/getTeamTransactions/${teamId}`, getConfigWithAuthHeader());
}

const registerPayment = (amount, currency, userId, teamId, planId, planDeadline) => {
    const email = getLoggedUserEmail();

    return axios.post(`/subscription/registerPayment`, {
        amount, userId, teamId, email,
        planId, planDeadline
    }, getConfigWithAuthHeader());
}

export { getAllSubscriptionPlans, getPlanById, getTeamLimitsUsage, getTeamTransactions,
    getNumberOfAutoMatchOperationsInCurrentMonth, registerPayment, convertSubscription }
