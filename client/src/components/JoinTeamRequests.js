import React, {useEffect, useState} from 'react';
import {getWaitingJoinTeamRequests} from "../helpers/teams";

const JoinTeamRequests = ({teamId}) => {
    const [joinRequests, setJoinRequests] = useState([]);

    useEffect(() => {
        if(teamId) {
            getWaitingJoinTeamRequests(teamId)
                .then((res) => {
                    if(res?.data) {
                        console.log(res.data);
                        setJoinRequests(res.data);
                    }
                });
        }
    }, [teamId]);

    return <div className="joinRequests">
        <h3 className="joinRequests__header">
            Prośby dodania do zespołu
        </h3>

        {joinRequests.map((item, index) => {
            return <div className="joinRequest" key={index}>

            </div>
        })}
    </div>
};

export default JoinTeamRequests;
