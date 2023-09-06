import React, {useContext} from 'react';
import PlansTableLegendCell from "./PlansTableLegendCell";
import {TranslationContext} from "../App";

const PlansTableLegend = () => {
    const { content } = useContext(TranslationContext);

    return <div className="plansTable__left__legend">
        {content.plansTableLegend.map((item, index) => {
            return <React.Fragment key={index}>
                <PlansTableLegendCell content={item.content}
                                      info={item.info}
                                      large={item.large} />
            </React.Fragment>
        })}
    </div>
};

export default PlansTableLegend;
