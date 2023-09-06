import React, {useContext, useEffect, useState} from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import getDaysDifferenceBetweenTwoDates from "../helpers/getDaysDifferenceBetweenTwoDates";
import addDaysToCurrentDate from "../helpers/addDaysToCurrentDate";
import {TranslationContext} from "../App";
import {plansColors, PRZELEWY24_PAYMENT_LINK} from "../static/constans";
import {registerPayment} from "../api/subscriptions";
import Loader from "./Loader";

const PayPlanWindow = ({plan, user}) => {
    const { content, currency } = useContext(TranslationContext);

    const [amount, setAmount] = useState(0);
    const [endDate, setEndDate] = useState(addDaysToCurrentDate(31));
    const [endDateButtonActive, setEndDateButtonActive] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(endDate && currency && plan) {
            const numberOfDaysToPay = getDaysDifferenceBetweenTwoDates(endDate, new Date());
            const costPerMonth = plan[`price_${currency.toLowerCase()}`];
            const costPerDay = costPerMonth / 30;

            setAmount(Math.floor(numberOfDaysToPay * costPerDay));
        }
    }, [endDate, currency, plan]);

    useEffect(() => {
        if(endDateButtonActive === 0) {
            setEndDate(addDaysToCurrentDate(31));
        }
        else if(endDateButtonActive === 1) {
            setEndDate(addDaysToCurrentDate(3 * 30));
        }
        else if(endDateButtonActive === 2) {
            setEndDate(addDaysToCurrentDate(12 * 30 + 1));
        }
    }, [endDateButtonActive]);

    const setPredefinedDate = (type) => {
        setEndDateButtonActive(type);
    }

    const makePayment = () => {
        setLoading(true);

        registerPayment(amount, currency, user.id, user.team_id, plan.id, endDate)
            .then((res) => {
                const paymentUri = PRZELEWY24_PAYMENT_LINK;
                const token = res.data.token;
                window.location = `${paymentUri}${token}`;
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return <div className="subscription__inner subscription__inner--new center shadow">
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

        {loading ? <div className="center">
            <Loader width={40} />
        </div> : <button className="btn btn--makePayment"
                         onClick={makePayment}>
            {content.goPay}
        </button>}
    </div>
};

export default PayPlanWindow;
