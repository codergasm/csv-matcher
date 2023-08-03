import React, {useContext, useState} from 'react';
import {TranslationContext} from "../App";

const RelationTypeTooltip = () => {
    const { content } = useContext(TranslationContext);

    const [currentRelation, setCurrentRelation] = useState(0);

    return <div className="relationTypeTooltip">
        <p className="relationTypeTooltip__text">
            ?
        </p>

        <div className="relationTypeInstruction shadow">
            <h4 className="relationTypeInstruction__header">
                Wskaż relację - czyli co łączy rekordy z jednego
                arkusza, z rekordami drugiego arkusza?
            </h4>

            <div className="relationTypeInstruction__animation">

            </div>

            <div className="relationTypeInstruction__options flex">
                {content.relationTypes.map((item, index) => {
                    return <button className={currentRelation === index ? "relationTypeInstruction__options__item relationTypeInstruction__options__item--selected" : "relationTypeInstruction__options__item"}
                                   key={index}
                                   onClick={() => { setCurrentRelation(index); }}>
                        {item}
                    </button>
                })}
            </div>

            <div className="relationTypeInstruction__description">
                {content.relationTypeDescriptions[currentRelation]}
            </div>
        </div>
    </div>
};

export default RelationTypeTooltip;
