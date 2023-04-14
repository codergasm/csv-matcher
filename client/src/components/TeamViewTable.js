import React, {useEffect, useState} from 'react';
import {getTeamMembers} from "../helpers/teams";
import noIcon from '../static/img/no.svg';
import yesIcon from '../static/img/yes.svg';
import {updateUserRights} from "../helpers/users";
import checkIcon from '../static/img/check.svg';

const TeamViewTable = ({team, isOwner, updateTeamMembers}) => {
    const columnsNames = [
        'email', 'pliki usera', 'schematy dopasowania usera',
        'wykorzystanych auto dopasowań rekordów w tym miesiącu',
        'może edytować pliki zespołu', 'może usuwać pliki zespołu',
        'może edytować schematy dopasowania zespołu',
        'może usuwać schematy dopasowania zespołu'
    ];

    const [members, setMembers] = useState([]);

    useEffect(() => {
        if(team?.id) {
            getTeamMembers(team.id)
                .then((res) => {
                    if(res?.data) {
                        setMembers(res.data);
                    }
                });
        }
    }, [team, updateTeamMembers]);

    const toggleMemberRights = (email, name) => {
        const userToUpdate = members.find((item) => (item.email === email));

        if(userToUpdate) {
            const can_edit_team_files = name === 'can_edit_team_files' ? !userToUpdate.can_edit_team_files : userToUpdate.can_edit_team_files;
            const can_delete_team_files = name === 'can_delete_team_files' ? !userToUpdate.can_delete_team_files : userToUpdate.can_delete_team_files;
            const can_edit_team_match_schemas = name === 'can_edit_team_match_schemas' ? !userToUpdate.can_edit_team_match_schemas : userToUpdate.can_edit_team_match_schemas;
            const can_delete_team_match_schemas = name === 'can_delete_team_match_schemas' ? !userToUpdate.can_delete_team_match_schemas : userToUpdate.can_delete_team_match_schemas;

            updateUserRights(email, can_edit_team_files, can_delete_team_files, can_edit_team_match_schemas, can_delete_team_match_schemas);

            setMembers((prevState) => (prevState.map((item) => {
                if(item.email === email) {
                    return {
                        ...item,
                        can_edit_team_files,
                        can_delete_team_files,
                        can_edit_team_match_schemas,
                        can_delete_team_match_schemas
                    }
                }
                else {
                    return item;
                }
            })));
        }
    }

    return <div className="teamTable w scroll">
        <div className="sheet__table">
            <div className="line line--membersHeader">
                {columnsNames.map((item, index) => {
                    return <div className="sheet__header__cell"
                                key={index}>
                        {item}
                    </div>
                })}
            </div>

            {isOwner ? members.map((item, index) => {
                return <div className="line line--member"
                            key={index}>
                    <div className="sheet__header__cell">
                        {item.email}
                    </div>
                    <div className="sheet__header__cell">

                    </div>
                    <div className="sheet__header__cell">

                    </div>
                    <div className="sheet__header__cell">

                    </div>
                    <div className="sheet__header__cell">
                        <button className="btn--rights"
                                onClick={() => { toggleMemberRights(item.email, 'can_edit_team_files') }}>
                            {item.can_edit_team_files ? <img className="img--check" src={checkIcon} alt="tak" /> : ''}
                        </button>
                    </div>
                    <div className="sheet__header__cell">
                        <button className="btn--rights"
                                onClick={() => { toggleMemberRights(item.email, 'can_delete_team_files') }}>
                            {item.can_delete_team_files ? <img className="img--check" src={checkIcon} alt="tak" /> : ''}
                        </button>
                    </div>
                    <div className="sheet__header__cell">
                        <button className="btn--rights"
                                onClick={() => { toggleMemberRights(item.email, 'can_edit_team_match_schemas') }}>
                            {item.can_edit_team_match_schemas ? <img className="img--check" src={checkIcon} alt="tak" /> : ''}
                        </button>
                    </div>
                    <div className="sheet__header__cell">
                        <button className="btn--rights"
                                onClick={() => { toggleMemberRights(item.email, 'can_delete_team_match_schemas') }}>
                            {item.can_delete_team_match_schemas ? <img className="img--check" src={checkIcon} alt="tak" /> : ''}
                        </button>
                    </div>
                </div>
            }) : members.map((item, index) => {
                return <div className="line line--member"
                            key={index}>
                    <div className="sheet__header__cell">
                        {item.email}
                    </div>
                    <div className="sheet__header__cell">

                    </div>
                    <div className="sheet__header__cell">

                    </div>
                    <div className="sheet__header__cell">

                    </div>
                    <div className="sheet__header__cell">
                        <img className="img img--rights" src={item.can_edit_team_files ? yesIcon : noIcon} alt="prawa" />
                    </div>
                    <div className="sheet__header__cell">
                        <img className="img img--rights" src={item.can_delete_team_files ? yesIcon : noIcon} alt="prawa" />
                    </div>
                    <div className="sheet__header__cell">
                        <img className="img img--rights" src={item.can_edit_team_match_schemas ? yesIcon : noIcon} alt="prawa" />
                    </div>
                    <div className="sheet__header__cell">
                        <img className="img img--rights" src={item.can_delete_team_match_schemas ? yesIcon : noIcon} alt="prawa" />
                    </div>
                </div>
            })}
        </div>
    </div>
};

export default TeamViewTable;
