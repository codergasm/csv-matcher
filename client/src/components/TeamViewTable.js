import React from 'react';
import TeamTableHeader from "./TeamTableHeader";
import TeamTableMemberRow from "./TeamTableMemberRow";
import TeamTableOwnerRow from "./TeamTableOwnerRow";

const TeamViewTable = ({isOwner, members, setMembers, user}) => {
    return <div className="teamTable w scroll">
        <div className="sheet__table">
            <TeamTableHeader />

            {isOwner ? members.map((item, index) => {
                return <React.Fragment key={index}>
                    <TeamTableOwnerRow item={item}
                                       user={user}
                                       members={members}
                                       setMembers={setMembers} />
                </React.Fragment>
            }) : members.map((item, index) => {
                return <React.Fragment key={index}>
                    <TeamTableMemberRow item={item} />
                </React.Fragment>
            })}
        </div>
    </div>
};

export default TeamViewTable;
