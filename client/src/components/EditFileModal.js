import React, {useContext, useEffect, useState} from 'react';
import Loader from "./Loader";
import fileIcon from '../static/img/file.svg';
import addIcon from '../static/img/add.svg';
import {updateSheet} from "../api/files";
import CloseModalButton from "./CloseModalButton";
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import {TranslationContext} from "../App";

const EditFileModal = ({closeModal, teamId, id, name, setUpdateFiles}) => {
    const { content } = useContext(TranslationContext);

    const [newName, setNewName] = useState('');
    const [file, setFile] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const closeModalWrapper = () => {
        setUpdateFiles(p => !p);
        closeModal();
    }

    useCloseModalOnOutsideClick(closeModalWrapper);
    useActionOnEscapePress(closeModalWrapper);

    useEffect(() => {
        if(name) {
            setNewName(name);
        }
    }, [name]);

    const handleSubmit = () => {
        setLoading(true);
        updateSheet(file, teamId, id, newName)
            .then((res) => {
                if(res?.status === 200) {
                    setSuccess(true);
                }
                else {
                    setError(content.error);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setError(content.error);
            });
    }

    const handleChange = (e) => {
        if(e?.target?.files) {
            setNewName(e.target.files[0]?.name);
            setFile(e.target.files[0]);
        }
    }

    return <div className="modal modal--leaveTeam modal--editFile">
        <CloseModalButton onClick={closeModalWrapper} />

        <div className="modal__inner">
            {!success && !error ? <>
                <label className="label">
                    {content.fileName}
                    <input className="input input--teamName"
                           value={newName}
                           onChange={(e) => { setNewName(e.target.value); }}
                           placeholder={content.fileName} />
                </label>

                <div className="editFileWrapper">
                    {file ? <div className="editFileWrapper__fileAdded">
                        <img className="img" src={fileIcon} alt="dodany" />
                        <span>
                            {content.fileAdded}.<br/>{content.clickEditToConfirm}.
                        </span>
                    </div> : <div className="editFileWrapper__input">
                        <input className="input input--addNewFile"
                               onChange={(e) => { handleChange(e); }}
                               type="file" />
                        <img className="img" src={addIcon} alt="dodaj" />
                        <span>
                            {content.addNewFile}
                        </span>
                    </div>}
                </div>

                {!loading ? <div className="flex flex--twoButtons">
                    <button className="btn btn--submitFormNewTeam btn--submitEditFile"
                            onClick={handleSubmit}>
                        {content.edit}
                    </button>
                </div>: <Loader width={50} />}
            </> :  <>
                <h4 className="afterRegister__header afterRegister__header--center">
                    {error ? error : content.fileEdited}
                </h4>

                <a className="btn btn--afterRegister" href="/pliki">
                    {content.back}
                </a>
            </>}
        </div>
    </div>
};

export default EditFileModal;
