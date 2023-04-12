import React, {useEffect, useState} from 'react';
import Loader from "../components/Loader";
import {verifyUser} from "../helpers/users";

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
                        window.location = '/';
                    }
                })
                .catch(() => {
                    window.location = '/';
                });
        }
        else {
            window.location = '/';
        }
    }, []);

    return <div className="container container--register--accountVerification center">
        {loading ? <Loader /> : <main className="homepage">
            <h1 className="homepage__header">
                RowMatcher.com
            </h1>
            <h2 className="register__header register__header--accountVerification">
                Twoje konto zostało pomyślnie zweryfikowane
            </h2>
            <a className="btn btn--afterRegister center" href="/zaloguj-sie">
                Zaloguj się
            </a>
        </main>}
    </div>
};

export default VerificationPage;
