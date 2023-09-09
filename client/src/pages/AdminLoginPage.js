import React, {useContext, useEffect, useState} from 'react';
import {TranslationContext} from "../App";
import Cookies from "universal-cookie";
import {SESSION_TIME} from "../static/constans";
import PageHeader from "../components/PageHeader";
import InputPrimary from "../components/InputPrimary";
import ErrorInfo from "../components/ErrorInfo";
import ButtonSubmit from "../components/ButtonSubmit";
import Loader from "../components/Loader";
import {authAdmin, loginAdmin} from "../api/admin";

const AdminLoginPage = () => {
    const { content } = useContext(TranslationContext);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        authAdmin()
            .then((res) => {
                if(res?.status === 201) {
                    window.location = '/transakcje';
                }
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(login && password) {
            setLoading(true);

            loginAdmin(login, password)
                .then((res) => {
                    const jwt = res?.data?.access_token;
                    if(jwt) {
                        setAdminCookies(jwt);
                        window.location = '/transakcje';
                    }
                    else {
                        setError(content.loginError);
                    }

                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setError(content.loginError);
                });
        }
    }

    const setAdminCookies = (jwt) => {
        const cookies = new Cookies();
        cookies.set('access_token', jwt, { path: '/', maxAge: SESSION_TIME });
        cookies.set('rowmatcher_admin', login, { path: '/', maxAge: SESSION_TIME });
    }

    return <div className="container">
        <div className="homepage w">
            <PageHeader>
                {content.adminPanel}
            </PageHeader>

            <form className="form form--register shadow">
                <InputPrimary label={content.username}
                              placeholder={content.username}
                              value={login}
                              type={'text'}
                              setValue={setLogin} />
                <InputPrimary label={content.password}
                              placeholder={content.password}
                              type={'password'}
                              value={password}
                              setValue={setPassword} />

                <ErrorInfo content={error} />

                {!loading ? <ButtonSubmit onClick={handleSubmit}>
                    {content.login}
                </ButtonSubmit> : <Loader width={50} />}
            </form>
        </div>
    </div>
};

export default AdminLoginPage;
