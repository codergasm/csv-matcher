import React, {useEffect, useState} from 'react';
import StartPage from "../pages/StartPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerificationPage from "../pages/VerificationPage";
import {authUser} from "../api/users";
import LoadingPage from "../pages/LoadingPage";
import redirectToHomepage from "../helpers/redirectToHomepage";

const PublicRoutesWrapper = ({page}) => {
    const [render, setRender] = useState(null);

    const selectPage = () => {
        switch(page) {
            case 1:
                setRender(<StartPage />);
                break;
            case 2:
                setRender(<LoginPage />);
                break;
            case 3:
                setRender(<RegisterPage />);
                break;
            case 4:
                setRender(<VerificationPage />);
                break;
            default:
                redirectToHomepage();
        }
    }

    useEffect(() => {
        if(page) {
            authUser()
                .then((res) => {
                    if(res?.status === 201) {
                        window.location = '/home';
                    }
                    else {
                        selectPage();
                    }
                })
                .catch(() => {
                    selectPage();
                });
        }
    }, [page]);

    return render ? render : <LoadingPage />
};

export default PublicRoutesWrapper;
