import React, {useEffect, useState} from 'react';
import {getFilesByUser, saveSheet} from "../helpers/files";
import MyFilesTable from "../components/MyFilesTable";
import TeamFilesTable from "../components/TeamFilesTable";
import FileSavedModal from "../components/FileSavedModal";

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
                    setSaveError('Coś poszło nie tak... Prosimy spróbować później');
                }
            })
            .catch(() => {
                setSaveError('Coś poszło nie tak... Prosimy spróbować później');
            });
    }

    return <div className="container">
        {fileSavedModalVisible ? <FileSavedModal closeModal={() => { setFileSavedModalVisible(false); }} /> : ''}

        <div className="homepage">
            <h1 className="homepage__header">
                RowMatcher.com
            </h1>
            <h2 className="homepage__subheader">
                Twoje pliki
            </h2>

            <MyFilesTable files={userFiles}
                          setUpdateFiles={setUpdateFiles} />

            <h2 className="homepage__subheader homepage__subheader--marginTop">
                Pliki zespołu
            </h2>

            <TeamFilesTable files={teamFiles}
                            canUpdate={user.can_edit_team_files}
                            canDelete={user.can_delete_team_files}
                            setUpdateFiles={setUpdateFiles} />

            <div className="btn btn--addNewFile">
                <input className="input--addNewFile"
                       type="file"
                       onChange={(e) => { addNewFileWrapper(e); }} />
                Dodaj nowy plik
            </div>
        </div>
    </div>
};

export default FilesPage;
