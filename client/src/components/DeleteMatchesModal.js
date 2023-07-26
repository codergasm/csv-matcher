import React, {useContext} from 'react';
import noIcon from '../static/img/no.svg';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import {ViewContext} from "./CorrelationView";
import {AppContext} from "../pages/CorrelationPage";
import CloseModalButton from "./CloseModalButton";
import {TranslationContext} from "../App";

const DeleteMatchesModal = ({closeModal}) => {
    const { content } = useContext(TranslationContext);
    const { relationSheet, dataSheet } = useContext(AppContext);
    const { setIndexesOfCorrelatedRows, setSelectList, setAfterMatchClean,
        setManuallyCorrelatedRows, setCorrelationMatrix } = useContext(ViewContext);

    useCloseModalOnOutsideClick(closeModal);
    useActionOnEscapePress(closeModal);

    const handleSubmit = () => {
        setAfterMatchClean(true);
        setIndexesOfCorrelatedRows(relationSheet.map(() => (-1)));
        setSelectList(relationSheet.map((relationRowItem, relationRowIndex) => {
            return dataSheet.map((dataRowItem, dataRowIndex) => {
                return {
                    dataRowIndex,
                    relationRowIndex,
                    similarity: -1
                }
            });
        }));
        setCorrelationMatrix(relationSheet.map(() => {
            return dataSheet.map(() => {
                return -1;
            });
        }));
        setManuallyCorrelatedRows([]);

        closeModal();
    }

    return <div className="modal modal--leaveTeam">
        <CloseModalButton onClick={closeModal} />

        <div className="modal__inner">
            <img className="img img--modalWarning" src={noIcon} alt="ostrzezenie" />

            <p className="modal__header modal__header--text">
                {content.deleteAllMatchesModalAlert}
            </p>

            <div className="flex flex--twoButtons">
                <button className="btn btn--leaveTeam btn--overrideMatch"
                        onClick={handleSubmit}>
                    {content.deleteMatches}
                </button>
                <button className="btn btn--neutral"
                        onClick={closeModal}>
                    {content.cancel}
                </button>
            </div>
        </div>
    </div>
};

export default DeleteMatchesModal;
