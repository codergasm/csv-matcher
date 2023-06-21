import React, {useEffect, useState} from 'react';
import {getTeamMembers} from "../api/teams";
import TeamTableHeader from "./TeamTableHeader";
import TeamTableMemberRow from "./TeamTableMemberRow";
import TeamTableOwnerRow from "./TeamTableOwnerRow";

const TeamViewTable = ({team, isOwner, updateTeamMembers}) => {
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

    return <div className="teamTable w scroll">
        <div className="sheet__table">
            <TeamTableHeader />

            {isOwner ? members.map((item, index) => {
                return <TeamTableOwnerRow item={item}
                                          index={index}
                                          members={members}
                                          setMembers={setMembers} />
            }) : members.map((item, index) => {
                return <TeamTableMemberRow item={item}
                                           index={index} />
            })}
        </div>
    </div>
};

export default TeamViewTable;
