import React from 'react';

const ProgressBar = ({progress}) => {
    return <div className="progressBar">
        <span style={{
            width: `${progress * 100}%`
        }}></span>
    </div>
};

export default ProgressBar;
