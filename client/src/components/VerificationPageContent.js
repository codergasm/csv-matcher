import React, {useContext} from 'react';
import {TranslationContext} from "../App";

const VerificationPageContent = () => {
    const { content } = useContext(TranslationContext);

    return <main className="homepage">
        <h1 className="homepage__header">
            RowMatcher.com
        </h1>
        <h2 className="register__header register__header--accountVerification">
            {content.accountVerified}
        </h2>
        <a className="btn btn--afterRegister center"
           href="/zaloguj-sie">
            {content.login}
        </a>
    </main>
};

export default VerificationPageContent;
