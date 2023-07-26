import React, {useContext, useEffect, useState} from 'react';
import CloseModalButton from "./CloseModalButton";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import {TranslationContext} from "../App";

const CellsFormatModal = ({closeModal, cellsHeight, setCellsHeight}) => {
    const { content } = useContext(TranslationContext);

    const [height, setHeight] = useState(-1);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    useEffect(() => {
        if(cellsHeight !== -1) {
            setCellsHeight(Math.max(50, height));
        }
    }, [height]);

    return <div className="modal modal--cellsFormat">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
           <div className="modal__additionalOptions">
               <label className="label">
                   <button className={cellsHeight === -1 ? "btn btn--check btn--check--selected" : "btn btn--check"}
                           onClick={() => { setCellsHeight(-1) }}>

                   </button>
                   {content.notRestrictCellsHeight}
               </label>
               <label className="label">
                   <button className={cellsHeight !== -1 ? "btn btn--check btn--check--selected" : "btn btn--check"}
                           onClick={() => { setCellsHeight(p => (p === -1 ? 50 : p)) }}>

                   </button>
                   {content.restrictCellsHeight}
                   <span>
                       <input type="number"
                              value={height !== -1 ? height : ''}
                              onChange={(e) => { setHeight(parseInt(e.target.value)); }} /> px
                   </span>
               </label>
           </div>

            <button className="btn btn--startAutoMatch"
                    onClick={closeModal}>
                {content.confirm}
            </button>
        </div>
    </div>
};

export default CellsFormatModal;
