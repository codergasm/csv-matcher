import React, {useState} from 'react';
import checkIcon from "../static/img/check.svg";
import {updateUserRights} from "../api/users";
import Loader from "./Loader";
import QuickBottomInfo from "./QuickBottomInfo";

const rightsList = ['can_edit_team_files', 'can_delete_team_files',
    'can_edit_team_match_schemas', 'can_delete_team_match_schemas'];

const TeamTableOwnerRow = ({item, index, members, setMembers}) => {
    const [loadingRightsRequest, setLoadingRightsRequest] = useState(-2);

    const toggleMemberRights = async (email, rightType) => {
        const userToUpdate = members.find((item) => (item.email === email));
        const rightNameToChange = rightsList[rightType];

        const isRightToChange = (right) => {
            return right === rightNameToChange;
        }

        if(userToUpdate) {
            let allRights = [];

            for(const right of rightsList) {
                let newRight = isRightToChange(right) ? !userToUpdate[right] : userToUpdate[right];
                allRights.push(newRight);
            }

            setLoadingRightsRequest(rightType);
            await updateUserRights(email, ...allRights);
            setLoadingRightsRequest(-1);

            const rightsObject = allRights.reduce((acc, curr, index) => {
                return {...acc, [rightsList[index]]: curr}
            }, {});

            updateMembersList(email, {
                ...rightsObject
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

        {rightsList.map((rightName, rightIndex) => {
            return <div className="sheet__header__cell"
                        key={rightIndex}>
                {loadingRightsRequest === rightIndex ? <Loader width={20} /> : <button className="btn--rights"
                                                                              onClick={() => { toggleMemberRights(item.email, rightIndex) }}>
                    {item[rightName] ? <img className="img--check" src={checkIcon} alt="tak" /> : ''}
                </button>}
            </div>
        })}

        {loadingRightsRequest === -1 ? <QuickBottomInfo time={2000}>
            Prawa zostały zaktualizowane
        </QuickBottomInfo> : ''}
    </div>
};

export default TeamTableOwnerRow;
