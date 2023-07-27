import React, {useContext, useState} from 'react';
import Loader from "../components/Loader";
import {loginUser} from "../api/users";
import Cookies from "universal-cookie";
import InputPrimary from "../components/InputPrimary";
import ErrorInfo from "../components/ErrorInfo";
import ButtonSubmit from "../components/ButtonSubmit";
import PageHeader from "../components/PageHeader";
import {SESSION_TIME} from "../static/constans";
import {TranslationContext} from "../App";

const LoginPage = () => {
    const { content } = useContext(TranslationContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(email && password) {
            setLoading(true);

            loginUser(email, password)
                .then((res) => {
                    const jwt = res?.data?.access_token;
                    if(jwt) {
                        setUserCookies(jwt);
                        window.location = '/home';
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

    const setUserCookies = (jwt) => {
        const cookies = new Cookies();
        cookies.set('access_token', jwt, { path: '/', maxAge: SESSION_TIME });
        cookies.set('email_rowmatcher', email.toString().split('@')[0], { path: '/', maxAge: SESSION_TIME });
        cookies.set('email_rowmatcher_domain', email.toString().split('@')[1], { path: '/', maxAge: SESSION_TIME });
    }

    return <div className="container">
        <div className="homepage w">
            <PageHeader>
                {content.login}
            </PageHeader>

            <form className="form form--register shadow">
                <InputPrimary label={content.email}
                              placeholder={content.email}
                              value={email}
                              type={'email'}
                              setValue={setEmail} />
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

export default LoginPage;
