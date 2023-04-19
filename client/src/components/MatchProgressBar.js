import React, {useEffect, useState} from 'react';

const MatchProgressBar = ({progress}) => {
    const [color, setColor] = useState('transparent');

    useEffect(() => {
        if(progress >= 0.9) {
            setColor('red');
        }
        else if(progress >= 0.6) {
            setColor('orange');
        }
        else if(progress >= 0.3) {
            setColor('yellow');
        }
        else {
            setColor('blue');
        }
    }, [progress]);

    return <div className="progressBar progressBar--match">
        <span style={{
            background: color,
            width: `${progress * 100}%`
        }}></span>
    </div>
};

export default MatchProgressBar;
