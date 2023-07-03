import React, {useEffect, useRef} from 'react';

const QuickBottomInfo = ({children, time}) => {
    let bottomInfo = useRef(null);

    useEffect(() => {
        if(children) {
            changeStyle('transform', 'scaleY(1)');

            setTimeout(() => {
                changeStyle('color', '#fff');
            }, time * 0.1);

            setTimeout(() => {
                changeStyle('color', 'transparent');

                setTimeout(() => {
                    changeStyle('transform', 'scaleY(0)');
                }, time * 0.1);
            }, time);
        }
    }, [children]);

    const changeStyle = (key, value) => {
        if(bottomInfo.current) {
            bottomInfo.current.style[key] = value;
        }
    }

    return <div className="bottomInfo"
                ref={bottomInfo}>
        {children}
    </div>
};

export default QuickBottomInfo;
