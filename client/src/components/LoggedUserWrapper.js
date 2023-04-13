import React, {useEffect, useState} from 'react';
import {authUser, getUserData} from "../helpers/users";
import Homepage from "../pages/Homepage";
import CorrelationPage from "../pages/CorrelationPage";
import Loader from "./Loader";
import LoggedUserHeader from "./LoggedUserHeader";
import ChangePassword from "../pages/ChangePassword";
import TeamPage from "../pages/TeamPage";
import LoadingPage from "../pages/LoadingPage";

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
                                    if(res?.data) {
                                        let data = res.data;
                                        setUser({
                                            id: data.id,
                                            teamId: data.team_id,
                                            email: data.email
                                        });
                                    }

                                    switch(page) {
                                        case 1:
                                            setRender(<Homepage />);
                                            break;
                                        case 4:
                                            setRender(<CorrelationPage />);
                                            break;
                                        case 5:
                                            setRender(<TeamPage user={user} />);
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
