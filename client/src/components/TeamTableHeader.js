import React from 'react';
import {teamTableColumnsNames} from "../static/content";

const TeamTableHeader = () => {
    return <div className="line line--membersHeader">
        {teamTableColumnsNames.map((item, index) => {
            return <div className="sheet__header__cell"
                        key={index}>
                {item}
            </div>
        })}
    </div>
}

export default TeamTableHeader;
