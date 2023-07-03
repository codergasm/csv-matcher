import React from 'react';
import {Tooltip} from "react-tippy";

const LeaveTeamButton = ({isOwner, isTeamEmpty,
                             setDeleteTeamModalVisible, setLeaveTeamModalVisible}) => {
    if(!isOwner) {
        // Leave team
        return <button className="btn btn--leaveTeam"
                       onClick={() => { setLeaveTeamModalVisible(true); }}>
            Opuść zespół
        </button>
    }
    else if(isOwner && isTeamEmpty) {
        // Delete team
        return <button className="btn btn--leaveTeam"
                       onClick={() => { setDeleteTeamModalVisible(true); }}>
            Usuń zespół
        </button>
    }
    else {
        // Button disabled
        return <Tooltip title={'Nie możesz opuścić zespołu, ponieważ jesteś jego właścicielem'}
                        followCursor={true}
                        size="small"
                        position="top">
            <button className="btn btn--leaveTeam"
                    disabled={true}
                    onClick={() => { setLeaveTeamModalVisible(true); }}>
                Opuść zespół
            </button>
        </Tooltip>
    }
};

export default LeaveTeamButton;
