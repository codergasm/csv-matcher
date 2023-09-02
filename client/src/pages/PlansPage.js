import React, {useEffect, useState} from 'react';
import PlansTable from "../components/PlansTable";
import {getAllSubscriptionPlans} from "../api/subscriptions";
import LoggedUserHeader from "../components/LoggedUserHeader";
import PageHeader from "../components/PageHeader";
import PlansPageInfo from "../components/PlansPageInfo";

const PlansPage = ({user}) => {
    const [plans, setPlans] = useState([]);

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
                    Plany i płatności
                </PageHeader>

                <PlansTable user={user}
                            plans={plans} />
                <PlansPageInfo />
            </div>
        </div>
    </>
};

export default PlansPage;
