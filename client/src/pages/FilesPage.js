import React, {useContext, useEffect, useState} from 'react';
import {getFilesByUser} from "../api/files";
import MyFilesTable from "../components/MyFilesTable";
import TeamFilesTable from "../components/TeamFilesTable";
import FileSavedModal from "../components/FileSavedModal";
import PageHeader from "../components/PageHeader";
import FileUploader from "../components/FileUploader";
import {UserContext} from "../components/LoggedUserWrapper";

const FilesPage = () => {
    const { user } = useContext(UserContext);

    const [userFiles, setUserFiles] = useState([]);
    const [teamFiles, setTeamFiles] = useState([]);
    const [updateFiles, setUpdateFiles] = useState(false);
    const [fileSavedModalVisible, setFileSavedModalVisible] = useState(false);

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

            <FileUploader setUpdateFiles={setUpdateFiles}
                          user={user} />

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
        </div>
    </div>
};

export default FilesPage;
