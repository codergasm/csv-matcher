import React, {useContext} from 'react';
import {Tooltip} from "react-tippy";
import {TranslationContext} from "../App";

const LeaveTeamButton = ({isOwner, isTeamEmpty,
                             setDeleteTeamModalVisible, setLeaveTeamModalVisible}) => {
    const { content } = useContext(TranslationContext);

    if(!isOwner) {
        return <button className="btn btn--leaveTeam"
                       onClick={() => { setLeaveTeamModalVisible(true); }}>
            {content.leaveTeam}
        </button>
    }
    else if(isOwner && isTeamEmpty) {
        return <button className="btn btn--leaveTeam"
                       onClick={() => { setDeleteTeamModalVisible(true); }}>
            {content.deleteTeam}
        </button>
    }
    else {
        return <Tooltip title={content.youCanNotLeaveTeam}
                        followCursor={true}
                        size="small"
                        position="top">
            <button className="btn btn--leaveTeam"
                    disabled={true}
                    onClick={() => { setLeaveTeamModalVisible(true); }}>
                {content.leaveTeam}
            </button>
        </Tooltip>
    }
};

export default LeaveTeamButton;
