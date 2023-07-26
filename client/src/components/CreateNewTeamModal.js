import React, {useContext, useEffect, useState} from 'react';
import {createTeam, generateTeamUrl, getAllTeams} from "../api/teams";
import Loader from "./Loader";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import {TranslationContext} from "../App";
import CloseModalButton from "./CloseModalButton";
import ErrorInfo from "./ErrorInfo";

const CreateNewTeamModal = ({closeModal}) => {
    const { content } = useContext(TranslationContext);

    const [name, setName] = useState('');
    const [allTeamsNames, setAllTeamsNames] = useState([]);
    const [allTeamsUrls, setAllTeamsUrls] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

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
            setError(content.teamNameAlreadyTaken);
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
                        setError(content.error);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    setError(content.error);
                });
        }
    }

    return <div className="modal modal--createNewTeam">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
            {!success ? <>
                <h3 className="modal__header">
                    {content.createNewTeam}
                </h3>

                <label className="label label--teamName">
                    <input className="input input--teamName"
                           placeholder="Nazwa zespołu"
                           value={name}
                           onChange={(e) => { setName(e.target.value); }} />
                </label>

                <ErrorInfo content={error} />

                {!loading ? <button className="btn btn--submitForm btn--submitFormNewTeam"
                                    onClick={handleSubmit}>
                    {content.createNewTeam}
                </button> : <Loader width={50} />}
            </> : <>
                <h4 className="afterRegister__header afterRegister__header--center">
                    {content.teamCreatedHeader}
                </h4>

                <a className="btn btn--afterRegister"
                   href="/zespol">
                    {content.manageTeam}
                </a>
            </>}
        </div>
    </div>
};

export default CreateNewTeamModal;
