import axios from "axios";

const getAllTransactions = () => {
    return axios.get(`/admin/getAllTransactions`);
}

export { getAllTransactions }
