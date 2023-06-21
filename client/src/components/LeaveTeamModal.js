import React, {useState} from 'react';
import Loader from "./Loader";
import noIcon from '../static/img/no.svg';
import {leaveTeam} from "../api/users";

const LeaveTeamModal = ({closeModal, setTeam}) => {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setLoading(true);
        leaveTeam()
            .then((res) => {
                if(res?.status === 200) {
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
            });
    }

    const closeModalWrapper = () => {
        if(success) {
            setTeam(null);
        }

        closeModal();
    }

    return <div className="modal modal--leaveTeam">
        <button className="btn btn--closeModal"
                onClick={() => { closeModalWrapper(); }}>
            &times;
        </button>

        <div className="modal__inner">
            {!success && !error ? <>
                <img className="img img--modalWarning" src={noIcon} alt="ostrzezenie" />

                <p className="modal__header modal__header--text">
                    Uwaga! odłączając się od zespołu - wszystkie pliki i schematy,
                    które utworzyłeś i dodałeś jako dostępne dla zespołu pozostaną w nim i nie będą już dla Ciebie dostępne
                </p>

                {!loading ? <div className="flex flex--twoButtons">
                    <button className="btn btn--leaveTeam"
                            onClick={() => { handleSubmit(); }}>
                        Opuść zespół
                    </button>
                    <button className="btn btn--neutral" onClick={() => { closeModalWrapper(); }}>
                        Anuluj
                    </button>
                </div>: <Loader width={50} />}
            </> :  <>
                <h4 className="afterRegister__header afterRegister__header--center">
                    {error ? error : 'Opuściłeś zespół. Możesz teraz dołączyć do innego zespołu lub utworzyć nowy zespół.'}
                </h4>

                <a className="btn btn--afterRegister" href="/home">
                    Wróć na stronę główną
                </a>
            </>}
        </div>
    </div>
};

export default LeaveTeamModal;
