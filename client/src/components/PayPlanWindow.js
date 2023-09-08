import React, {useContext, useEffect, useState} from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import getDaysDifferenceBetweenTwoDates from "../helpers/getDaysDifferenceBetweenTwoDates";
import addDaysToCurrentDate from "../helpers/addDaysToCurrentDate";
import {TranslationContext} from "../App";
import {plansColors, PRZELEWY24_PAYMENT_LINK} from "../static/constans";
import {getTeamInvoiceData, registerPayment} from "../api/subscriptions";
import Loader from "./Loader";
import {SubscriptionContext} from "./LoggedUserWrapper";
import addDaysToDate from "../helpers/addDaysToDate";
import InvoiceForm from "./InvoiceForm";

const PayPlanWindow = ({plan, user}) => {
    const { content, currency } = useContext(TranslationContext);
    const { planDeadline } = useContext(SubscriptionContext);

    const [amount, setAmount] = useState(0);
    const [endDate, setEndDate] = useState(addDaysToCurrentDate(31));
    const [endDateButtonActive, setEndDateButtonActive] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isInvoiceApplicable, setIsInvoiceApplicable] = useState(false);
    const [invoice, setInvoice] = useState({
        name: '',
        nip: '',
        street_name: '',
        street_number: '',
        postal_code: ''
    });
    const [invoiceError, setInvoiceError] = useState(false);

    useEffect(() => {
        if(user) {
            getTeamInvoiceData(user.teamId)
                .then((res) => {
                    if(res?.data?.name) {
                        setInvoice(Object.fromEntries(Object.entries(res.data).filter((item) => {
                            return item[0] !== 'team_id';
                        })));
                    }
                });
        }
    }, [user]);

    useEffect(() => {
        if(planDeadline > new Date()) {
            setEndDate(addDaysToDate(planDeadline, 31));
        }
    }, [planDeadline]);

    useEffect(() => {
        if(endDate && currency && plan) {
            const numberOfDaysToPay = getDaysDifferenceBetweenTwoDates(endDate, planDeadline);
            const costPerMonth = plan[`price_${currency.toLowerCase()}`];
            const costPerDay = costPerMonth / 30;

            setAmount(Math.floor(numberOfDaysToPay * costPerDay));
        }
    }, [endDate, currency, plan]);

    useEffect(() => {
        if(planDeadline) {
            if(endDateButtonActive === 0) {
                setEndDate(addDaysToDate(planDeadline, 30));
            }
            else if(endDateButtonActive === 1) {
                setEndDate(addDaysToDate(planDeadline, 3 * 30));
            }
            else if(endDateButtonActive === 2) {
                setEndDate(addDaysToDate(planDeadline, 12 * 30));
            }
        }
    }, [planDeadline, endDateButtonActive]);

    const setPredefinedDate = (type) => {
        setEndDateButtonActive(type);
    }

    const validateInvoiceFields = () => {
        return !isInvoiceApplicable || Object.values(invoice).findIndex((item) => (!item)) === -1;
    }

    const makePayment = () => {
        if(validateInvoiceFields()) {
            setLoading(true);

            registerPayment(amount, currency, user.id, user.teamId, plan.id,
                endDate, isInvoiceApplicable ? invoice : null)
                .then((res) => {
                    window.location = `${PRZELEWY24_PAYMENT_LINK}${res.data.token}`;
                })
                .catch(() => {
                    setLoading(false);
                });
        }
        else {
            setInvoiceError(true);
        }
    }

    return <div className="subscription__inner subscription__inner--new scroll shadow">
        <h2 className="subscription__inner__header">
            {content.payPlan}
        </h2>

        <h3 className="subscription__inner__planName center" style={{
            background: plansColors[plan?.id-1]
        }}>
            {plan?.name}
        </h3>

        <div className="subscription__inner__dateSelector">
            <DatePicker minDate={addDaysToCurrentDate(31)}
                        format={'dd.MM.y'}
                        value={endDate}
                        onChange={setEndDate} />
        </div>

        <div className="subscription__inner__buttons">
            <span>{content.clickAndSet}</span>

            {content.predefinedDateRanges.map((item, index) => {
                return <button className={endDateButtonActive === index ? "btn btn--endDate btn--endDate--active" : 'btn btn--endDate'}
                               key={index}
                               onClick={() => { setPredefinedDate(index); }}>
                    {item}
                </button>
            })}
        </div>

        <p className="subscription__inner__info">
            {content.payPlanWindowDisclaimer}
        </p>

        <h4 className="subscription__inner__amountToPay">
            <span>{amount} {currency}</span>
            <span>{content.toPay}</span>
        </h4>

        <InvoiceForm invoice={invoice}
                     isInvoiceApplicable={isInvoiceApplicable}
                     setInvoice={setInvoice}
                     setIsInvoiceApplicable={setIsInvoiceApplicable}
                     invoiceError={invoiceError}
                     setInvoiceError={setInvoiceError} />

        {loading ? <div className="center">
            <Loader width={40} />
        </div> : <button className="btn btn--makePayment"
                         onClick={makePayment}>
            {content.goPay}
        </button>}
    </div>
};

export default PayPlanWindow;
