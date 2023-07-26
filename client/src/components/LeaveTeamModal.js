import React, {useContext, useState} from 'react';
import Loader from "./Loader";
import noIcon from '../static/img/no.svg';
import {leaveTeam} from "../api/users";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import CloseModalButton from "./CloseModalButton";
import {TranslationContext} from "../App";

const LeaveTeamModal = ({closeModal, setTeam}) => {
    const { content } = useContext(TranslationContext);

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    const handleSubmit = () => {
        setLoading(true);
        leaveTeam()
            .then((res) => {
                if(res?.status === 200) {
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
            });
    }

    const closeModalWrapper = () => {
        if(success) {
            setTeam(null);
        }

        closeModal();
    }

    return <div className="modal modal--leaveTeam">
        <CloseModalButton onClick={closeModalWrapper} />

        <div className="modal__inner">
            {!success && !error ? <>
                <img className="img img--modalWarning" src={noIcon} alt="warning" />

                <p className="modal__header modal__header--text">
                    {content.leaveTeamModalAlert}
                </p>

                {!loading ? <div className="flex flex--twoButtons">
                    <button className="btn btn--leaveTeam"
                            onClick={handleSubmit}>
                        {content.leaveTeam}
                    </button>
                    <button className="btn btn--neutral"
                            onClick={closeModalWrapper}>
                        {content.cancel}
                    </button>
                </div>: <Loader width={50} />}
            </> :  <>
                <h4 className="afterRegister__header afterRegister__header--center">
                    {error ? error : content.leaveTeamInfo}
                </h4>

                <a className="btn btn--afterRegister"
                   href="/home">
                    {content.backHomepage}
                </a>
            </>}
        </div>
    </div>
};

export default LeaveTeamModal;
