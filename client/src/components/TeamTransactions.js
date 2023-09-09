import React, {useContext, useEffect, useState} from 'react';
import {getTeamTransactions} from "../api/subscriptions";
import {TranslationContext} from "../App";
import printDate from "../helpers/printDate";
import translatePaymentStatus from "../helpers/translatePaymentStatus";
import {PRZELEWY24_PAYMENT_LINK} from "../static/constans";

const TeamTransactions = ({user}) => {
    const { content } = useContext(TranslationContext);

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if(user) {
            getTeamTransactions(user.teamId)
                .then((res) => {
                    if(res) {
                        setTransactions(res.data);
                    }
                });
        }
    }, [user]);

    return <div className="transactions">
        <div className="teamTable w scroll">
            <div className="sheet__table">
                <div className="line line--member line--header">
                    {content.transactionsTableHeader?.map((item, index) => {
                        return <div className="sheet__header__cell"
                                    key={index}>
                            {item}
                        </div>
                    })}
                </div>

                {transactions.map((item, index) => {
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

                            {item.status !== 'confirmed' ? <a href={`${PRZELEWY24_PAYMENT_LINK}${item.payment_token}`}
                                                              className="btn--rights btn--payAgain">
                                Opłać ponownie
                            </a> : ''}
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
};

export default TeamTransactions;
