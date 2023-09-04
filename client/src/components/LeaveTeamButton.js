import React, {useContext, useState} from 'react';
import {Tooltip} from "react-tippy";
import {TranslationContext} from "../App";
import {checkIfUserCanLeaveTeam} from "../api/users";
import PermissionAlertModal from "./PermissionAlertModal";

const LeaveTeamButton = ({isOwner, isTeamEmpty,
                             setDeleteTeamModalVisible, setLeaveTeamModalVisible}) => {
    const { content } = useContext(TranslationContext);

    const [limitsExceededModalContent, setLimitsExceededModalContent] = useState('');

    const leaveTeamWrapper = () => {
        checkIfUserCanLeaveTeam()
            .then((res) => {
               if(res?.data?.error) {
                   setLimitsExceededModalContent(content.userLimitExceededWhileLeaving[res.data.error]);
               }
               else {
                   setLeaveTeamModalVisible(true);
               }
            })
            .catch(() => {
                setLeaveTeamModalVisible(true);
            });
    }

    const deleteTeamWrapper = () => {
        checkIfUserCanLeaveTeam()
            .then((res) => {
                if(res?.data?.error) {
                    setLimitsExceededModalContent(content.userLimitExceededWhileLeaving[res.data.error]);
                }
                else {
                    setDeleteTeamModalVisible(true);
                }
            })
            .catch(() => {
                setDeleteTeamModalVisible(true);
            });
    }

    if(!isOwner) {
        return <>
            {limitsExceededModalContent ? <PermissionAlertModal closeModal={() => { setLimitsExceededModalContent(''); }}
                                                                content={limitsExceededModalContent} /> : ''}

            <button className="btn btn--leaveTeam"
                    onClick={leaveTeamWrapper}>
                {content.leaveTeam}
            </button>
        </>
    }
    else if(isOwner && isTeamEmpty) {
        return <>
            {limitsExceededModalContent ? <PermissionAlertModal closeModal={() => { setLimitsExceededModalContent(''); }}
                                                                content={limitsExceededModalContent} /> : ''}

            <button className="btn btn--leaveTeam"
                    onClick={deleteTeamWrapper}>
                {content.deleteTeam}
            </button>
        </>
    }
    else {
        return <Tooltip title={content.youCanNotLeaveTeam}
                        followCursor={true}
                        size="small"
                        position="top">
            <button className="btn btn--leaveTeam"
                    disabled={true}
                    onClick={leaveTeamWrapper}>
                {content.leaveTeam}
            </button>
        </Tooltip>
    }
};

export default LeaveTeamButton;
