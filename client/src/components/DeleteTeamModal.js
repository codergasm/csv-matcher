import React, {useState} from 'react';
import Loader from "./Loader";
import noIcon from '../static/img/no.svg';
import {errorText} from "../static/content";
import {deleteTeam} from "../api/teams";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";

const DeleteTeamModal = ({closeModal, setTeam, teamId}) => {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const closeModalWrapper = () => {
        if(success) {
            setTeam(null);
        }

        closeModal();
    }

    useCloseModalOnOutsideClick(closeModalWrapper);
    useActionOnEscapePress(closeModalWrapper);

    const handleSubmit = () => {
        setLoading(true);

        deleteTeam(teamId)
            .then((res) => {
                if(res?.status === 200) {
                    setSuccess(true);
                }
                else {
                    setError(errorText);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setError(errorText);
            });
    }

    return <div className="modal modal--leaveTeam">
        <button className="btn btn--closeModal"
                onClick={closeModalWrapper}>
            &times;
        </button>

        <div className="modal__inner">
            {!success && !error ? <>
                <img className="img img--modalWarning" src={noIcon} alt="ostrzezenie" />

                <p className="modal__header modal__header--text">
                    Uwaga! Usuwając zespół przypiszesz wszystkie pliki
                    i schematy dopasowania z powrotem do Twojego profilu.
                </p>

                {!loading ? <div className="flex flex--twoButtons">
                    <button className="btn btn--leaveTeam"
                            onClick={handleSubmit}>
                        Usuń zespół
                    </button>
                    <button className="btn btn--neutral"
                            onClick={closeModalWrapper}>
                        Anuluj
                    </button>
                </div>: <Loader width={50} />}
            </> :  <>
                <h4 className="afterRegister__header afterRegister__header--center">
                    {error ? error : 'Usunąłeś swój zespół. Możesz teraz dołączyć do innego zespołu lub utworzyć nowy zespół.'}
                </h4>

                <a className="btn btn--afterRegister"
                   href="/home">
                    Wróć na stronę główną
                </a>
            </>}
        </div>
    </div>
};

export default DeleteTeamModal;
