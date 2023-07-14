import React from 'react';

const PlansTableCell = ({children, large}) => {
    return <div className={large ? "plansTable__cell plansTable__cell--large" : "plansTable__cell"}>
        <span className="plansTable__cell__content">
            {children}
        </span>
    </div>
};

export default PlansTableCell;
