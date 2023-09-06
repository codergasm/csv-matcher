import React, {useContext, useEffect, useState} from 'react';
import PlansTableItemHeading from "./PlansTableItemHeading";
import PlansTableCell from "./PlansTableCell";
import AlertNotTeamOwnerModal from "./AlertNotTeamOwnerModal";
import AlertNotTeamMemberModal from "./AlertNotTeamMemberModal";
import {SubscriptionContext} from "./LoggedUserWrapper";
import {TranslationContext} from "../App";
import {getTeamLimitsUsage} from "../api/subscriptions";

const PlansTableItem = ({item, index, color}) => {
    const { content } = useContext(TranslationContext);
    const { isUserTeamOwner, planId, teamId, planDeadline, currentPlan } = useContext(SubscriptionContext);

    const [isCurrentPlan, setIsCurrentPlan] = useState(false);
    const [alertNotTeamOwnerVisible, setAlertNotTeamOwnerVisible] = useState(false);
    const [alertNotTeamMemberVisible, setAlertNotTeamMemberVisible] = useState(false);
    const [numberOfMatchOperations, setNumberOfMatchOperations] = useState(-1);
    const [numberOfUsers, setNumberOfUsers] = useState(-1);
    const [numberOfFiles, setNumberOfFiles] = useState(-1);
    const [numberOfMatchSchemas, setNumberOfMatchSchemas] = useState(-1);
    const [diskUsage, setDiskUsage] = useState(-1);

    useEffect(() => {
        if(isCurrentPlan) {
            getTeamLimitsUsage(teamId)
                .then((res) => {
                   if(res?.data) {
                        const data = res.data;

                        setNumberOfMatchOperations(data.numberOfMatchOperations);
                        setNumberOfUsers(data.numberOfUsers);
                        setNumberOfFiles(data.numberOfFiles);
                        setNumberOfMatchSchemas(data.numberOfMatchSchemas);
                        setDiskUsage(data.diskUsage);
                   }
                });
        }
    }, [isCurrentPlan]);

    useEffect(() => {
        if(planId === item?.id && planDeadline > new Date()) {
            setIsCurrentPlan(true);
        }
    }, [planId, planDeadline, item]);

    const choosePlan = () => {
        if(isUserTeamOwner) {
            window.location = `/subskrypcja?id=${item.id}`;
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
            {content.yourPlan}
        </p> : ''}

        <PlansTableItemHeading name={item.name}
                               color={color}
                               price={item.price_pln}
                               currency={'zł/msc'} />

        <div className="plansTable__plans__item__content">
            <PlansTableCell currentUsage={numberOfUsers}
                            maxUsage={currentPlan.users_per_team}>
                {item.users_per_team}
            </PlansTableCell>
            <PlansTableCell currentUsage={numberOfFiles}
                            maxUsage={currentPlan.files_per_team}>
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
            <PlansTableCell currentUsage={!isNaN(diskUsage) ? diskUsage / 1000 : null}
                            maxUsage={currentPlan.size_per_team / 1000}>
                {item.size_per_team}
            </PlansTableCell>
            <PlansTableCell currentUsage={numberOfMatchSchemas}
                            maxUsage={currentPlan.schemas_per_team}>
                {item.schemas_per_team}
            </PlansTableCell>
            <PlansTableCell currentUsage={numberOfMatchOperations}
                            maxUsage={currentPlan.matches_per_month}
                            large={true}>
                {item.matches_per_month}
            </PlansTableCell>
        </div>

        {isUserTeamOwner ? <div className="buyPlanWrapper center">
            {index !== 0 ? <button onClick={choosePlan}
                                   className="btn btn--buyPlan center">
                {content.choose}
            </button> : ''}
        </div> : ''}
    </div>
};

export default PlansTableItem;
