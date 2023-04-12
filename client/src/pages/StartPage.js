import React from 'react';

const StartPage = () => {
    return <div className="container">
        <div className="homepage w">
            <h1 className="homepage__header">
                RowMatcher.com
            </h1>

            <a className="btn btn--login"
               href="/zaloguj-sie">
                Zaloguj się
            </a>

            <p className="noAccountText">
                Nie masz konta?
            </p>

            <a className="btn btn--register"
               href="/zarejestruj-sie">
                Zarejestruj się
            </a>
        </div>
    </div>
};

export default StartPage;
