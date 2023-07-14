import React from 'react';

const PlansTableLegendCell = ({content, info, large}) => {
    return <div className={large ? "plansTable__cell plansTable__cell--large" : "plansTable__cell"}>
        <p className="plansTable__cell__content">
            {content}
        </p>
        {info ? <p className="plansTable__cell__info">
            {info}
        </p> : ''}
    </div>
};

export default PlansTableLegendCell;
