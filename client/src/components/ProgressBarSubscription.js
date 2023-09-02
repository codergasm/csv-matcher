import React from 'react';

const ProgressBarSubscription = ({progress}) => {
    return <span className="progressBar progressBar--subscription">
        <span style={{
            width: `${progress * 100}%`
        }}></span>
    </span>
};

export default ProgressBarSubscription;
