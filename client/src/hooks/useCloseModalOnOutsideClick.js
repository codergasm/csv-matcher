import {useEffect} from "react";

const useCloseModalOnOutsideClick = (closeModal) => {
    useEffect(() => {
        const modal = document.querySelector('.modal');
        modal.addEventListener('click', (event) => {
            const target = event.target;
            const closest = target.closest('.modal__inner');

            if(!closest) {
                closeModal();
            }
        });
    }, []);
}

export default useCloseModalOnOutsideClick;
