import React from 'react';

const PlansTableItemHeading = ({name, price, currency, color}) => {
    return <div className="plansTable__plans__item__heading" style={{
        background: color
    }}>
        <h4 className="plansTable__plans__item__header">
            {name}
        </h4>
        <h5 className="plansTable__plans__item__price center">
            <span>{price}</span>
            <span>{currency}</span>
        </h5>
    </div>
};

export default PlansTableItemHeading;
