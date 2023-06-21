import React, {useEffect, useState} from 'react';
import Loader from "../components/Loader";
import {verifyUser} from "../api/users";
import redirectToHomepage from "../helpers/redirectToHomepage";
import VerificationPageContent from "../components/VerificationPageContent";

const VerificationPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if(token) {
            verifyUser(token)
                .then((res) => {
                    if(res?.status === 201) {
                        setLoading(false);
                    }
                    else {
                        redirectToHomepage();
                    }
                })
                .catch(() => {
                    redirectToHomepage();
                });
        }
        else {
            redirectToHomepage();
        }
    }, []);

    return <div className="container container--register--accountVerification center">
        {loading ? <Loader /> : <VerificationPageContent />}
    </div>
};

export default VerificationPage;
