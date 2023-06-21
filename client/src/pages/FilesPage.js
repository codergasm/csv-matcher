import React, {useEffect, useState} from 'react';
import {getFilesByUser, saveSheet} from "../api/files";
import MyFilesTable from "../components/MyFilesTable";
import TeamFilesTable from "../components/TeamFilesTable";
import FileSavedModal from "../components/FileSavedModal";
import addIcon from '../static/img/add.svg';
import {errorText} from "../static/content";
import PageHeader from "../components/PageHeader";
import ErrorInfo from "../components/ErrorInfo";

const FilesPage = ({user}) => {
    const [userFiles, setUserFiles] = useState([]);
    const [teamFiles, setTeamFiles] = useState([]);
    const [updateFiles, setUpdateFiles] = useState(false);
    const [fileSavedModalVisible, setFileSavedModalVisible] = useState(false);
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        getFilesByUser()
            .then((res) => {
               if(res?.data) {
                   const allFiles = res.data;

                   setUserFiles(allFiles.filter((item) => (item.owner_user_id)));
                   setTeamFiles(allFiles.filter((item) => (item.owner_team_id)));
               }
            });
    }, [updateFiles]);

    const addNewFileWrapper = (e) => {
        saveSheet(e.target.files[0], user.teamId, false)
            .then((res) => {
                if(res?.status === 201) {
                    setFileSavedModalVisible(true);
                }
                else {
                    setSaveError(errorText);
                }
            })
            .catch(() => {
                setSaveError(errorText);
            });
    }

    const closeFileSavedModal = () => {
        setUpdateFiles(p => !p);
        setFileSavedModalVisible(false);
    }

    return <div className="container">
        {fileSavedModalVisible ? <FileSavedModal closeModal={closeFileSavedModal} /> : ''}

        <div className="homepage homepage--files">
            <PageHeader>
                Twoje pliki
            </PageHeader>

            <div className="btn btn--addNewFile">
                <input className="input--addNewFile"
                       type="file"
                       onChange={addNewFileWrapper} />
                Dodaj nowy plik
                <img className="img--add" src={addIcon} alt="dodaj" />
            </div>

            <MyFilesTable files={userFiles}
                          teamId={user.teamId}
                          setUpdateFiles={setUpdateFiles} />

            <h2 className="homepage__subheader homepage__subheader--marginTop">
                Pliki zespołu
            </h2>

            <TeamFilesTable files={teamFiles}
                            teamId={user.teamId}
                            canUpdate={user.canEditTeamFiles}
                            canDelete={user.canDeleteTeamFiles}
                            setUpdateFiles={setUpdateFiles} />

            <ErrorInfo content={saveError} />
        </div>
    </div>
};

export default FilesPage;
