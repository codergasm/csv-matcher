import React, {useContext, useEffect, useState} from 'react';
import createTeamIcon from '../static/img/people.svg';
import joinTeamIcon from '../static/img/request.svg';
import CreateNewTeamModal from "./CreateNewTeamModal";
import JoinTeamModal from "./JoinTeamModal";
import ButtonTile from "./ButtonTile";
import {TranslationContext} from "../App";

const UserNotInTeamView = () => {
    const { content } = useContext(TranslationContext);

    const [createNewTeamModalVisible, setCreateNewTeamModalVisible] = useState(false);
    const [joinTeamModalVisible, setJoinTeamModalVisible] = useState(false);

    useEffect(() => {
        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                setCreateNewTeamModalVisible(false);
                setJoinTeamModalVisible(false);
            }
        });
    }, []);

    const showCreateNewTeamModal = () => {
        setCreateNewTeamModalVisible(true);
    }

    const showJoinTeamModal = () => {
        setJoinTeamModalVisible(true);
    }

    return <div className="container">
        {createNewTeamModalVisible ? <CreateNewTeamModal closeModal={() => { setCreateNewTeamModalVisible(false); }} /> : ''}
        {joinTeamModalVisible ? <JoinTeamModal closeModal={() => { setJoinTeamModalVisible(false); }} /> : ''}

        <div className="homepage">
            <h1 className="homepage__header">
                RowMatcher.com
            </h1>
            <h2 className="homepage__subheader homepage__subheader--notInTeam">
                {content.notInTeamHeader}
            </h2>

            <div className="userNotInTeamChoice flex">
                <ButtonTile onClick={showCreateNewTeamModal}
                            icon={createTeamIcon}>
                    {content.createNewTeam}
                </ButtonTile>
                <ButtonTile onClick={showJoinTeamModal}
                            icon={joinTeamIcon}>
                    {content.joinTeam}
                </ButtonTile>
            </div>
        </div>
    </div>
};

export default UserNotInTeamView;
