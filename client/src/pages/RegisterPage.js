import React, {useState} from 'react';
import {isEmail, isPasswordStrength} from "../helpers/others";
import {registerUser} from "../helpers/users";
import Loader from "../components/Loader";

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [checkbox, setCheckbox] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(0);

    const validateData = () => {
        if(!isEmail(email)) {
            setError('Podaj poprawny adres e-mail');
            return false;
        }
        if(password !== repeatPassword) {
            setError('Podane hasła nie są identyczne');
            return false;
        }
        if(!isPasswordStrength(password)) {
            setError('Hasło musi mieć co najmniej 8 znaków, zawierać co najmniej jedną wielką literę oraz jedną cyfrę');
            return false;
        }
        if(!checkbox) {
            setError('Akceptuj postanowienia polityki prywatności');
            return false;
        }

        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(validateData()) {
            setLoading(true);

            registerUser(email, password)
                .then((res) => {
                    if(res) {
                        setStatus(1);
                    }
                    else {
                        setError('Coś poszło nie tak... Prosimy spróbować później');
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    if(err?.response?.data?.statusCode === 400) {
                        setError('Użytkownik o podanym adresie e-mail już istnieje');
                    }
                    else {
                        setError('Coś poszło nie tak... Prosimy spróbować później');
                    }
                });
        }
    }

    return <div className="container">
        <div className="homepage w">
            <h1 className="homepage__header">
                RowMatcher.com
            </h1>
            <h2 className="homepage__subheader">
                Załóż konto
            </h2>

            {status === 0 ? <form className="form form--register shadow">
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
                <label className="label">
                    Powtórz hasło
                    <input className="input"
                           type="password"
                           value={repeatPassword}
                           onChange={(e) => { setRepeatPassword(e.target.value); }}
                           placeholder="Powtórz hasło" />
                </label>

                <label className="label label--checkbox">
                    <button className={checkbox ? "btn--check btn--check--selected" : "btn--check"}
                            onClick={(e) => { e.preventDefault(); setCheckbox(p => !p); }}>

                    </button>
                    Wyrażam zgodę na przetwarzanie danych osobowych przez RowMatcher.com
                </label>

                {error ? <span className="error">
                    {error}
                </span> : ''}

                {!loading ? <button className="btn btn--submitForm"
                                   onClick={(e) => { handleSubmit(e); }}>
                    Zarejestruj się
                </button> : <Loader width={50} />}
            </form> : <div className="afterRegister shadow">
                <h4 className="afterRegister__header">
                    Rejestracja przebiegła pomyślnie! Na Twój adres e-mail wysłaliśmy link aktywacyjny.
                    Kliknij w niego i korzystaj z RowMatcher.com!
                </h4>

                <a className="btn btn--afterRegister" href="/">
                    Strona główna
                </a>
            </div>}
        </div>
    </div>

};
export default RegisterPage;
