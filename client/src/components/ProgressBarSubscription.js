import React from 'react';

const ProgressBarSubscription = ({progress}) => {
    return <span className="progressBar progressBar--subscription">
        <span style={{
            width: `${progress * 100}%`,
            background: progress * 100 > 90 ? 'red' : '#508345'
        }}></span>
    </span>
};

export default ProgressBarSubscription;
