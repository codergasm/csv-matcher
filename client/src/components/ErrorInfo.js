import React from 'react';

const ErrorInfo = ({content}) => {
    return content ? <span className="error">
        {content}
    </span> : '';
}

export default ErrorInfo;
