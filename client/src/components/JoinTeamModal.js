import React, {useState} from 'react';
import {sendRequestToJoinTeam} from "../api/users";
import Loader from "./Loader";

const JoinTeamModal = ({closeModal}) => {
    const [teamId, setTeamId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const joinTeam = () => {
        if(teamId) {
            setLoading(true);
            sendRequestToJoinTeam(teamId)
                .then((res) => {
                    if(res?.status === 201) {
                        setSuccess(true);
                    }
                    else {
                        setError('Coś poszło nie tak... Prosimy spróbować później');
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setError('Coś poszło nie tak... Prosimy spróbować później');
                })
        }
    }

    return <div className="modal modal--createNewTeam">
        <button className="btn btn--closeModal"
                onClick={() => { closeModal(); }}>
            &times;
        </button>

        <div className="modal__inner">
            {!success ? <>
                <h3 className="modal__header">
                    Dołącz do zespołu
                </h3>
                <input className="input input--teamId"
                       value={teamId}
                       onChange={(e) => { setTeamId(e.target.value); }}
                       placeholder="id zespołu" />

                {!loading ? <button className="btn btn--joinTeam"
                                    onClick={() => { joinTeam(); }}>
                    Dołącz
                </button> : <Loader width={50} />}
            </> :  <>
                <h4 className="afterRegister__header afterRegister__header--center">
                    Zgłoszenie do zespołu zostało wysłane. Po akceptacji przez właściciela dołączysz do zespołu.
                </h4>

                <a className="btn btn--afterRegister" href="/">
                    Wróć na stronę główną
                </a>
            </>}
        </div>
    </div>
};

export default JoinTeamModal;
