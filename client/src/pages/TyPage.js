import React, {useContext} from 'react';
import {TranslationContext} from "../App";

const TyPage = () => {
    const { content } = useContext(TranslationContext);

    return <div className="container">
        <div className="homepage">
            <h1 className="homepage__header">
                {content.tyHeader}
            </h1>

            <a className="btn btn--backToHomepage"
               href="/home">
                {content.backHomepage}
            </a>
        </div>
    </div>
};

export default TyPage;
