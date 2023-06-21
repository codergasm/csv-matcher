import React from 'react';
import {Tooltip} from "react-tippy";

const TableViewHeaderRowRelationColumn = ({sortRelationColumnByMatch, relationColumnSort}) => {
    return <div className="sheet__header__cell sheet__header__cell--relation">
        Rekord z ark. 1, z którym powiązano rekord

        <button className={relationColumnSort === 1 ? "btn--sortRelation btn--sortRelation--left btn--sortRelation--current" : "btn--sortRelation btn--sortRelation--left"}
                onClick={() => { sortRelationColumnByMatch(1); }}>
            Sortuj wg nieprzydzielonych
        </button>
        <button className={relationColumnSort === 2 ? "btn--sortRelation btn--sortRelation--right btn--sortRelation--current" : "btn--sortRelation btn--sortRelation--right"}
                onClick={() => { sortRelationColumnByMatch(2); }}>
            Sortuj wg przydzielonych
        </button>

        <Tooltip title="Skorzystaj z konfiguracji arkusza 1 i wskaż wartość których kolumn ma się tutaj wyświetlać, aby pomóc Tobie zidentyfikować dane wiersze z danymi z arkusza 1."
                 followCursor={true}
                 size="small"
                 position="top">
            <span className="sheet__tooltip">
                ?
            </span>
        </Tooltip>
    </div>
};

export default TableViewHeaderRowRelationColumn;
