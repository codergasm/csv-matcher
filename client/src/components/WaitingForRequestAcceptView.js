import React, {useContext, useEffect, useState} from 'react';
import {getTeamById} from "../api/teams";
import {deleteJoinTeamRequest} from "../api/users";
import {TranslationContext} from "../App";

const WaitingForRequestAcceptView = ({requestedTeamId}) => {
    const { content } = useContext(TranslationContext);

    const [requestedTeamName, setRequestedTeamName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if(requestedTeamId) {
            getTeamById(requestedTeamId)
                .then((res) => {
                    if(res?.data) {
                        setRequestedTeamName(res.data.name);
                    }
                });
        }
    }, [requestedTeamId]);

    const removeJoinRequest = () => {
        if(window.confirm(content.cancelJoinTeamRequestModalAlert)) {
            deleteJoinTeamRequest()
                .then(() => {
                    window.location = '/zespol';
                })
                .catch(() => {
                    setError(content.error);
                });
        }
    }

    return <div className="container">
        <div className="homepage">
            <h3 className="waitingForRequestAccept__header">
                {content.joinTeamRequestHeaderPart1}
                <span className="green"> {requestedTeamName} </span>
                {content.joinTeamRequestHeaderPart2}.
            </h3>
            <h4 className="waitingForRequestAccept__subheader">
                {content.joinTeamRequestSubheader}
            </h4>

            {error ? <span className="error error--deleteRequest">
                {error}
            </span> : ''}

            <div className="flex flex--waitingRequest">
                <a className="btn btn--backToHomepage"
                   href="/home">
                    {content.backHomepage}
                </a>

                <button className="btn btn--deleteRequest"
                        onClick={removeJoinRequest}>
                    {content.cancelJoinTeamRequest}
                </button>
            </div>
        </div>
    </div>
};

export default WaitingForRequestAcceptView;
