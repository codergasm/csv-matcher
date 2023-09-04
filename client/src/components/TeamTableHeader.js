import React, {useContext} from 'react';
import {TranslationContext} from "../App";
import {SubscriptionContext} from "./LoggedUserWrapper";

const TeamTableHeader = () => {
    const { content } = useContext(TranslationContext);
    const { isUserTeamOwner } = useContext(SubscriptionContext);

    return <div className="line line--membersHeader">
        {content.teamTableHeader.map((item, index) => {
            return <div className="sheet__header__cell"
                        key={index}>
                {item}
            </div>
        })}

        {isUserTeamOwner ? <div className="sheet__header__cell">
            {content.deleteUser}
        </div> : ''}
    </div>
}

export default TeamTableHeader;
