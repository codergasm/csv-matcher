import React, {useContext, useEffect, useState} from 'react';
import {Tooltip} from "react-tippy";
import sortIcon from "../static/img/sort-down.svg";
import searchIcon from '../static/img/search-icon.svg';
import {TranslationContext} from "../App";

const TableViewHeaderRow = ({columnsNames, columnsVisibility, getColumnMinWidth, columnsSorting,
                                sortSheet, removeSorting, searchInputValues, setSearchInputValues}) => {
    const { content } = useContext(TranslationContext);

    const [searchInputVisible, setSearchInputVisible] = useState([]);

    useEffect(() => {
        if(columnsNames) {
            setSearchInputVisible(columnsNames.map(() => false));
        }
    }, [columnsNames]);

    const openSearchInput = (i) => {
        setSearchInputVisible(prevState => {
            return prevState.map((item, index) => {
                if(index === i) {
                    return true;
                }
                else {
                    return item;
                }
            });
        });
    }

    const handleSearchValueChange = (e, i) => {
        setSearchInputValues(prevState => {
            return prevState.map((item, index) => {
                if(index === i) {
                    return e.target.value.toLowerCase();
                }
                else {
                    return item;
                }
            });
        });
    }

    const removeFiltering = (i) => {
        setSearchInputValues(prevState => {
            return prevState.map((item, index) => {
                if(index === i) {
                    return '';
                }
                else {
                    return item;
                }
            });
        });

        setSearchInputVisible(prevState => {
            return prevState.map((item, index) => {
                if(index === i) {
                    return false;
                }
                else {
                    return item;
                }
            });
        });
    }

    const getNumberOfVisibleColumns = () => {
        return columnsVisibility.filter((item) => (item)).length;
    }

    const removeFilteringOnEscapeClick = (e, index) => {
        if(e.key === 'Escape') {
            removeFiltering(index);
        }
    }

    return <>
        {columnsNames.map((item, index) => {
            if(columnsVisibility[index]) {
                return <div className={index === 0 && getNumberOfVisibleColumns() > 1 ? "sheet__header__cell sheet__header__cell--name sheet__header__cell--first" : "sheet__header__cell sheet__header__cell--name"}
                            style={{
                                minWidth: getColumnMinWidth()
                            }}
                            key={index}>

                    {searchInputVisible[index] ? <label className="sheet__header__cell__label">
                        <input className="input"
                               value={searchInputValues[index]}
                               onKeyDown={(e) => { removeFilteringOnEscapeClick(e, index); }}
                               onChange={(e) => { handleSearchValueChange(e, index); }}
                               placeholder={content.search} />
                    </label> : (item ?  <Tooltip title={item}
                                            followCursor={true}
                                            size="small"
                                            position="top">
                        {item}
                    </Tooltip> : '')}

                    <div className="sheet__header__cell__sortAndSearchButtons">
                        <div className="sheet__header__cell__sort">
                            <button className="btn--sortColumn"
                                    onClick={() => { openSearchInput(index); }}>
                                <img className="img" src={searchIcon} alt="search" />
                            </button>

                            {searchInputVisible[index] ? <button className="btn--removeSorting"
                                                             onClick={() => { removeFiltering(index); }}>
                                &times;
                            </button> : ''}
                        </div>

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
                </div>
            }
        })}
    </>
};

export default TableViewHeaderRow;
