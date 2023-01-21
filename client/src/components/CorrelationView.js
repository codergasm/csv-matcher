import React, {useState} from 'react';

const CorrelationView = () => {
    // 0 - data, 1 - relation, 2 - output
    const [currentSheet, setCurrentSheet] = useState(0);

    return <div className="container container--correlation">
        <div className="correlation__viewPicker flex">
            <button className={currentSheet === 0 ? "btn btn--correlationViewPicker btn--correlationViewPicker--current" : "btn btn--correlationViewPicker"}
                    onClick={() => { setCurrentSheet(0); }}>
                Arkusz 1
            </button>
            <button className={currentSheet === 1 ? "btn btn--correlationViewPicker btn--correlationViewPicker--current" : "btn btn--correlationViewPicker"}
                    onClick={() => { setCurrentSheet(1); }}>
                Arkusz 2
            </button>
            <button className={currentSheet === 2 ? "btn btn--correlationViewPicker btn--correlationViewPicker--current" : "btn btn--correlationViewPicker"}
                    onClick={() => { setCurrentSheet(2); }}>
                Arkusz wyjściowy
            </button>
        </div>
    </div>
};

export default CorrelationView;
