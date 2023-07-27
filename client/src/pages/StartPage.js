import React, {useContext} from 'react';
import {TranslationContext} from "../App";

const StartPage = () => {
    const { content } = useContext(TranslationContext);

    return <div className="container">
        <div className="homepage w">
            <h1 className="homepage__header">
                RowMatcher.com
            </h1>

            <a className="btn btn--login"
               href="/zaloguj-sie">
                {content.login}
            </a>

            <p className="noAccountText">
                {content.doNotHaveAccount}
            </p>

            <a className="btn btn--register"
               href="/zarejestruj-sie">
                {content.register}
            </a>
        </div>
    </div>
};

export default StartPage;
