import axios from "axios";

const getAllSubscriptionPlans = () => {
    return axios.get('/subscriptions/getAll');
}

const getPlanById = (id) => {
    return axios.get(`/subscriptions/getPlanById/${id}`);
}

export { getAllSubscriptionPlans, getPlanById }
