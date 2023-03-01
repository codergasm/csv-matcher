import React, {useEffect, useState} from 'react';

const ColumnsSettingsModal = ({closeModal, columnsNames, columns, setColumns, header}) => {
    const [allColumnsSelected, setAllColumnsSelected] = useState(false);

    const handleColumnsChange = (i) => {
        setColumns(prevState => {
            return prevState.map((item, index) => {
                if(index === i) return !item;
                else return item;
            });
        });
    }

    useEffect(() => {
        setAllColumnsSelected(columns.findIndex((item) => (!item)) === -1);
    }, [columns]);

    const removeAllColumns = () => {
        setColumns(prevState => (prevState.map(() => false)));
    }

    const selectAllColumns = () => {
        setColumns(prevState => (prevState.map(() => true)));
    }

    return <div className="modal">
        <button className="btn btn--closeModal"
                onClick={() => { closeModal(); }}>
            &times;
        </button>

        <div className="modal__inner modal__inner--columnsSettings scroll">
            <h3 className="modal__header modal__header--center">
                {header}
            </h3>

            <button className="btn btn--selectAll btn--selectAll--modal" onClick={() => { allColumnsSelected ? removeAllColumns() : selectAllColumns(); }}>
                {allColumnsSelected ? 'Odznacz' : 'Zaznacz'} wszystkie
            </button>

            <div className="modal__inner__columns">
                {columnsNames.map((item, index) => {
                    return <label className="modal__inner__column"
                                key={index}>
                    <span className="modal__inner__column__name">
                        {item}
                    </span>

                        <button className={columns[index] ? "btn btn--check btn--check--selected" : "btn btn--check"}
                                onClick={() => { handleColumnsChange(index); }}>

                        </button>
                    </label>
                })}
            </div>

            <button className="btn btn--modalConfirm"
                    onClick={() => { closeModal(); }}>
                Zamknij
            </button>
        </div>

    </div>
};

export default ColumnsSettingsModal;
