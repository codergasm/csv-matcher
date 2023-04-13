import React, {useEffect, useState} from 'react';
import Loader from "./Loader";
import StartPage from "../pages/StartPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerificationPage from "../pages/VerificationPage";
import {authUser, getUserData} from "../helpers/users";
import Homepage from "../pages/Homepage";
import CorrelationPage from "../pages/CorrelationPage";
import ChangePassword from "../pages/ChangePassword";
import LoadingPage from "../pages/LoadingPage";

const PublicRoutesWrapper = ({page}) => {
    const [render, setRender] = useState(null);

    const selectPage = () => {
        switch(page) {
            case 1:
                setRender(<Homepage />);
                break;
            case 4:
                setRender(<CorrelationPage />);
                break;
            case 6:
                setRender(<ChangePassword />);
                break;
            default:
                window.location = '/';
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
