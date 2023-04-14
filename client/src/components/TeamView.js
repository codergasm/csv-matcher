import React, {useEffect, useState} from 'react';
import LoadingPage from "../pages/LoadingPage";
import TeamViewHeader from "./TeamViewHeader";
import TeamViewTable from "./TeamViewTable";

const TeamView = ({team, setTeam, user}) => {
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if(team?.owner_id === user?.id) {
            setIsOwner(true);
        }
    }, [team, user]);

    return team ? <div className="container">
        <div className="homepage">
            <TeamViewHeader team={team} setTeam={setTeam} user={user} isOwner={isOwner} />
            <TeamViewTable team={team} isOwner={isOwner} />
        </div>
    </div> : <LoadingPage />
}

export default TeamView;
