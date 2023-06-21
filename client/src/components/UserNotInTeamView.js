import React, {useEffect, useState} from 'react';
import createTeamIcon from '../static/img/people.svg';
import joinTeamIcon from '../static/img/request.svg';
import CreateNewTeamModal from "./CreateNewTeamModal";
import JoinTeamModal from "./JoinTeamModal";
import ButtonTile from "./ButtonTile";

const UserNotInTeamView = () => {
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
                Nie należysz do żadnego zespołu
            </h2>

            <div className="userNotInTeamChoice flex">
                <ButtonTile onClick={showCreateNewTeamModal}
                            icon={createTeamIcon}>
                    Stwórz nowy zespół
                </ButtonTile>
                <ButtonTile onClick={showJoinTeamModal}
                            icon={joinTeamIcon}>
                    Dołącz do zespołu
                </ButtonTile>
            </div>
        </div>
    </div>
};

export default UserNotInTeamView;
