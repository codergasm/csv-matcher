import React, {useEffect, useState} from 'react';
import {generateTeamUrl, getAllTeams, updateTeamName} from "../api/teams";
import LeaveTeamModal from "./LeaveTeamModal";
import copyIcon from '../static/img/copy.svg';
import editIcon from '../static/img/edit.svg';
import checkIcon from '../static/img/check.svg';
import Loader from "./Loader";
import {errorText} from "../static/content";

const TeamViewHeader = ({team, setTeam, isOwner}) => {
    const [name, setName] = useState('');
    const [newName, setNewName] = useState('');
    const [newTeamUrl, setNewTeamUrl] = useState('');
    const [leaveTeamModalVisible, setLeaveTeamModalVisible] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [copied, setCopied] = useState(false);
    const [allTeamsNames, setAllTeamsNames] = useState([]);
    const [allTeamsUrls, setAllTeamsUrls] = useState([]);

    useEffect(() => {
        getAllTeams()
            .then((res) => {
                if(res?.data) {
                    const data = res.data.filter((item) => (item.name !== name));

                    setAllTeamsNames(data.map((item) => (item.name)));
                    setAllTeamsUrls(data.map((item) => (item.team_url)));
                }
            });
    }, []);

    useEffect(() => {
        const teamUrl = generateTeamUrl(newName);
        setNewTeamUrl(teamUrl);

        const teamNameNotAvailable = allTeamsNames.find((item) => (item === newName));
        const teamUrlNotAvailable = allTeamsUrls.find((item) => (item === teamUrl));

        if(teamNameNotAvailable || teamUrlNotAvailable) {
            setError('Podana nazwa jest już zajęta');
        }
        else {
            setError('');
        }
    }, [newName]);

    useEffect(() => {
        if(team) {
            setName(team.name);
            setNewName(team.name);
        }
    }, [team]);

    useEffect(() => {
        if(copied) {
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [copied]);

    const copyId = () => {
        const input = document.createElement('textarea');
        input.innerHTML = team.id;
        document.body.appendChild(input);
        input.select();
        const result = document.execCommand('copy');
        document.body.removeChild(input);
        setCopied(true);
        return result;
    }

    const changeTeamNameWrapper = () => {
        if(newName && !error) {
            setLoading(true);
            updateTeamName(team.id, newName, newTeamUrl)
                .then((res) => {
                    if(res?.status === 200) {
                        setName(newName);
                    }
                    else {
                        setError(errorText);
                    }
                    setUpdateMode(false);
                    setLoading(false);
                })
                .catch((err) => {
                    setUpdateMode(false);
                    setLoading(false);
                    setError(errorText);
                });
        }
    }

    return <div className="teamViewHeader flex">
        {leaveTeamModalVisible ? <LeaveTeamModal closeModal={() => { setLeaveTeamModalVisible(false); }}
                                                 setTeam={setTeam} /> : ''}

        <h3 className="teamNameHeader">
            Twój zespół:

            {!isOwner || !updateMode ? <span>
                {name}
            </span> : <input className="input input--teamNameUpdate"
                             placeholder="Nazwa zespołu"
                             value={newName}
                             onChange={(e) => { setNewName(e.target.value); }} />}

            {isOwner ? (updateMode ? (!loading ? <button className="btn btn--save"
                                                         disabled={!!error || !newName}
                                                         onClick={changeTeamNameWrapper}>
                Zmień nazwę
            </button> : <Loader width={40} />) : <button className="btn--edit" onClick={() => { setUpdateMode(true); }}>
                <img className="img" src={editIcon} alt="edytuj" />
            </button>) : <button className="btn btn--leaveTeam" onClick={() => { setLeaveTeamModalVisible(true); }}>
                Opuść zespół
            </button>}

            {error ? <span className="error error--updateTeamName">
                {error}
            </span> : ''}
        </h3>
        <h4 className="teamIdHeader">
                <span>
                    ID:
                    <span className="teamId">{team.id}</span>
                    {!copied ? <button className="btn--edit btn--copy"
                                       onClick={() => { copyId(); }}>
                        <img className="img" src={copyIcon} alt="kopiuj" />
                    </button> : <img className="img--copied" src={checkIcon} alt="skopiowano" />}
                </span>
                <span className="teamId--info">
                    Podaj ten numer członkom swojego zespołu, aby mogli się do niego dodać
                </span>
        </h4>
    </div>
};

export default TeamViewHeader;
