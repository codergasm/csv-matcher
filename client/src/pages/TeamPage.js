import React, {useEffect, useState} from 'react';
import {getTeamById} from "../helpers/teams";
import LoadingPage from "./LoadingPage";
import UserNotInTeamView from "../components/UserNotInTeamView";
import {isObjectEmpty} from "../helpers/others";
import TeamView from "../components/TeamView";
import {getUserWaitingJoinTeamRequest} from "../helpers/users";
import WaitingForRequestAcceptView from "../components/WaitingForRequestAcceptView";

const TeamPage = ({user}) => {
    const [team, setTeam] = useState({});
    const [render, setRender] = useState(<LoadingPage />);

    useEffect(() => {
        if(user) {
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
                    .catch(() => {
                        setTeam(null);
                    });
            }
            else {
                getUserWaitingJoinTeamRequest()
                    .then((res) => {
                        console.log(res);
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
                setRender(<TeamView />);
            }
        }
        else {
            setRender(<LoadingPage />);
        }
    }, [team]);

    return render;
};

export default TeamPage;
