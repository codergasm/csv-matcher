import React, {useContext} from 'react';
import noIcon from '../static/img/no.svg';
import useCloseModalOnOutsideClick from "../hooks/useCloseModalOnOutsideClick";
import useActionOnEscapePress from "../hooks/useActionOnEscapePress";
import {ViewContext} from "./CorrelationView";
import {AppContext} from "../pages/CorrelationPage";

const DeleteMatchesModal = ({closeModal}) => {
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
        <button className="btn btn--closeModal"
                onClick={closeModal}>
            &times;
        </button>

        <div className="modal__inner">
            <img className="img img--modalWarning" src={noIcon} alt="ostrzezenie" />

            <p className="modal__header modal__header--text">
                Uwaga! Czy na pewno chcesz usunąć wszystkie dopasowania?
            </p>

            <div className="flex flex--twoButtons">
                <button className="btn btn--leaveTeam btn--overrideMatch"
                        onClick={handleSubmit}>
                    Usuń dopasowania
                </button>
                <button className="btn btn--neutral"
                        onClick={closeModal}>
                    Anuluj
                </button>
            </div>
        </div>
    </div>
};

export default DeleteMatchesModal;
