import React, {useEffect, useState} from 'react';
import {getTeamById} from "../helpers/teams";
import LoadingPage from "./LoadingPage";
import UserNotInTeamView from "../components/UserNotInTeamView";
import {isObjectEmpty} from "../helpers/others";
import TeamView from "../components/TeamView";

const TeamPage = ({user}) => {
    const [team, setTeam] = useState({});
    const [render, setRender] = useState(<LoadingPage />);

    useEffect(() => {
        if(user) {
            if(user.team) {
                getTeamById(user.team)
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
                setTeam(null);
            }
        }
    }, [user]);

    useEffect(() => {
        if(team === null) {
            setRender(<UserNotInTeamView />);
        }
        else if(!isObjectEmpty(team)) {
            setRender(<TeamView />);
        }
        else {
            setRender(<LoadingPage />);
        }
    }, [team]);

    return render;
};

export default TeamPage;
