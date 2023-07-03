import React, {useState} from 'react';
import Loader from "./Loader";
import noIcon from '../static/img/no.svg';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import {errorText} from "../static/content";

const DecisionModal = ({closeModal, closeSideEffectsFunction, submitFunction, submitFunctionParameters, successText,
                           text, confirmBtnText, backBtnText, backBtnLink}) => {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const closeModalWrapper = () => {
        closeSideEffectsFunction();
        closeModal();
    }

    useCloseModalOnOutsideClick(closeModalWrapper);
    useActionOnEscapePress(closeModalWrapper);

    const handleSubmit = () => {
        setLoading(true);

        if(submitFunctionParameters) {
            submitFunction(...submitFunctionParameters)
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
                    setError(errorText);
                });
        }
        else {
            submitFunction()
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
                    setError(errorText);
                });
        }
    }

    return <div className="modal modal--leaveTeam">
        <button className="btn btn--closeModal"
                onClick={closeModalWrapper}>
            &times;
        </button>

        <div className="modal__inner">
            {!success && !error ? <>
                <img className="img img--modalWarning" src={noIcon} alt="ostrzezenie" />

                <p className="modal__header modal__header--text text-center">
                    {text}
                </p>

                {!loading ? <div className="flex flex--twoButtons">
                    <button className="btn btn--leaveTeam"
                            onClick={handleSubmit}>
                        {confirmBtnText}
                    </button>
                    <button className="btn btn--neutral"
                            onClick={closeModalWrapper}>
                        Anuluj
                    </button>
                </div>: <Loader width={50} />}
            </> :  <>
                <h4 className="afterRegister__header afterRegister__header--center">
                    {error ? error : successText}
                </h4>

                <a className="btn btn--afterRegister"
                   href={backBtnLink}>
                    {backBtnText}
                </a>
            </>}
        </div>
    </div>
};

export default DecisionModal;
