import React, {useContext, useEffect, useRef, useState} from 'react';
import Loader from "./Loader";
import uploadIcon from "../static/img/upload.svg";
import {saveSheet} from "../api/files";
import ErrorInfo from "./ErrorInfo";
import QuickBottomInfo from "./QuickBottomInfo";
import {TranslationContext} from "../App";
import PermissionAlertModal from "./PermissionAlertModal";

const FileUploader = ({user, setUpdateFiles}) => {
    const { content } = useContext(TranslationContext);

    const [loading, setLoading] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [fileSavedModalVisible, setFileSavedModalVisible] = useState(false);
    const [fileSaveError, setFileSaveError] = useState('');

    let fileInput = useRef(null);

    useEffect(() => {
        if(fileSavedModalVisible) {
            setTimeout(() => {
                setFileSavedModalVisible(false);
            }, 3500);
        }
    }, [fileSavedModalVisible]);

    const addNewFileWrapper = (e) => {
        setLoading(true);
        inputDragLeave();

        saveSheet(e.target.files[0], user.teamId, false)
            .then((res) => {
                if(res?.status === 201) {
                    if(res?.data?.error) {
                        setFileSaveError(res.data.error);
                    }
                    else {
                        setFileSavedModalVisible(true);
                    }

                    setUpdateFiles(p => !p);
                }
                else {
                    setSaveError(content.error);
                }

                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setSaveError(content.error);
            });
    }

    const inputDragOver = () => {
        fileInput.current.classList.add('btn--addNewFile--grey');
        fileInput.current.classList.remove('btn--addNewFile--white');
    }

    const inputDragLeave = () => {
        fileInput.current.classList.add('btn--addNewFile--white');
        fileInput.current.classList.remove('btn--addNewFile--grey');
    }

    return <>
        {fileSaveError ? <PermissionAlertModal closeModal={() => { setFileSaveError(''); }}
                                               content={content.fileSaveError[fileSaveError]} /> : ''}

        {loading ? <div className="fileLoader">
            <Loader width={50} />
        </div> : <div className="btn btn--addNewFile"
                      ref={fileInput}
                      onDragOver={inputDragOver}
                      onDragLeave={inputDragLeave}>
            <input className="input--addNewFile"
                   type="file"
                   onChange={addNewFileWrapper} />

            <img className="img--upload" src={uploadIcon} alt="dodaj" />
            {content.addNewFile}
        </div>}

        <ErrorInfo content={saveError} />

        {fileSavedModalVisible ? <QuickBottomInfo time={3000}>
            {content.fileAdded}
        </QuickBottomInfo> : ''}
    </>
};

export default FileUploader;
