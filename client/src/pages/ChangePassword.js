import React, {useContext, useState} from 'react';
import Loader from "../components/Loader";
import {isPasswordStrength} from "../helpers/others";
import {changeUserPassword} from "../api/users";
import InputPrimary from "../components/InputPrimary";
import ErrorInfo from "../components/ErrorInfo";
import ButtonSubmit from "../components/ButtonSubmit";
import AfterFormSubmitView from "../components/AfterFormSubmitView";
import PageHeader from "../components/PageHeader";
import {TranslationContext} from "../App";

const ChangePassword = () => {
    const { content } = useContext(TranslationContext);

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
            setError(content.passwordsIdenticalError);
            return false;
        }
        if(!isPasswordStrength(password)) {
            setError(content.passwordWeakError);
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
                        setError(content.error);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setError(content.oldPasswordIncorrectError);
                });
        }
    }

    return <div className="container">
        <div className="homepage">
            <PageHeader>
                {content.changePassword}
            </PageHeader>

            {!success ? <form className="form form--register shadow">
                <InputPrimary label={content.currentPassword}
                              placeholder={content.currentPassword}
                              type={'password'}
                              value={oldPassword}
                              setValue={setOldPassword} />
                <InputPrimary label={content.newPassword}
                              placeholder={content.newPassword}
                              type={'password'}
                              value={password}
                              setValue={setPassword} />
                <InputPrimary label={content.repeatNewPassword}
                              placeholder={content.repeatNewPassword}
                              type={'password'}
                              value={repeatPassword}
                              setValue={setRepeatPassword} />

                <ErrorInfo content={error} />

                {!loading ? <ButtonSubmit onClick={handleSubmit}>
                    {content.changePassword}
                </ButtonSubmit>: <Loader width={50} />}

            </form> : <AfterFormSubmitView>
                {content.passwordChanged}
            </AfterFormSubmitView>}
        </div>
    </div>
};

export default ChangePassword;
