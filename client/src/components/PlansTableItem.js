import React, {useContext, useEffect, useState} from 'react';
import PlansTableItemHeading from "./PlansTableItemHeading";
import PlansTableCell from "./PlansTableCell";
import {UserContext} from "./LoggedUserWrapper";
import AlertNotTeamOwnerModal from "./AlertNotTeamOwnerModal";
import AlertNotTeamMemberModal from "./AlertNotTeamMemberModal";

const PlansTableItem = ({item, index, color}) => {
    const { user, plan } = useContext(UserContext);

    const [isCurrentPlan, setIsCurrentPlan] = useState(false);
    const [alertNotTeamOwnerVisible, setAlertNotTeamOwnerVisible] = useState(false);
    const [alertNotTeamMemberVisible, setAlertNotTeamMemberVisible] = useState(false);

    useEffect(() => {
        if(plan?.id === item?.id) {
            setIsCurrentPlan(true);
        }
    }, [plan, item]);

    const choosePlan = () => {
        if(user?.isTeamOwner) {
            window.location = `/subskrypcja?id=${plan.id}`;
        }
        else if(user?.teamId) {
            setAlertNotTeamOwnerVisible(true);
        }
        else {
            setAlertNotTeamMemberVisible(true);
        }
    }

    return <div className={isCurrentPlan ? "plansTable__plans__item plansTable__plans__item--current" : "plansTable__plans__item"}
                key={index}>
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
