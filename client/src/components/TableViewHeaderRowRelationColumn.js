import React, {useContext, useEffect} from 'react';
import {Tooltip} from "react-tippy";
import {ViewContext} from "./CorrelationView";
import {TranslationContext} from "../App";

const TableViewHeaderRowRelationColumn = ({sortRelationColumnByMatch, relationColumnSort, id,
                                              setDeleteMatchesModalVisible, sheetIndex, showDisclaimer}) => {
    const { content } = useContext(TranslationContext);
    const { selectList } = useContext(ViewContext);

    useEffect(() => {
        console.log(showDisclaimer);
    }, [showDisclaimer]);

    return <div className="sheet__header__cell sheet__header__cell--relation"
                key={id}>
        <span className="sheet__header__cell--relation__bigText">
            {content.relationColumnHeaders[sheetIndex]}
        </span>

        <button className={relationColumnSort === 1 ? "btn--sortRelation btn--sortRelation--left btn--sortRelation--current" : "btn--sortRelation btn--sortRelation--left"}
                onClick={() => { sortRelationColumnByMatch(1); }}>
            {content.sortByUnmatched}
        </button>
        <button className={relationColumnSort === 2 ? "btn--sortRelation btn--sortRelation--right btn--sortRelation--current" : "btn--sortRelation btn--sortRelation--right"}
                onClick={() => { sortRelationColumnByMatch(2); }}>
            {content.sortByMatched}
        </button>

        {selectList?.length ? <button className="btn btn--deleteMatches"
                                      onClick={() => { setDeleteMatchesModalVisible(true); }}>
            {content.deleteAllMatches}
        </button> : ''}

        <Tooltip title={content.selectListTooltip[sheetIndex]}
                 followCursor={true}
                 size="small"
                 position="top">
            <span className="sheet__tooltip">
                ?
            </span>
        </Tooltip>

        {showDisclaimer ? <span className="disclaimer">
            <span>
                {content.noColumnsInSelectMenuAlert}
            </span>
        </span> : ''}
    </div>
};

export default TableViewHeaderRowRelationColumn;
