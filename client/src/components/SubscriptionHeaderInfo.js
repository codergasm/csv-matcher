import React, {useContext} from 'react';
import {UserContext} from "./LoggedUserWrapper";
import {addTrailingZero} from "../helpers/others";

const SubscriptionHeaderInfo = () => {
    const { plan, deadline } = useContext(UserContext);

    const printDeadline = () => {
        if(deadline && deadline > new Date()) {
            return `${addTrailingZero(deadline.getDate())}.${addTrailingZero(deadline.getMonth()+1)}.${deadline.getFullYear()}`;
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

    return plan ? <a href="/plany" className="dropdownMenu__plan">
        <p className="dropdownMenu__plan__name">
            <span>Plan:</span>
            <span>{plan.name}</span>
        </p>
        <p className="dropdownMenu__plan__deadline">
            <span>do:</span>
            <span>{printDeadline()}</span>
        </p>
    </a> : '';
};

export default SubscriptionHeaderInfo;
