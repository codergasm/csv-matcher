import React, {useEffect, useState} from 'react';
import createTeamIcon from '../static/img/people.svg';
import joinTeamIcon from '../static/img/request.svg';
import CreateNewTeamModal from "./CreateNewTeamModal";
import JoinTeamModal from "./JoinTeamModal";

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
                <button className="homepage__menu__item shadow" onClick={() => { setCreateNewTeamModalVisible(true); }}>
                    <img className="img" src={createTeamIcon} alt="moje-pliki" />

                    <span>
                        Stwórz nowy zespół
                    </span>
                </button>
                <button className="homepage__menu__item shadow" onClick={() => { setJoinTeamModalVisible(true); }}>
                    <img className="img" src={joinTeamIcon} alt="moje-pliki" />

                    <span>
                        Dołącz do zespołu
                    </span>
                </button>
            </div>
        </div>
    </div>
};

export default UserNotInTeamView;
