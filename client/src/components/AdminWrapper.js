import React, {useEffect, useState} from 'react';
import redirectToHomepage from "../helpers/redirectToHomepage";
import LoadingPage from "../pages/LoadingPage";
import {authAdmin} from "../api/admin";
import AdminTransactionsPage from "../pages/AdminTransactionsPage";
import LoggedAdminHeader from "./LoggedAdminHeader";

const AdminWrapper = ({page}) => {
    const [render, setRender] = useState(null);

    useEffect(() => {
        if(page) {
            authAdmin()
                .then((res) => {
                    if(res?.data) {
                        selectPage();
                    }
                    else {
                        redirectToAdminLogin();
                    }
                })
                .catch((err) => {
                    redirectToAdminLogin();
                });
        }
    }, [page]);

    const redirectToAdminLogin = () => {
        window.location = '/admin';
    }

    const selectPage = () => {
        switch(page) {
            case 1:
                setRender(<AdminTransactionsPage />);
                break;
            default:
                redirectToHomepage();
        }
    }

    return render ? <>
        <LoggedAdminHeader />
        {render}
    </> : <LoadingPage />
};

export default AdminWrapper;
