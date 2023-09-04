import React from 'react';
import ProgressBarSubscription from "./ProgressBarSubscription";
import {Tooltip} from "react-tippy";

const PlansTableCell = ({children, large, currentUsage, maxUsage}) => {
    return <div className={large ? "plansTable__cell plansTable__cell--large" : "plansTable__cell"}>
        <span className="plansTable__cell__content">
            {children}
        </span>

        {currentUsage >= 0 ? <Tooltip title={'Aktualne zużycie Twojego zespołu'}
                                      className="plansTable__cell__tooltip"
                                      followCursor={true}
                                      size="small"
                                      position="top">
            <span className="d-block plansTable__cell__usage">
            {currentUsage}/{maxUsage}
                <ProgressBarSubscription progress={currentUsage/maxUsage} />
        </span>
        </Tooltip>: ''}
    </div>
};

export default PlansTableCell;
