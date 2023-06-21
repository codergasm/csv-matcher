import React, {useEffect, useState} from 'react';
import Loader from "./Loader";
import fileIcon from '../static/img/file.svg';
import addIcon from '../static/img/add.svg';
import {getFilesByUser, updateSheet} from "../api/files";
import {assignSheetsToSchema} from "../api/schemas";

const AssignSheetsToSchemaModal = ({closeModal, setUpdateSchemas, showBottomNotification, matchSchema}) => {
    const [loading, setLoading] = useState(false);

    const [files, setFiles] = useState([]);
    const [dataSheetId, setDataSheetId] = useState(0);
    const [relationSheetId, setRelationSheetId] = useState(0);

    useEffect(() => {
        getFilesByUser()
            .then((res) => {
                if(res?.data) {
                    setFiles(res.data);
                }
            });
    }, []);

    const handleSubmit = () => {
        setLoading(true);

        assignSheetsToSchema(dataSheetId, relationSheetId, matchSchema)
            .then(() => {
                showBottomNotification(0);
                closeModalWrapper();
            })
            .catch(() => {
                showBottomNotification(-1);
                closeModalWrapper();
            });
    }

    const closeModalWrapper = () => {
        setUpdateSchemas(p => !p);
        closeModal();
    }

    return <div className="modal modal--chooseSheets">
        <button className="btn btn--closeModal"
                onClick={() => { closeModalWrapper(); }}>
            &times;
        </button>

        <div className="modal__inner modal__inner--chooseSheets">
            <div className="modal__sheetsList">
                <h4 className="modal__header">
                    Arkusz 1
                </h4>
                <div className="modal__sheetsList__inner scroll">
                    {files.map((item, index) => {
                        return <button className={item.id === dataSheetId ? "modal__sheetsList__item modal__sheetsList__item--selected" : "modal__sheetsList__item"}
                                       onClick={() => { setDataSheetId(item.id); }}
                                       key={index}>
                            {item.filename}
                        </button>
                    })}
                </div>
            </div>

            <div className="modal__sheetsList">
                <h4 className="modal__header">
                    Arkusz 2
                </h4>
                <div className="modal__sheetsList__inner scroll">
                    {files.map((item, index) => {
                        return <button className={item.id === relationSheetId ? "modal__sheetsList__item modal__sheetsList__item--selected" : "modal__sheetsList__item"}
                                       onClick={() => { setRelationSheetId(item.id); }}
                                       key={index}>
                            {item.filename}
                        </button>
                    })}
                </div>
            </div>

            {!loading ? <button className="btn btn--submitFormNewTeam btn--assignSheetsToSchemaSubmit"
                                disabled={dataSheetId === 0 || relationSheetId === 0}
                                onClick={() => { handleSubmit(); }}>
                Przypisz arkusze do schematu
            </button> : <Loader width={50} />}
        </div>
    </div>
};

export default AssignSheetsToSchemaModal;
