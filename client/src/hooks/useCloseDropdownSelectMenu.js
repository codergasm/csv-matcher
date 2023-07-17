import {useEffect} from "react";

const useCloseDropdownSelectMenu = (showFullCellValue, setShowSelectMenu) => {
    useEffect(() => {
        document.addEventListener('click', (e) => {
            if(!showFullCellValue) {
                setShowSelectMenu(-1);
            }
        });

        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape' && !showFullCellValue) {
                setShowSelectMenu(-1);
            }
        });
    }, []);
}

export default useCloseDropdownSelectMenu;
