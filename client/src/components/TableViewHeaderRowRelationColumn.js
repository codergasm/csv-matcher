import React, {useContext} from 'react';
import {Tooltip} from "react-tippy";
import {ViewContext} from "./CorrelationView";

const TableViewHeaderRowRelationColumn = ({sortRelationColumnByMatch, relationColumnSort, setDeleteMatchesModalVisible}) => {
    const { selectList } = useContext(ViewContext);

    return <div className="sheet__header__cell sheet__header__cell--relation">
        <span className="sheet__header__cell--relation__bigText">
            Rekord z ark. 1, z którym powiązano rekord
        </span>

        <button className={relationColumnSort === 1 ? "btn--sortRelation btn--sortRelation--left btn--sortRelation--current" : "btn--sortRelation btn--sortRelation--left"}
                onClick={() => { sortRelationColumnByMatch(1); }}>
            Sortuj wg nieprzydzielonych
        </button>
        <button className={relationColumnSort === 2 ? "btn--sortRelation btn--sortRelation--right btn--sortRelation--current" : "btn--sortRelation btn--sortRelation--right"}
                onClick={() => { sortRelationColumnByMatch(2); }}>
            Sortuj wg przydzielonych
        </button>

        {selectList?.length ? <button className="btn btn--deleteMatches"
                                      onClick={() => { setDeleteMatchesModalVisible(true); }}>
            Usuń wszystkie dopasowania
        </button> : ''}

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
