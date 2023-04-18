import React, {useEffect, useState} from 'react';
import {authUser, getUserData} from "../helpers/users";
import Homepage from "../pages/Homepage";
import CorrelationPage from "../pages/CorrelationPage";
import LoggedUserHeader from "./LoggedUserHeader";
import ChangePassword from "../pages/ChangePassword";
import TeamPage from "../pages/TeamPage";
import LoadingPage from "../pages/LoadingPage";
import FilesPage from "../pages/FilesPage";
import SchemasPage from "../pages/SchemasPage";

const LoggedUserWrapper = ({page}) => {
    const [render, setRender] = useState(null);
    const [user, setUser] = useState({});

    useEffect(() => {
        if(page) {
            authUser()
                .then((res) => {
                    if(res?.status === 201) {
                        getUserData()
                            .then((res) => {
                                if(res?.status === 200) {
                                    let userTmp = {};

                                    if(res?.data) {
                                        let data = res.data;
                                        userTmp = {
                                            id: data.id,
                                            teamId: data.team_id,
                                            email: data.email,
                                            canEditTeamFiles: data.can_edit_team_files,
                                            canDeleteTeamFiles: data.can_delete_team_files,
                                            canEditTeamMatchSchemas: data.can_edit_team_match_schemas,
                                            canDeleteTeamMatchSchemas: data.can_delete_team_match_schemas
                                        }
                                    }

                                    setUser(userTmp);

                                    switch(page) {
                                        case 1:
                                            setRender(<Homepage />);
                                            break;
                                        case 2:
                                            setRender(<FilesPage user={userTmp} />);
                                            break;
                                        case 3:
                                            setRender(<SchemasPage user={userTmp} />);
                                            break;
                                        case 4:
                                            setRender(<CorrelationPage user={userTmp} />);
                                            break;
                                        case 5:
                                            setRender(<TeamPage user={userTmp} />);
                                            break;
                                        case 6:
                                            setRender(<ChangePassword />);
                                            break;
                                        default:
                                            window.location = '/';
                                    }
                                }
                                else {
                                    window.location = '/';
                                }
                            })
                            .catch((err) => {
                                window.location = '/';
                            });
                    }
                    else {
                        window.location = '/';
                    }
                })
                .catch((err) => {
                    window.location = '/';
                });
        }
    }, [page]);

    return render ? <>
        <LoggedUserHeader user={user} />
        {render}
    </> : <LoadingPage />
};

export default LoggedUserWrapper;
