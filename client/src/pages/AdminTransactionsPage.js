import React, {useContext, useEffect, useState} from 'react';
import {getAllTransactions} from "../api/admin";
import {TranslationContext} from "../App";
import printDate from "../helpers/printDate";
import translatePaymentStatus from "../helpers/translatePaymentStatus";
import noIcon from '../static/img/no.svg';
import DatePicker from "react-date-picker";
import Papa from "papaparse";
import downloadFile from "../helpers/downloadFile";

const AdminTransactionsPage = () => {
    const { content } = useContext(TranslationContext);

    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [filterByDate, setFilterByDate] = useState(false);
    const [onlyConfirmed, setOnlyConfirmed] = useState(false);
    const [onlyInvoice, setOnlyInvoice] = useState(false);
    const [onlyReceipt, setOnlyReceipt] = useState(false);

    useEffect(() => {
        if(onlyInvoice) {
            setOnlyReceipt(false);
        }
    }, [onlyInvoice]);

    useEffect(() => {
        if(onlyReceipt) {
            setOnlyInvoice(false);
        }
    }, [onlyReceipt]);

    useEffect(() => {
        getAllTransactions()
            .then((res) => {
                if(res?.data) {
                    const filteredData = res.data.map((item) => {
                        const { create_datetime, amount, currency, status,
                            invoice_number, user_email, team_name } = item;

                        return {
                            create_datetime, amount, currency, status,
                            invoice_number, user_email, team_name
                        }
                    });

                    setTransactions(filteredData);
                    setFilteredTransactions(filteredData);
                }
            });
    }, []);

    useEffect(() => {
        let newFilteredTransactions = transactions;

        if(!onlyConfirmed && !onlyInvoice && !onlyReceipt) {
            if(filterByDate && dateFrom && dateTo) {
                newFilteredTransactions = newFilteredTransactions.filter((item) => {
                    const itemDatetime = new Date(item.create_datetime);
                    return itemDatetime >= dateFrom && itemDatetime <= dateTo;
                });
            }

            setFilteredTransactions(newFilteredTransactions);
        }
        else {
            if(onlyConfirmed) {
                newFilteredTransactions = newFilteredTransactions.filter((item) => {
                    return item.status === 'confirmed';
                });
            }
            if(onlyInvoice) {
                newFilteredTransactions = newFilteredTransactions.filter((item) => {
                    return item.invoice_number;
                });
            }
            else if(onlyReceipt) {
                newFilteredTransactions = newFilteredTransactions.filter((item) => {
                    return !item.invoice_number;
                });
            }

            if(filterByDate && dateFrom && dateTo) {
                newFilteredTransactions = newFilteredTransactions.filter((item) => {
                    const itemDatetime = new Date(item.create_datetime);
                    return itemDatetime >= dateFrom && itemDatetime <= dateTo;
                });
            }

            setFilteredTransactions(newFilteredTransactions);
        }
    }, [onlyConfirmed, onlyInvoice, onlyReceipt, dateFrom, dateTo, filterByDate]);

    const exportToCsv = () => {
        const csvData = Papa.unparse({
            fields: Object.keys(filteredTransactions[0]),
            data: filteredTransactions
        }, {
            delimiter: ';'
        });

        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        downloadFile(blob, 'transactions.csv');
    }

    return <div className="container">
        <div className="homepage homepage--files">
            <h1 className="homepage__header">
                {content.transactions}
            </h1>

            <div className="adminFilter adminFilter--date">
                <label className="label--invoice label--invoice--center">
                    <button className={filterByDate ? "btn btn--check btn--check--selected" : "btn btn--check"}
                            onClick={() => { setFilterByDate(p => !p); }}>

                    </button>
                    {content.filterByDate}
                </label>

                {filterByDate ? <div className="flex flex--start">
                    <div className="subscription__inner__dateSelector">
                        <span>{content.from}</span>
                        <DatePicker format={'dd.MM.y'}
                                    value={dateFrom}
                                    onChange={setDateFrom} />
                    </div>
                    <div className="subscription__inner__dateSelector">
                        <span>{content.to}</span>
                        <DatePicker minDate={dateFrom}
                                    format={'dd.MM.y'}
                                    value={dateTo}
                                    onChange={setDateTo} />
                    </div>
                </div> : ''}
            </div>
            <div className="adminFilter adminFilter--buttons">
                <label className="label--marginLeft label--invoice">
                    <button className={onlyConfirmed ? "btn btn--check btn--check--selected" : "btn btn--check"}
                            onClick={() => { setOnlyConfirmed(p => !p); }}>

                    </button>
                    {content.onlyConfirmed}
                </label>
                <label className="label--marginLeft label--invoice">
                    <button className={onlyInvoice ? "btn btn--check btn--check--selected" : "btn btn--check"}
                            onClick={() => { setOnlyInvoice(p => !p); }}>

                    </button>
                    {content.onlyInvoice}
                </label>
                <label className="label--marginLeft label--invoice">
                    <button className={onlyReceipt ? "btn btn--check btn--check--selected" : "btn btn--check"}
                            onClick={() => { setOnlyReceipt(p => !p); }}>

                    </button>
                    {content.onlyReceipt}
                </label>
            </div>

            <button className="btn btn--export btn--exportTransactions" onClick={exportToCsv}>
                {content.exportCurrentViewToCsv}
            </button>

            <div className="transactionsTableWrapper">
                <div className="sheet__table sheet__table--adminTransactions">
                    <div className="line line--member line--header">
                        {content.adminTransactionsTableHeader?.map((item, index) => {
                            return <div className="sheet__header__cell"
                                        key={index}>
                                {item}
                            </div>
                        })}
                    </div>

                    {filteredTransactions.map((item, index) => {
                        return <div className="line line--member"
                                    key={index}>
                            <div className="sheet__header__cell">
                                {printDate(new Date(item.create_datetime))}
                            </div>
                            <div className="sheet__header__cell">
                                {content.transactionTitle}
                            </div>
                            <div className="sheet__header__cell">
                                {item.amount} {item.currency}
                            </div>
                            <div className="sheet__header__cell sheet__header__cell--column">
                                {translatePaymentStatus(item.status, content.paymentStatuses)}
                            </div>
                            <div className="sheet__header__cell">
                                {item.invoice_number ? item.invoice_number : <img className="img--no"
                                                                                  src={noIcon}
                                                                                  alt="nie-dotyczy" />}
                            </div>
                            <div className="sheet__header__cell">
                                {item.user_email}
                            </div>
                            <div className="sheet__header__cell">
                                {item.team_name}
                            </div>
                            <div className="sheet__header__cell">
                                {item.status === 'confirmed' ? <button className="btn--rights btn--showInvoice">
                                    {content.showConfirmation}
                                </button> : ''}
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    </div>
};

export default AdminTransactionsPage;
