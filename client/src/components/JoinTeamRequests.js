import React, {useEffect, useState} from 'react';
import {getWaitingJoinTeamRequests} from "../helpers/teams";
import {getDateFromString} from "../helpers/others";
import {acceptJoinRequest, rejectJoinRequest} from "../helpers/users";
import Loader from "./Loader";

const JoinTeamRequests = ({team, setUpdateTeamMembers}) => {
    const [joinRequests, setJoinRequests] = useState([]);
    const [updateRequestList, setUpdateRequestList] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(team) {
            getWaitingJoinTeamRequests(team.id)
                .then((res) => {
                    if(res?.data) {
                        setJoinRequests(res.data);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [team, updateRequestList]);

    const acceptRequestWrapper = (userId, teamId) => {
        setLoading(true);
        acceptJoinRequest(userId, teamId)
            .then(() => {
                setUpdateRequestList(p => !p);
                setUpdateTeamMembers(p => !p);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    const rejectRequestWrapper = (userId, teamId) => {
        setLoading(true);
        rejectJoinRequest(userId, teamId)
            .then(() => {
                setUpdateRequestList(p => !p);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return <div className="joinRequests w">
        <h3 className="joinRequests__header">
            Prośby dodania do zespołu
        </h3>

        {!loading ? (joinRequests?.length ? joinRequests.map((item, index) => {
            return <div className="joinRequest flex shadow" key={index}>
                <h4 className="joinRequest__mail">
                    {item.u_email}
                </h4>

                <h5 className="joinRequest__date" dangerouslySetInnerHTML={{
                    __html: getDateFromString(item.r_created_datetime)
                }}>

                </h5>

                <div className="joinRequest__buttons">
                    <button className="btn btn--accept"
                            onClick={() => { acceptRequestWrapper(item.r_user_id, item.r_team_id); }}>
                        Akceptuj
                    </button>
                    <button className="btn btn--reject"
                            onClick={() => { rejectRequestWrapper(item.r_user_id, item.r_team_id); }}>
                        Odrzuć
                    </button>
                </div>
            </div>
        }) : <h5 className="noJoinRequests">
            Nie masz żadnych oczekujących próśb o dołączenie do zespołu
        </h5>) : <div className="joinRequestsLoaderWrapper">
            <Loader />
        </div>}
    </div>
};

export default JoinTeamRequests;