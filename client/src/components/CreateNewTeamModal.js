import React, {useEffect, useState} from 'react';
import {createTeam, generateTeamUrl, getAllTeams} from "../helpers/teams";
import Loader from "./Loader";

const CreateNewTeamModal = ({closeModal}) => {
    const [name, setName] = useState('');
    const [allTeamsNames, setAllTeamsNames] = useState([]);
    const [allTeamsUrls, setAllTeamsUrls] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllTeams()
            .then((res) => {
               if(res?.data) {
                   setAllTeamsNames(res.data.map((item) => (item.name)));
                   setAllTeamsUrls(res.data.map((item) => (item.team_url)));
               }
            });
    }, []);

    useEffect(() => {
        const teamUrl = generateTeamUrl(name);

        const teamNameNotAvailable = allTeamsNames.find((item) => (item === name));
        const teamUrlNotAvailable = allTeamsUrls.find((item) => (item === teamUrl));

        if(teamNameNotAvailable || teamUrlNotAvailable) {
            setError('Podana nazwa jest już zajęta');
        }
        else {
            setError('');
        }
    }, [name]);

    const handleSubmit = () => {
        if(name && !error) {
            setLoading(true);

            createTeam(name)
                .then((res) => {
                    if(res) {
                        setSuccess(true);
                    }
                    else {
                        setError('Coś poszło nie tak... Prosimy spróbować później');
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    setError('Coś poszło nie tak... Prosimy spróbować później');
                });
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
                    Utwórz nowy zespół
                </h3>

                <label className="label label--teamName">
                    <input className="input input--teamName"
                           placeholder="Nazwa zespołu"
                           value={name}
                           onChange={(e) => { setName(e.target.value); }} />
                </label>

                {error ? <span className="error">
                    {error}
                </span> : ''}

                {!loading ? <button className="btn btn--submitForm btn--submitFormNewTeam"
                                    onClick={() => { handleSubmit(); }}>
                    Stwórz nowy zespół
                </button> : <Loader width={50} />}
            </> : <>
                <h4 className="afterRegister__header afterRegister__header--center">
                    Udało się utworzyć Twój zespół!
                </h4>

                <a className="btn btn--afterRegister" href="/zespol">
                    Zarządzaj zespołem
                </a>
            </>}
        </div>
    </div>
};

export default CreateNewTeamModal;
