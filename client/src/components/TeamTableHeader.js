import React, {useContext} from 'react';
import {TranslationContext} from "../App";

const TeamTableHeader = () => {
    const { content } = useContext(TranslationContext);

    return <div className="line line--membersHeader">
        {content.teamTableHeader.map((item, index) => {
            return <div className="sheet__header__cell"
                        key={index}>
                {item}
            </div>
        })}
    </div>
}

export default TeamTableHeader;
