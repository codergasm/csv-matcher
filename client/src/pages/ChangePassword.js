import React, {useState} from 'react';
import Loader from "../components/Loader";
import {isPasswordStrength} from "../helpers/others";
import {changeUserPassword} from "../helpers/users";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateData = () => {
        if(password !== repeatPassword) {
            setError('Podane hasła nie są identyczne');
            return false;
        }
        if(!isPasswordStrength(password)) {
            setError('Hasło musi mieć co najmniej 8 znaków, zawierać co najmniej jedną wielką literę oraz jedną cyfrę');
            return false;
        }

        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(validateData()) {
            setLoading(true);

            changeUserPassword(oldPassword, password)
                .then((res) => {
                    if(res?.status === 200) {
                        setSuccess(true);
                    }
                    else {
                        setError('Coś poszło nie tak... Prosimy spróbować później');
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setError('Niepoprawne stare hasło');
                });
        }
    }

    return <div className="container">
        <div className="homepage">
            <h1 className="homepage__header">
                RowMatcher.com
            </h1>
            <h2 className="homepage__subheader">
                Zmień hasło
            </h2>

            {!success ? <form className="form form--register shadow">
                <label className="label">
                    Aktualne hasło
                    <input className="input"
                           type="password"
                           value={oldPassword}
                           onChange={(e) => { setOldPassword(e.target.value); }}
                           placeholder="Twoje aktualne hasło" />
                </label>
                <label className="label">
                    Nowe hasło
                    <input className="input"
                           type="password"
                           value={password}
                           onChange={(e) => { setPassword(e.target.value); }}
                           placeholder="Nowe hasło" />
                </label>
                <label className="label">
                    Powtórz nowe hasło
                    <input className="input"
                           type="password"
                           value={repeatPassword}
                           onChange={(e) => { setRepeatPassword(e.target.value); }}
                           placeholder="Powtórz nowe hasło" />
                </label>

                {error ? <span className="error">
                    {error}
                </span> : ''}

                {!loading ? <button className="btn btn--submitForm"
                                    onClick={(e) => { handleSubmit(e); }}>
                    Zmień hasło
                </button> : <Loader width={50} />}
            </form> : <div className="afterRegister shadow">
                <h4 className="afterRegister__header">
                    Twoje hasło zostało zmienione
                </h4>

                <a className="btn btn--afterRegister" href="/home">
                    Strona główna
                </a>
            </div>}
        </div>
    </div>
};

export default ChangePassword;
