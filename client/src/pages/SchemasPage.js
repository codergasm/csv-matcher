import React, {useContext, useEffect, useState} from 'react';
import {getSchemasByUser} from "../api/schemas";
import MySchemasTable from "../components/MySchemasTable";
import {groupBy} from "../helpers/others";
import {getFilesByUser} from "../api/files";
import TeamSchemasTable from "../components/TeamSchemasTable";
import PageHeader from "../components/PageHeader";
import {TranslationContext} from "../App";

const SchemasPage = ({user}) => {
    const { content } = useContext(TranslationContext);

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
            <PageHeader>
                {content.yourSchemas}
            </PageHeader>

            <MySchemasTable schemas={userSchemas}
                            files={userFiles}
                            user={user}
                            allFiles={userFiles.concat(teamFiles)}
                            teamId={user.teamId}
                            setUpdateSchemas={setUpdateSchemas} />

            <h2 className="homepage__subheader homepage__subheader--marginTop">
                {content.teamSchemas}
            </h2>

            <TeamSchemasTable schemas={teamSchemas}
                              user={user}
                              teamId={user.teamId}
                              setUpdateSchemas={setUpdateSchemas}
                              allFiles={userFiles.concat(teamFiles)}
                              canEdit={user.canEditTeamMatchSchemas}
                              canDelete={user.canDeleteTeamMatchSchemas} />
        </div>
    </div>
};

export default SchemasPage;
