import React, {useState} from 'react';
import Loader from "../components/Loader";
import {loginUser} from "../api/users";
import Cookies from "universal-cookie";
import InputPrimary from "../components/InputPrimary";
import ErrorInfo from "../components/ErrorInfo";
import ButtonSubmit from "../components/ButtonSubmit";
import PageHeader from "../components/PageHeader";

const LoginPage = () => {
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
                        setError('Niepoprawny adres e-mail lub hasło');
                    }

                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setError('Niepoprawny adres e-mail lub hasło');
                });
        }
    }

    const setUserCookies = (jwt) => {
        const cookies = new Cookies();
        cookies.set('access_token', jwt, { path: '/' });
        cookies.set('email_rowmatcher', email.toString().split('@')[0], { path: '/' });
        cookies.set('email_rowmatcher_domain', email.toString().split('@')[1], { path: '/' });
    }

    return <div className="container">
        <div className="homepage w">
            <PageHeader>
                Zaloguj się
            </PageHeader>

            <form className="form form--register shadow">
                <InputPrimary label={'Adres e-mail'}
                              placeholder={'E-mail'}
                              value={email}
                              setValue={setEmail} />
                <InputPrimary label={'Hasło'}
                              placeholder={'Hasło'}
                              type={'password'}
                              value={password}
                              setValue={setPassword} />

                <ErrorInfo content={error} />

                {!loading ? <ButtonSubmit onClick={handleSubmit}>
                    Zaloguj się
                </ButtonSubmit> : <Loader width={50} />}
            </form>
        </div>
    </div>
};

export default LoginPage;
