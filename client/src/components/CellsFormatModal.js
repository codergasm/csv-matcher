import React, {useEffect, useState} from 'react';

const CellsFormatModal = ({closeModal, cellsHeight, setCellsHeight}) => {
    const [height, setHeight] = useState(-1);

    useEffect(() => {
        if(cellsHeight !== -1) {
            setCellsHeight(Math.max(50, height));
        }
    }, [height]);

    return <div className="modal modal--cellsFormat">
        <button className="btn btn--closeModal"
                onClick={() => { closeModal(); }}>
            &times;
        </button>

        <div className="modal__inner">
           <div className="modal__additionalOptions">
               <label className="label">
                   <button className={cellsHeight === -1 ? "btn btn--check btn--check--selected" : "btn btn--check"}
                           onClick={() => { setCellsHeight(-1) }}>

                   </button>
                   nie ograniczaj wysokości komórek
               </label>
               <label className="label">
                   <button className={cellsHeight !== -1 ? "btn btn--check btn--check--selected" : "btn btn--check"}
                           onClick={() => { setCellsHeight(p => (p === -1 ? 50 : p)) }}>

                   </button>
                   ograniczaj wysokość komórek do:
                   <span>
                       <input type="number"
                              value={height !== -1 ? height : ''}
                              onChange={(e) => { setHeight(parseInt(e.target.value)); }} /> px
                   </span>
               </label>
           </div>

            <button className="btn btn--startAutoMatch" onClick={() => { closeModal(); }}>
                Zatwierdź
            </button>
        </div>
    </div>
};

export default CellsFormatModal;
