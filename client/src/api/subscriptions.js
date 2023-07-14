import axios from "axios";

const getAllSubscriptionPlans = () => {
    return axios.get('/subscriptions/getAll');
}

export { getAllSubscriptionPlans }
