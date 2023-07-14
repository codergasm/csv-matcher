import React, {useEffect, useState} from 'react';
import PayPlanWindow from "../components/PayPlanWindow";
import getUrlParam from "../helpers/getUrlParam";
import {getAllSubscriptionPlans, getPlanById} from "../api/subscriptions";

const SubscriptionPage = () => {
    const [isConversion, setIsConversion] = useState(false);
    const [plans, setPlans] = useState([]);
    const [planToPay, setPlanToPay] = useState({});

    useEffect(() => {
        getAllSubscriptionPlans()
            .then((res) => {
                if(res?.data) {
                    setPlans(res.data);
                }
            });
    }, []);

    useEffect(() => {
        if(plans?.length) {
            const planIdParam = getUrlParam('id');

            if(planIdParam) {
                const planId = parseInt(planIdParam);

                setPlanToPay(plans.find((item) => {
                    return item.id === planId;
                }));
            }
        }
    }, [plans]);

    return  <div className="container">
        <div className="homepage">
            <div className="homepage__subscription center w">
                {isConversion ? '' : <PayPlanWindow plan={planToPay} />}
            </div>
        </div>
    </div>
};

export default SubscriptionPage;
