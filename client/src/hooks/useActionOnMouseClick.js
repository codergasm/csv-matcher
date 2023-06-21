import {useEffect} from "react";

const useActionOnMouseClick = (action) => {
    useEffect(() => {
        document.addEventListener('click', () => {
            action();
        });
    }, []);
}

export default useActionOnMouseClick;
