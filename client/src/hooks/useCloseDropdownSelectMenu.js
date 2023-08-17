import {useEffect} from "react";

const useCloseDropdownSelectMenu = (showFullCellValue, setShowSelectMenu, setShowSelectMenuRelation) => {
    useEffect(() => {
        document.addEventListener('click', (e) => {
            if(!showFullCellValue) {
                setShowSelectMenuRelation(-1);
                setShowSelectMenu(-1);
            }
        });

        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape' && !showFullCellValue) {
                setShowSelectMenuRelation(-1);
                setShowSelectMenu(-1);
            }
        });
    }, []);
}

export default useCloseDropdownSelectMenu;
