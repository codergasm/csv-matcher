import React, {useEffect, useState} from 'react';
import LoadingPage from "../pages/LoadingPage";
import TeamViewHeader from "./TeamViewHeader";
import TeamViewTable from "./TeamViewTable";
import JoinTeamRequests from "./JoinTeamRequests";
import {getTeamMembers} from "../api/teams";

const TeamView = ({team, setTeam, user}) => {
    const [isOwner, setIsOwner] = useState(false);
    const [updateTeamMembers, setUpdateTeamMembers] = useState(false);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if(team?.owner_id === user?.id) {
            setIsOwner(true);
        }
    }, [team, user]);

    useEffect(() => {
        if(team?.id) {
            getTeamMembers(team.id)
                .then((res) => {
                    if(res?.data) {
                        setMembers(res.data);
                    }
                });
        }
    }, [team, updateTeamMembers]);

    return team ? <div className="container">
        <div className="homepage">
            <TeamViewHeader team={team}
                            setTeam={setTeam}
                            isTeamEmpty={members.length === 1}
                            isOwner={isOwner} />
            <TeamViewTable members={members}
                           setMembers={setMembers}
                           user={user}
                           isOwner={isOwner} />

            {isOwner ? <JoinTeamRequests team={team}
                                         setUpdateTeamMembers={setUpdateTeamMembers} /> : ''}
        </div>
    </div> : <LoadingPage />
}

export default TeamView;
