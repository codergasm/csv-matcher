import React, {useEffect, useState} from 'react';
import {getSchemasByUser} from "../helpers/schemas";
import MySchemasTable from "../components/MySchemasTable";

const SchemasPage = ({user}) => {
    const [userSchemas, setUserSchemas] = useState([])
    const [teamSchemas, setTeamSchemas] = useState([]);
    const [updateSchemas, setUpdateSchemas] = useState(false);

    useEffect(() => {
        getSchemasByUser()
            .then((res) => {
                if(res?.data) {
                    setUserSchemas(res.data.filter((item) => (item.owner_user_id)));
                    setTeamSchemas(res.data.filter((item) => (item.owner_team_id)));
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
                            teamId={user.teamId}
                            setUpdateSchemas={setUpdateSchemas} />

            <h2 className="homepage__subheader homepage__subheader--marginTop">
                Schematu dopasowania zespołu
            </h2>


        </div>
    </div>
};

export default SchemasPage;
