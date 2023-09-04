import axios from "axios";

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

export { getAllSubscriptionPlans, getPlanById, getTeamLimitsUsage,
    getNumberOfAutoMatchOperationsInCurrentMonth }
