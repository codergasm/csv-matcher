import React, {useContext, useState} from 'react';
import {sendRequestToJoinTeam} from "../api/users";
import Loader from "./Loader";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import CloseModalButton from "./CloseModalButton";
import {TranslationContext} from "../App";

const JoinTeamModal = ({closeModal}) => {
    const { content } = useContext(TranslationContext);

    const [teamId, setTeamId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    const joinTeam = () => {
        if(teamId) {
            setLoading(true);
            sendRequestToJoinTeam(teamId)
                .then((res) => {
                    if(res?.status === 201) {
                        setSuccess(true);
                    }
                    else {
                        setError(content.error);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setError(content.error);
                })
        }
    }

    return <div className="modal modal--createNewTeam">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
            {!success ? <>
                <h3 className="modal__header">
                    {content.joinTeam}
                </h3>
                <input className="input input--teamId"
                       value={teamId}
                       onChange={(e) => { setTeamId(e.target.value); }}
                       placeholder={content.teamId} />

                {!loading ? <button className="btn btn--joinTeam"
                                    onClick={joinTeam}>
                    {content.join}
                </button> : <Loader width={50} />}
            </> :  <>
                {success ? <h4 className="afterRegister__header afterRegister__header--center">
                    {content.joinTeamRequestSendInfo}
                </h4> : <h4 className="afterRegister__header afterRegister__header--center">
                    {error}
                </h4>}

                <a className="btn btn--afterRegister"
                   href="/">
                    {content.backHomepage}
                </a>
            </>}
        </div>
    </div>
};

export default JoinTeamModal;
