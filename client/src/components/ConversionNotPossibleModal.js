import React, {useContext} from 'react';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import CloseModalButton from "./CloseModalButton";
import noIcon from "../static/img/no.svg";
import {TranslationContext} from "../App";

const ConversionNotPossibleModal = ({closeModal, conversionErrorObject}) => {
    const { content } = useContext(TranslationContext);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    return <div className="modal modal--alertNotTeamMember scroll">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
            <img className="img img--modalWarning" src={noIcon} alt="ostrzezenie" />

            <p className="modal__header modal__header--text">
                {content.conversionNotPossible}
            </p>

            {conversionErrorObject?.numberOfMatchOperationsError ? <p className="modal__header modal__header--text modal__header--text--point">
                {content.conversionErrorMatchOperations}
            </p> : ''}

            {conversionErrorObject?.numberOfUsersError ? <p className="modal__header modal__header--text modal__header--text--point">
                {content.conversionErrorNumberOfUsers}
            </p> : ''}

            {conversionErrorObject?.numberOfFilesError ? <p className="modal__header modal__header--text modal__header--text--point">
                {content.conversionErrorNumberOfFiles}
            </p> : ''}

            {conversionErrorObject?.numberOfMatchSchemasError ? <p className="modal__header modal__header--text modal__header--text--point">
                {content.conversionErrorNumberOfSchemas}
            </p> : ''}

            {conversionErrorObject?.diskUsageError ? <p className="modal__header modal__header--text modal__header--text--point">
                {content.conversionErrorDiskUsage}
            </p> : ''}

            {conversionErrorObject?.exceededSizeFiles?.length ? <p className="modal__header modal__header--text modal__header--text--single modal__header--text--point">
                {content.conversionErrorSingleFileSize}

                {conversionErrorObject?.exceededSizeFiles ? conversionErrorObject.exceededSizeFiles.map((item, index) => {
                    return <span key={index}>
                        {item}
                    </span>
                }) : ''}
            </p> : ''}

            {conversionErrorObject?.exceededColumnsFiles?.length ? <p className="modal__header modal__header--text modal__header--text--single modal__header--text--point">
                {content.conversionErrorSingleFileColumns}

                {conversionErrorObject.exceededColumnsFiles ? conversionErrorObject.exceededColumnsFiles.map((item, index) => {
                    return <span key={index}>
                        {item}
                    </span>
                }) : ''}
            </p> : ''}

            {conversionErrorObject?.exceededRowsFiles?.length ? <p className="modal__header modal__header--text modal__header--text--single modal__header--text--point">
                {content.conversionErrorSingleFileRows}

                {conversionErrorObject.exceededRowsFiles ? conversionErrorObject.exceededRowsFiles.map((item, index) => {
                    return <span key={index}>
                        {item}
                    </span>
                }) : ''}
            </p> : ''}

            <button onClick={closeModal}
                    className="btn btn--neutral btn--alertNotTeamMember">
                {content.close}
            </button>
        </div>
    </div>
};

export default ConversionNotPossibleModal;
