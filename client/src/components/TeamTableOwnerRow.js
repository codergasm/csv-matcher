import React from 'react';
import checkIcon from "../static/img/check.svg";
import {updateUserRights} from "../api/users";

const TeamTableOwnerRow = ({item, index, members, setMembers}) => {
    const toggleMemberRights = (email, name) => {
        const userToUpdate = members.find((item) => (item.email === email));

        if(userToUpdate) {
            const can_edit_team_files = name === 'can_edit_team_files' ? !userToUpdate.can_edit_team_files :
                userToUpdate.can_edit_team_files;
            const can_delete_team_files = name === 'can_delete_team_files' ? !userToUpdate.can_delete_team_files :
                userToUpdate.can_delete_team_files;
            const can_edit_team_match_schemas = name === 'can_edit_team_match_schemas' ? !userToUpdate.can_edit_team_match_schemas :
                userToUpdate.can_edit_team_match_schemas;
            const can_delete_team_match_schemas = name === 'can_delete_team_match_schemas' ? !userToUpdate.can_delete_team_match_schemas :
                userToUpdate.can_delete_team_match_schemas;

            updateUserRights(email, can_edit_team_files, can_delete_team_files, can_edit_team_match_schemas, can_delete_team_match_schemas);

            updateMembersList(email, {
                can_edit_team_files,
                can_delete_team_files,
                can_edit_team_match_schemas,
                can_delete_team_match_schemas
            });
        }
    }

    const updateMembersList = (email, rights) => {
        const { can_edit_team_files, can_delete_team_files,
            can_edit_team_match_schemas, can_delete_team_match_schemas } = rights;

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

    return <div className="line line--member"
                key={index}>
        <div className="sheet__header__cell">
            {item.email}
        </div>
        <div className="sheet__header__cell">
            {item.numberOfFiles}
        </div>
        <div className="sheet__header__cell">
            {item.numberOfSchemas}
        </div>
        <div className="sheet__header__cell">
            {item.autoMatchRowsUsed}
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
};

export default TeamTableOwnerRow;
