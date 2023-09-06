import React, {useContext} from 'react';
import {TranslationContext} from "../App";

const PlansPageInfo = () => {
    const { content } = useContext(TranslationContext);

    return <div className="plans__info">
        <h4 className="plans__info__header">
            {content.plansPageInfo[0]}
        </h4>
        <p className="plans__info__text">
            {content.plansPageInfo[1]}
        </p>
        <p className="plans__info__text">
            {content.plansPageInfo[2]}
        </p>
    </div>
};

export default PlansPageInfo;
