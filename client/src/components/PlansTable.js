import React, {useContext} from 'react';
import PlansTableLegend from "./PlansTableLegend";
import PlansTableItem from "./PlansTableItem";
import { plansColors } from "../static/constans";
import {TranslationContext} from "../App";

const PlansTable = ({plans}) => {
    const { content } = useContext(TranslationContext);

    return <div className="plansTable w-small flex">
        <div className="plansTable__left">
            <div className="plansTable__left__heading">
                <h3 className="plansTable__left__header">
                    {content.ourPlans}
                </h3>
                <p className="plansTable__left__text">
                    {content.ourPlansSubheader}
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
