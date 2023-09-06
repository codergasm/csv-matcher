import React, {useContext, useEffect, useState} from 'react';
import PayPlanWindow from "../components/PayPlanWindow";
import getUrlParam from "../helpers/getUrlParam";
import {getAllSubscriptionPlans} from "../api/subscriptions";
import PlanConversionWindow from "../components/PlanConversionWindow";
import {SubscriptionContext} from "../components/LoggedUserWrapper";

const SubscriptionPage = ({user}) => {
    const { planDeadline, planId } = useContext(SubscriptionContext);

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
                const planIdInt = parseInt(planIdParam);
                setIsConversion(planIdInt !== planId && planDeadline > new Date());

                setPlanToPay(plans.find((item) => {
                    return item.id === planIdInt;
                }));
            }
        }
    }, [plans]);

    return  <div className="container">
        <div className="homepage">
            <div className="homepage__subscription center w">
                {isConversion ? <PlanConversionWindow plan={planToPay}
                                                      user={user} /> : <PayPlanWindow plan={planToPay}
                                                                                      user={user} />}
            </div>
        </div>
    </div>
};

export default SubscriptionPage;
