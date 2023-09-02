import React, {useContext, useEffect, useState} from 'react';
import PlansTableItemHeading from "./PlansTableItemHeading";
import PlansTableCell from "./PlansTableCell";
import AlertNotTeamOwnerModal from "./AlertNotTeamOwnerModal";
import AlertNotTeamMemberModal from "./AlertNotTeamMemberModal";
import {SubscriptionContext} from "./LoggedUserWrapper";

const PlansTableItem = ({item, index, color}) => {
    const { isUserTeamOwner, planId, teamId, planDeadline } = useContext(SubscriptionContext);

    const [isCurrentPlan, setIsCurrentPlan] = useState(false);
    const [alertNotTeamOwnerVisible, setAlertNotTeamOwnerVisible] = useState(false);
    const [alertNotTeamMemberVisible, setAlertNotTeamMemberVisible] = useState(false);

    useEffect(() => {
        if(planId === item?.id && planDeadline > new Date()) {
            setIsCurrentPlan(true);
        }
    }, [planId, planDeadline, item]);

    const choosePlan = () => {
        if(isUserTeamOwner) {
            window.location = `/subskrypcja?id=${planId}`;
        }
        else if(teamId) {
            setAlertNotTeamOwnerVisible(true);
        }
        else {
            setAlertNotTeamMemberVisible(true);
        }
    }

    return <div className={isCurrentPlan ? "plansTable__plans__item plansTable__plans__item--current" : "plansTable__plans__item"}>
        {alertNotTeamMemberVisible ? <AlertNotTeamMemberModal closeModal={() => { setAlertNotTeamMemberVisible(false); }} /> : ''}
        {alertNotTeamOwnerVisible ? <AlertNotTeamOwnerModal closeModal={() => { setAlertNotTeamOwnerVisible(false); }} /> : ''}

        {isCurrentPlan ? <p className="plansTable__plans__item__currentPlanInfo center shadow">
            Twój plan
        </p> : ''}

        <PlansTableItemHeading name={item.name}
                               color={color}
                               price={item.price_pln}
                               currency={'zł/msc'} />

        <div className="plansTable__plans__item__content">
            <PlansTableCell>
                {item.users_per_team}
            </PlansTableCell>
            <PlansTableCell>
                {item.files_per_team}
            </PlansTableCell>
            <PlansTableCell>
                {item.rows_per_file}
            </PlansTableCell>
            <PlansTableCell>
                {item.columns_per_file}
            </PlansTableCell>
            <PlansTableCell>
                {item.size_per_file}
            </PlansTableCell>
            <PlansTableCell>
                {item.size_per_team}
            </PlansTableCell>
            <PlansTableCell>
                {item.schemas_per_team}
            </PlansTableCell>
            <PlansTableCell large={true}>
                {item.matches_per_month}
            </PlansTableCell>
        </div>

        <div className="buyPlanWrapper center">
            {index !== 0 ? <button onClick={choosePlan}
                                   className="btn btn--buyPlan center">
                Wybierz
            </button> : ''}
        </div>
    </div>
};

export default PlansTableItem;
