import React, {useState} from 'react';
import {updateTeamName} from "../helpers/teams";
import LeaveTeamModal from "./LeaveTeamModal";

const TeamViewHeader = ({team, setTeam, user, isOwner}) => {
    const [newName, setNewName] = useState('');
    const [leaveTeamModalVisible, setLeaveTeamModalVisible] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(0);

    const changeTeamNameWrapper = () => {
        if(newName) {
            updateTeamName(team.id, newName)
                .then((res) => {

                })
                .catch((err) => {

                });
        }
    }

    return <div className="teamViewHeader flex">
        {leaveTeamModalVisible ? <LeaveTeamModal closeModal={() => { setLeaveTeamModalVisible(false); }}
                                                 setTeam={setTeam} /> : ''}

        <h3 className="teamNameHeader">
            Twój zespół:
            <span>
                {team.name}
            </span>
            {isOwner ? <button className="btn btn--save" onClick={() => { changeTeamNameWrapper(); }}>
                Zmień nazwę
            </button> : <button className="btn btn--leaveTeam" onClick={() => { setLeaveTeamModalVisible(true); }}>
                Opuść zespół
            </button>}
        </h3>
        <h4 className="teamIdHeader">
                <span>
                    ID: <span className="teamId">{team.id}</span>
                </span>
                <span className="teamId--info">
                    Podaj ten numer członkom swojego zespołu, aby mogli się do niego dodać
                </span>
        </h4>
    </div>
};

export default TeamViewHeader;
