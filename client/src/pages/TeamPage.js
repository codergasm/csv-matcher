import React, {useContext, useEffect, useState} from 'react';
import {getTeamById} from "../api/teams";
import LoadingPage from "./LoadingPage";
import UserNotInTeamView from "../components/UserNotInTeamView";
import {isObjectEmpty} from "../helpers/others";
import TeamView from "../components/TeamView";
import {getUserWaitingJoinTeamRequest} from "../api/users";
import WaitingForRequestAcceptView from "../components/WaitingForRequestAcceptView";
import {UserContext} from "../components/LoggedUserWrapper";

const TeamPage = () => {
    const { user } = useContext(UserContext);

    const [team, setTeam] = useState({});
    const [render, setRender] = useState(<LoadingPage />);

    useEffect(() => {
        if(!isObjectEmpty(user)) {
            if(user.teamId) {
                getTeamById(user.teamId)
                    .then((res) => {
                        if(res?.data) {
                            setTeam(res.data);
                        }
                        else {
                            setTeam(null);
                        }
                    })
                    .catch((err) => {
                        setTeam(null);
                    });
            }
            else {
                getUserWaitingJoinTeamRequest()
                    .then((res) => {
                        if(res?.data) {
                            setTeam({
                                waiting: res.data.team_id
                            });
                        }
                        else {
                            setTeam(null);
                        }
                    })
                    .catch(() => {
                        setTeam(null);
                    });
            }
        }
    }, [user]);

    useEffect(() => {
        if(team === null) {
            setRender(<UserNotInTeamView />);
        }
        else if(!isObjectEmpty(team)) {
            if(team.waiting) {
                // Waiting for accept join request
                setRender(<WaitingForRequestAcceptView requestedTeamId={team.waiting} />);
            }
            else {
                // Already in team
                setRender(<TeamView team={team}
                                    setTeam={setTeam}
                                    user={user} />);
            }
        }
        else {
            setRender(<LoadingPage />);
        }
    }, [team]);

    return render;
};

export default TeamPage;
