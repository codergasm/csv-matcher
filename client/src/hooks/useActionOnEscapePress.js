import {useEffect} from "react";

const useActionOnEscapePress = (action) => {
    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') {
                action();
            }
        });
    }, []);
}

export default useActionOnEscapePress;
