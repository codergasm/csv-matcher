import React from 'react';
import PlansTableItemHeading from "./PlansTableItemHeading";
import PlansTableCell from "./PlansTableCell";

const PlansTableItem = ({item, index, color}) => {
    const choosePlan = () => {

    }

    return <div className="plansTable__plans__item" key={index}>
        <PlansTableItemHeading name={item.name}
                               color={color}
                               price={item.price_pln}
                               currency={'zł/msc'} />

        <div className="plansTable__plans__item__content">
            <PlansTableCell>
                {item.users_per_team}
            </PlansTableCell>
            <PlansTableCell>
                {item.files_per_team}
            </PlansTableCell>
            <PlansTableCell>
                {item.rows_per_file}
            </PlansTableCell>
            <PlansTableCell>
                {item.columns_per_file}
            </PlansTableCell>
            <PlansTableCell>
                {item.size_per_file}
            </PlansTableCell>
            <PlansTableCell>
                {item.size_per_team}
            </PlansTableCell>
            <PlansTableCell>
                {item.schemas_per_team}
            </PlansTableCell>
            <PlansTableCell large={true}>
                {item.matches_per_month}
            </PlansTableCell>
        </div>

        <div className="buyPlanWrapper">
            <button onClick={choosePlan}
               className="btn btn--buyPlan center">
                Wybierz
            </button>
        </div>
    </div>
};

export default PlansTableItem;
