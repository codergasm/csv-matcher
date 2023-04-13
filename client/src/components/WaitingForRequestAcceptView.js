import React, {useEffect, useState} from 'react';
import {getTeamById} from "../helpers/teams";
import {deleteJoinTeamRequest} from "../helpers/users";

const WaitingForRequestAcceptView = ({requestedTeamId}) => {
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
        if(window.confirm('Czy na pewno chcesz cofnąć to zgłoszenie?')) {
            deleteJoinTeamRequest()
                .then(() => {
                    window.location = '/zespol';
                })
                .catch(() => {
                    setError('Coś poszło nie tak... Prosimy spróbować później');
                });
        }
    }

    return <div className="container">
        <div className="homepage">
            <h3 className="waitingForRequestAccept__header">
                Twoje zgłoszenie do zespołu <span className="green">{requestedTeamName}</span> czeka na akceptację właściciela.
            </h3>
            <h4 className="waitingForRequestAccept__subheader">
                Poinformujemy Cię, gdy Twoje zgłoszenie zostanie zaakceptowane.
            </h4>

            {error ? <span className="error error--deleteRequest">
                {error}
            </span> : ''}

            <div className="flex flex--waitingRequest">
                <a className="btn btn--backToHomepage" href="/home">
                    Wróć na stronę główną
                </a>

                <button className="btn btn--deleteRequest" onClick={() => { removeJoinRequest(); }}>
                    Cofnij zgłoszenie
                </button>
            </div>
        </div>
    </div>
};

export default WaitingForRequestAcceptView;
