import React from 'react';
import TeamTransactions from "../components/TeamTransactions";

const TransactionsPage = ({user}) => {
    return <div className="transactionsPage">
        <TeamTransactions user={user} />
    </div>
};

export default TransactionsPage;
