import React, {useEffect, useState} from 'react';
import LoadingPage from "../pages/LoadingPage";
import TeamViewHeader from "./TeamViewHeader";
import TeamViewTable from "./TeamViewTable";
import JoinTeamRequests from "./JoinTeamRequests";

const TeamView = ({team, setTeam, user}) => {
    const [isOwner, setIsOwner] = useState(false);
    const [updateTeamMembers, setUpdateTeamMembers] = useState(false);

    useEffect(() => {
        if(team?.owner_id === user?.id) {
            setIsOwner(true);
        }
    }, [team, user]);

    return team ? <div className="container">
        <div className="homepage">
            <TeamViewHeader team={team}
                            setTeam={setTeam}
                            isOwner={isOwner} />
            <TeamViewTable team={team}
                           updateTeamMembers={updateTeamMembers}
                           isOwner={isOwner} />
            {isOwner ? <JoinTeamRequests team={team}
                                         setUpdateTeamMembers={setUpdateTeamMembers} /> : ''}
        </div>
    </div> : <LoadingPage />
}

export default TeamView;
