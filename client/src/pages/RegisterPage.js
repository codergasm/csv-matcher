import React, {useState} from 'react';
import {isEmail, isPasswordStrength} from "../helpers/others";
import {registerUser} from "../api/users";
import Loader from "../components/Loader";
import {errorText} from "../static/content";
import PageHeader from "../components/PageHeader";
import AfterFormSubmitView from "../components/AfterFormSubmitView";
import ErrorInfo from "../components/ErrorInfo";
import ButtonSubmit from "../components/ButtonSubmit";
import InputPrimary from "../components/InputPrimary";

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [checkbox, setCheckbox] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(0);

    const arePasswordsEqual = () => {
        return password === repeatPassword;
    }

    const validateData = () => {
        if(!isEmail(email)) {
            setError('Podaj poprawny adres e-mail');
            return false;
        }
        if(!arePasswordsEqual()) {
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
                        setError(errorText);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);

                    if(err?.response?.data?.statusCode === 400) {
                        setError('Użytkownik o podanym adresie e-mail już istnieje');
                    }
                    else {
                        setError(errorText);
                    }
                });
        }
    }

    const toggleCheckbox = (e) => {
        e.preventDefault();
        setCheckbox(p => !p);
    }

    return <div className="container">
        <div className="homepage w">
            <PageHeader>
                Załóż konto
            </PageHeader>

            {status === 0 ? <form className="form form--register shadow">
                <InputPrimary label={'Adres e-mail'}
                              placeholder={'E-mail'}
                              type={'email'}
                              value={email}
                              setValue={setEmail} />
                <InputPrimary label={'Hasło'}
                              placeholder={'Hasło'}
                              type={'password'}
                              value={password}
                              setValue={setPassword} />
                <InputPrimary label={'Powtórz hasło'}
                              placeholder={'Powtórz hasło'}
                              type={'password'}
                              value={repeatPassword}
                              setValue={setRepeatPassword} />

                <label className="label label--checkbox">
                    <button className={checkbox ? "btn--check btn--check--selected" : "btn--check"}
                            onClick={toggleCheckbox}>

                    </button>
                    Wyrażam zgodę na przetwarzanie danych osobowych przez RowMatcher.com
                </label>

                <ErrorInfo content={error} />

                {!loading ? <ButtonSubmit onClick={handleSubmit}>
                    Zarejestruj się
                </ButtonSubmit> : <Loader width={50} />}
            </form> : <AfterFormSubmitView>
                Rejestracja przebiegła pomyślnie! Na Twój adres e-mail wysłaliśmy link aktywacyjny.
                Kliknij w niego i korzystaj z RowMatcher.com!
            </AfterFormSubmitView>}
        </div>
    </div>

};
export default RegisterPage;
