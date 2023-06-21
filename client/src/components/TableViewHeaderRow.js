import React from 'react';
import {Tooltip} from "react-tippy";
import sortIcon from "../static/img/sort-down.svg";

const TableViewHeaderRow = ({columnsNames, columnsVisibility, getColumnMinWidth, columnsSorting, sortSheet, removeSorting}) => {
    return <>
        {columnsNames.map((item, index) => {
            if(columnsVisibility[index]) {
                return <div className={index === 0 ? "sheet__header__cell sheet__header__cell--first" : "sheet__header__cell"}
                            style={{
                                minWidth: getColumnMinWidth()
                            }}
                            key={index}>

                    {item ?  <Tooltip title={item}
                                      followCursor={true}
                                      size="small"
                                      position="top">
                        {item}
                    </Tooltip> : ''}

                    <div className="sheet__header__cell__sort">
                        <button className={columnsSorting[index] ? "btn--sortColumn btn--sortColumn--active" : "btn--sortColumn"}
                                onClick={() => { sortSheet(item, index); }}>
                            <img className={columnsSorting[index] === 1 ? "img img--rotate" : "img"} src={sortIcon} alt="sortuj" />
                        </button>
                        {columnsSorting[index] ? <button className="btn--removeSorting"
                                                         onClick={() => { removeSorting(index); }}>
                            &times;
                        </button> : ''}
                    </div>
                </div>
            }
        })}
    </>
};

export default TableViewHeaderRow;
