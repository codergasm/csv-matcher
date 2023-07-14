import React from 'react';
import PlansTableLegend from "./PlansTableLegend";
import PlansTableItem from "./PlansTableItem";

const plansColors = ['#508345', 'brown', 'silver', 'gold'];

const PlansTable = ({plans}) => {
    return <div className="plansTable w flex">
        <div className="plansTable__left">
            <div className="plansTable__left__heading">
                <h3 className="plansTable__left__header">
                    Nasze plany
                </h3>
                <p className="plansTable__left__text">
                    Wybierz odpowiedni plan dla Twojego zespołu
                </p>
            </div>

            <PlansTableLegend />
        </div>
        <div className="plansTable__plans flex">
            {plans.map((item, index) => {
                return <PlansTableItem item={item}
                                       color={plansColors[index]}
                                       index={index} />
            })}
        </div>
    </div>
};

export default PlansTable;
