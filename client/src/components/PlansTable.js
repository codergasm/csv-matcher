import React from 'react';
import PlansTableLegend from "./PlansTableLegend";
import PlansTableItem from "./PlansTableItem";
import { plansColors } from "../static/constans";

const PlansTable = ({plans}) => {
    return <div className="plansTable w-small flex">
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
                return <React.Fragment key={index}>
                    <PlansTableItem item={item}
                                    index={index}
                                    color={plansColors[index]} />
                </React.Fragment>
            })}
        </div>
    </div>
};

export default PlansTable;
