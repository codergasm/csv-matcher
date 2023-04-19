import React, {useEffect, useState} from 'react';
import {getSchemasByUser} from "../helpers/schemas";
import MySchemasTable from "../components/MySchemasTable";
import {groupBy} from "../helpers/others";
import {getFilesByUser} from "../helpers/files";

const SchemasPage = ({user}) => {
    const [userSchemas, setUserSchemas] = useState([])
    const [teamSchemas, setTeamSchemas] = useState([]);
    const [userFiles, setUserFiles] = useState([]);
    const [teamFiles, setTeamFiles] = useState([]);
    const [updateSchemas, setUpdateSchemas] = useState(false);

    useEffect(() => {
        getSchemasByUser()
            .then((res) => {
                if(res?.data) {
                    const allSchemas = res.data;

                    setUserSchemas(groupBy(allSchemas.filter((item) => (item.schemas_owner_user_id)), 'schemas_id'));
                    setTeamSchemas(groupBy(allSchemas.filter((item) => (item.schemas_owner_team_id)), 'schemas_id'));
                }
            });

        getFilesByUser()
            .then((res) => {
                if(res?.data) {
                    const allFiles = res.data;

                    setUserFiles(allFiles.filter((item) => (item.owner_user_id)));
                    setTeamFiles(allFiles.filter((item) => (item.owner_team_id)));
                }
            })
    }, [updateSchemas]);

    return <div className="container">
        <div className="homepage homepage--files">
            <h1 className="homepage__header">
                RowMatcher.com
            </h1>
            <h2 className="homepage__subheader">
                Twoje schematy dopasowania
            </h2>

            <MySchemasTable schemas={userSchemas}
                            files={userFiles}
                            allFiles={userFiles.concat(teamFiles)}
                            teamId={user.teamId}
                            setUpdateSchemas={setUpdateSchemas} />

            <h2 className="homepage__subheader homepage__subheader--marginTop">
                Schematy dopasowania zespołu
            </h2>


        </div>
    </div>
};

export default SchemasPage;
