import React from 'react';

const VerificationPageContent = () => {
    return <main className="homepage">
        <h1 className="homepage__header">
            RowMatcher.com
        </h1>
        <h2 className="register__header register__header--accountVerification">
            Twoje konto zostało pomyślnie zweryfikowane
        </h2>
        <a className="btn btn--afterRegister center" href="/zaloguj-sie">
            Zaloguj się
        </a>
    </main>
};

export default VerificationPageContent;
