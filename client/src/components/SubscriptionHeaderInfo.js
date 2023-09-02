import React, {useContext, useEffect, useState} from 'react';
import {SubscriptionContext} from "./LoggedUserWrapper";
import {addTrailingZero} from "../helpers/others";
import {TranslationContext} from "../App";
import { plansColors } from "../static/constans";
import {getNumberOfAutoMatchOperationsInCurrentMonth} from "../api/subscriptions";
import ProgressBar from "./ProgressBar";
import ProgressBarSubscription from "./ProgressBarSubscription";

const SubscriptionHeaderInfo = () => {
    const { content } = useContext(TranslationContext);
    const { teamId, planId, planDeadline, currentPlan } = useContext(SubscriptionContext);

    const [numberOfAutoMatchedRowsInCurrentMonth, setNumberOfAutoMatchedRowsInCurrentMonth] = useState(0);

    useEffect(() => {
        if(teamId) {
            getNumberOfAutoMatchOperationsInCurrentMonth(teamId)
                .then((res) => {
                   if(res?.data) {
                       setNumberOfAutoMatchedRowsInCurrentMonth(res?.data);
                   }
                });
        }
    }, [teamId]);

    const printDeadline = () => {
        if(planDeadline && planDeadline > new Date()) {
            return `${addTrailingZero(planDeadline.getDate())}.${addTrailingZero(planDeadline.getMonth()+1)}.${planDeadline.getFullYear()}`;
        }
        else {
            return printLastDayOfCurrentMonth();
        }
    }

    const printLastDayOfCurrentMonth = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

        return `${lastDay.toString().padStart(2, '0')}.${(currentMonth + 1).toString().padStart(2, '0')}.${currentYear}`;
    }

    return planId ? <a href="/plany" className="dropdownMenu__plan" style={{
        background: plansColors[planId-1]
    }}>
        <p className="dropdownMenu__plan__name">
            <span>Plan: </span>
            <span>{content.planNames[planId-1]}</span>
        </p>
        <p className="dropdownMenu__plan__deadline">
            <span className="d-block">Autodopasowań w tym miesiącu:</span>
            <span className="d-block">
                {numberOfAutoMatchedRowsInCurrentMonth}/{currentPlan?.matches_per_month}
                <ProgressBarSubscription progress={currentPlan?.matches_per_month ? numberOfAutoMatchedRowsInCurrentMonth/currentPlan.matches_per_month : 0} />
            </span>

            <span>do:</span>
            <span>{printDeadline()}</span>
        </p>
    </a> : '';
};

export default SubscriptionHeaderInfo;
