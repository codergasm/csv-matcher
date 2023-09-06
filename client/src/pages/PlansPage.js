import React, {useContext, useEffect, useState} from 'react';
import PlansTable from "../components/PlansTable";
import {getAllSubscriptionPlans} from "../api/subscriptions";
import LoggedUserHeader from "../components/LoggedUserHeader";
import PageHeader from "../components/PageHeader";
import PlansPageInfo from "../components/PlansPageInfo";
import TransactionsPage from "./TransactionsPage";
import {TranslationContext} from "../App";

const PlansPage = ({user}) => {
    const { content } = useContext(TranslationContext);

    const [plans, setPlans] = useState([]);
    const [activePage, setActivePage] = useState(0);

    useEffect(() => {
        getAllSubscriptionPlans()
            .then((res) => {
                if(res?.data) {
                    setPlans(res.data);
                }
            });
    }, []);

    return <>
        {user ? <LoggedUserHeader user={user} /> : ''}

        <div className="container container--plans">
            <div className="homepage w">
                <PageHeader>
                    {content.subscription}
                </PageHeader>

                <div className="activePageButtons">
                    <button className={activePage === 0 ? "btn btn--activePage btn--activePage--current" : "btn btn--activePage"}
                            onClick={() => { setActivePage(0); }}>
                        {content.plans}
                    </button>
                    <button className={activePage === 1 ? "btn btn--activePage btn--activePage--current" : "btn btn--activePage"}
                            onClick={() => { setActivePage(1); }}>
                        {content.transactions}
                    </button>
                </div>

                {activePage === 0 ? <>
                    <PlansTable user={user}
                                plans={plans} />
                    <PlansPageInfo />
                </> : <TransactionsPage />}
            </div>
        </div>
    </>
};

export default PlansPage;
