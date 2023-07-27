import React, {useContext, useState} from 'react';
import {isEmail, isPasswordStrength} from "../helpers/others";
import {registerUser} from "../api/users";
import Loader from "../components/Loader";
import PageHeader from "../components/PageHeader";
import AfterFormSubmitView from "../components/AfterFormSubmitView";
import ErrorInfo from "../components/ErrorInfo";
import ButtonSubmit from "../components/ButtonSubmit";
import InputPrimary from "../components/InputPrimary";
import {TranslationContext} from "../App";

const RegisterPage = () => {
    const { content } = useContext(TranslationContext);

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
            setError(content.registerEmailError);
            return false;
        }
        if(!arePasswordsEqual()) {
            setError(content.passwordsIdenticalError);
            return false;
        }
        if(!isPasswordStrength(password)) {
            setError(content.passwordWeakError);
            return false;
        }
        if(!checkbox) {
            setError(content.registerCheckboxError);
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
                        setError(content.error);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);

                    if(err?.response?.data?.statusCode === 400) {
                        setError(content.emailAlreadyTakenError);
                    }
                    else {
                        setError(content.error);
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
                {content.createAccount}
            </PageHeader>

            {status === 0 ? <form className="form form--register shadow">
                <InputPrimary label={content.email}
                              placeholder={content.email}
                              type={'email'}
                              value={email}
                              setValue={setEmail} />
                <InputPrimary label={content.password}
                              placeholder={content.password}
                              type={'password'}
                              value={password}
                              setValue={setPassword} />
                <InputPrimary label={content.repeatPassword}
                              placeholder={content.repeatPassword}
                              type={'password'}
                              value={repeatPassword}
                              setValue={setRepeatPassword} />

                <label className="label label--checkbox">
                    <button className={checkbox ? "btn--check btn--check--selected" : "btn--check"}
                            onClick={toggleCheckbox}>

                    </button>
                    {content.registerCheckbox}
                </label>

                <ErrorInfo content={error} />

                {!loading ? <ButtonSubmit onClick={handleSubmit}>
                    {content.register}
                </ButtonSubmit> : <Loader width={50} />}
            </form> : <AfterFormSubmitView>
                {content.registerSuccess}
            </AfterFormSubmitView>}
        </div>
    </div>

};
export default RegisterPage;
