import React, {useContext, useEffect, useState} from 'react';
import Loader from "./Loader";
import {getFilesByUser} from "../api/files";
import {assignSheetsToSchema} from "../api/schemas";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import FileUploader from "./FileUploader";
import {TranslationContext} from "../App";
import CloseModalButton from "./CloseModalButton";

const AssignSheetsToSchemaModal = ({closeModal, setUpdateSchemas, showBottomNotification, matchSchema, user}) => {
    const { content } = useContext(TranslationContext);

    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [dataSheetId, setDataSheetId] = useState(0);
    const [relationSheetId, setRelationSheetId] = useState(0);
    const [updateFiles, setUpdateFiles] = useState(false);

    const closeModalWrapper = () => {
        setUpdateSchemas(p => !p);
        closeModal();
    }

    useCloseModalOnOutsideClick(closeModalWrapper);
    useActionOnEscapePress(closeModalWrapper);

    useEffect(() => {
        getFilesByUser()
            .then((res) => {
                if(res?.data) {
                    setFiles(res.data);
                }
            });
    }, [updateFiles]);

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

    return <div className="modal modal--chooseSheets">
        <CloseModalButton onClick={closeModalWrapper} />

        <div className="modal__inner modal__inner--chooseSheets">
            <div className="modal__sheetsList">
                <h4 className="modal__header">
                    {content.sheet1}
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

                <FileUploader setUpdateFiles={setUpdateFiles}
                              user={user} />
            </div>

            <div className="modal__sheetsList">
                <h4 className="modal__header">
                    {content.sheet2}
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

                <FileUploader setUpdateFiles={setUpdateFiles}
                              user={user} />
            </div>

            {!loading ? <button className="btn btn--submitFormNewTeam btn--assignSheetsToSchemaSubmit"
                                disabled={dataSheetId === 0 || relationSheetId === 0}
                                onClick={handleSubmit}>
                {content.assignSheetsToSchema}
            </button> : <Loader width={50} />}
        </div>
    </div>
};

export default AssignSheetsToSchemaModal;
