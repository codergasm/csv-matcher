import React, {useState} from 'react';
import createTeamIcon from '../static/img/people.svg';
import joinTeamIcon from '../static/img/request.svg';

const UserNotInTeamView = () => {
    const [createNewTeamModalVisible, setCreateNewTeamModalVisible] = useState(false);
    const [joinTeamModalVisible, setJoinTeamModalVisible] = useState(false);
    const [teamId, setTeamId] = useState('');

    const joinTeam = () => {
        if(teamId) {

        }
    }

    return <div className="container">
        <div className="homepage">
            <h1 className="homepage__header">
                RowMatcher.com
            </h1>
            <h2 className="homepage__subheader homepage__subheader--notInTeam">
                Nie należysz do żadnego zespołu
            </h2>

            {/*<input className="input input--teamId shadow"*/}
            {/*       value={teamId}*/}
            {/*       onChange={(e) => { setTeamId(e.target.value); }}*/}
            {/*       placeholder="id zespołu" />*/}
            {/*<button className="btn btn--joinTeam"*/}
            {/*        onClick={() => { joinTeam(); }}>*/}
            {/*    Dołącz*/}
            {/*</button>*/}

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
