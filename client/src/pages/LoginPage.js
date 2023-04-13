import React, {useState} from 'react';
import Loader from "../components/Loader";
import {loginUser} from "../helpers/users";
import Cookies from "universal-cookie";

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
                        const cookies = new Cookies();
                        cookies.set('access_token', jwt, { path: '/' });
                        cookies.set('email_rowmatcher', email.toString().split('@')[0], { path: '/' });
                        cookies.set('email_rowmatcher_domain', email.toString().split('@')[1], { path: '/' });
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

    return <div className="container">
        <div className="homepage w">
            <h1 className="homepage__header">
                RowMatcher.com
            </h1>

            <h2 className="homepage__subheader">
                Zaloguj się
            </h2>

            <form className="form form--register shadow">
                <label className="label">
                    Adres e-mail
                    <input className="input"
                           value={email}
                           onChange={(e) => { setEmail(e.target.value); }}
                           placeholder="E-mail" />
                </label>
                <label className="label">
                    Hasło
                    <input className="input"
                           type="password"
                           value={password}
                           onChange={(e) => { setPassword(e.target.value); }}
                           placeholder="Hasło" />
                </label>

                {error ? <span className="error">
                    {error}
                </span> : ''}

                {!loading ? <button className="btn btn--submitForm"
                                    onClick={(e) => { handleSubmit(e); }}>
                    Zaloguj się
                </button> : <Loader width={50} />}
            </form>
        </div>
    </div>
};

export default LoginPage;
