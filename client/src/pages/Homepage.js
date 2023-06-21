import React from 'react';
import HomepageMenu from "../components/HomepageMenu";

const Homepage = () => {
    return <div className="container">
        <div className="homepage w">
            <h1 className="homepage__header">
                RowMatcher.com
            </h1>

            <HomepageMenu />
        </div>
    </div>
};

export default Homepage;
