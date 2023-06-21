import React from 'react';

const PageHeader = ({children}) => {
    return <>
        <h1 className="homepage__header">
            RowMatcher.com
        </h1>
        <h2 className="homepage__subheader">
            {children}
        </h2>
    </>
};

export default PageHeader;
