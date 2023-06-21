import React from 'react';
import yesIcon from "../static/img/yes.svg";
import noIcon from "../static/img/no.svg";

const TeamTableMemberRow = ({item, index}) => {
    return <div className="line line--member"
                key={index}>
        <div className="sheet__header__cell">
            {item.email}
        </div>
        <div className="sheet__header__cell">
            {item.numberOfFiles}
        </div>
        <div className="sheet__header__cell">
            {item.numberOfSchemas}
        </div>
        <div className="sheet__header__cell">
            {item.autoMatchRowsUsed}
        </div>
        <div className="sheet__header__cell">
            <img className="img img--rights" src={item.can_edit_team_files ? yesIcon : noIcon} alt="prawa" />
        </div>
        <div className="sheet__header__cell">
            <img className="img img--rights" src={item.can_delete_team_files ? yesIcon : noIcon} alt="prawa" />
        </div>
        <div className="sheet__header__cell">
            <img className="img img--rights" src={item.can_edit_team_match_schemas ? yesIcon : noIcon} alt="prawa" />
        </div>
        <div className="sheet__header__cell">
            <img className="img img--rights" src={item.can_delete_team_match_schemas ? yesIcon : noIcon} alt="prawa" />
        </div>
    </div>
};

export default TeamTableMemberRow;
