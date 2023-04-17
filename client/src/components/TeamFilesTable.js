import React, {useState} from 'react';
import {getDateFromString} from "../helpers/others";
import {assignFileOwnershipToTeam} from "../helpers/files";
import DecisionModal from "./DecisionModal";

const TeamFilesTable = ({files, setUpdateFiles, canUpdate, canDelete}) => {
    const columnsNames = [
        'nazwa pliku', 'data uploadu', 'ilość wierszy', 'rozmiar pliku'
    ];

    return <div className="teamTable w scroll">
        <div className="sheet__table">
            <div className="line line--membersHeader">
                {columnsNames.map((item, index) => {
                    return <div className="sheet__header__cell"
                                key={index}>
                        {item}
                    </div>
                })}
            </div>

            {files.map((item, index) => {
                    return <div className="line line--member"
                                key={index}>
                        <div className="sheet__header__cell">
                            {item.filename}
                        </div>
                        <div className="sheet__header__cell" dangerouslySetInnerHTML={{
                            __html: getDateFromString(item.created_datetime)
                        }}>

                        </div>
                        <div className="sheet__header__cell">
                            {item.row_count}
                        </div>
                        <div className="sheet__header__cell">
                            {item.filesize}
                        </div>
                    </div>
                })}
        </div>
    </div>;
};

export default TeamFilesTable;
