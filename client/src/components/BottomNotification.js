import React, {useEffect, useRef} from 'react';

const BottomNotification = ({text, background}) => {
    let notification = useRef(null);

    useEffect(() => {
        if(notification?.current) {
            notification.current.style.bottom = '0';
            setTimeout(() => {
                notification.current.style.color = '#fff';

                setTimeout(() => {
                    notification.current.style.color = '#508345';
                    setTimeout(() => {
                        notification.current.style.bottom = '-50px';
                    }, 200);
                }, 2000);
            }, 200);
        }
    }, [notification]);

    return <div className="bottomNotification"
                style={{
                    background: background ? background : '#508345'
                }}
                ref={notification}>
        {text}
    </div>
};

export default BottomNotification
