import React, {useState} from 'react';
import Loader from "../components/Loader";
import {isPasswordStrength} from "../helpers/others";
import {changeUserPassword} from "../api/users";
import { errorText } from "../static/content";
import InputPrimary from "../components/InputPrimary";
import ErrorInfo from "../components/ErrorInfo";
import ButtonSubmit from "../components/ButtonSubmit";
import AfterFormSubmitView from "../components/AfterFormSubmitView";
import PageHeader from "../components/PageHeader";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const arePasswordsEqual = () => {
        return password === repeatPassword;
    }

    const validateData = () => {
        if(!arePasswordsEqual()) {
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
                        setError(errorText);
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
            <PageHeader>
                Zmień hasło
            </PageHeader>

            {!success ? <form className="form form--register shadow">
                <InputPrimary label={'Aktualne hasło'}
                              placeholder={'Twoje aktualne hasło'}
                              type={'password'}
                              value={oldPassword}
                              setValue={setOldPassword} />
                <InputPrimary label={'Nowe hasło'}
                              placeholder={'Nowe hasło'}
                              type={'password'}
                              value={password}
                              setValue={setPassword} />
                <InputPrimary label={'Powtórz nowe hasło'}
                              placeholder={'Powtórz nowe hasło'}
                              type={'password'}
                              value={repeatPassword}
                              setValue={setRepeatPassword} />

                <ErrorInfo content={error} />

                {!loading ? <ButtonSubmit onClick={handleSubmit}>
                    Zmień hasło
                </ButtonSubmit>: <Loader width={50} />}

            </form> : <AfterFormSubmitView>
                Twoje hasło zostało zmienione
            </AfterFormSubmitView>}
        </div>
    </div>
};

export default ChangePassword;
