import React from 'react';
import TeamTableHeader from "./TeamTableHeader";
import TeamTableMemberRow from "./TeamTableMemberRow";
import TeamTableOwnerRow from "./TeamTableOwnerRow";

const TeamViewTable = ({isOwner, members, setMembers}) => {
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
