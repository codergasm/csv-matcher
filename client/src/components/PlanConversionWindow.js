import React, {useContext, useEffect, useState} from 'react';
import {TranslationContext} from "../App";
import addDaysToCurrentDate from "../helpers/addDaysToCurrentDate";
import getDaysDifferenceBetweenTwoDates from "../helpers/getDaysDifferenceBetweenTwoDates";
import {convertSubscription, validateConversionPossibility} from "../api/subscriptions";
import {plansColors} from "../static/constans";
import Loader from "./Loader";
import {SubscriptionContext} from "./LoggedUserWrapper";
import {addTrailingZero} from "../helpers/others";
import BottomNotification from "./BottomNotification";
import ConversionNotPossibleModal from "./ConversionNotPossibleModal";

const PlanConversionWindow = ({plan, user}) => {
    const { content, currency } = useContext(TranslationContext);
    const { currentPlan, planDeadline, planId } = useContext(SubscriptionContext);

    const [newPlanDeadline, setNewPlanDeadline] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [currentPlanMonthlyCost, setCurrentPlanMonthlyCost] = useState(0);
    const [currentPlanCostPerDay, setCurrentPlanCostPerDay] = useState(0);
    const [paidDaysLeft, setPaidDaysLeft] = useState(0);
    const [valueOfPaidDaysLeft, setValueOfPaidDaysLeft] = useState(0);
    const [newPlanMonthlyCost, setNewPlanMonthlyCost] = useState(0);
    const [newPlanCostPerDay, setNewPlanCostPerDay] = useState(0);
    const [numberOfFreeDays, setNumberOfFreeDays] = useState(0);
    const [conversionStatus, setConversionStatus] = useState(0);
    const [conversionErrorObject, setConversionErrorObject] = useState({});
    const [conversionNotPossibleModalVisible, setConversionNotPossibleModalVisible] = useState(false);

    useEffect(() => {
        if(plan && currency) {
            setCurrentPlanMonthlyCost(currentPlan[`price_${currency.toLowerCase()}`]);
        }
    }, [plan, currency]);

    useEffect(() => {
        setCurrentPlanCostPerDay((currentPlanMonthlyCost / 30).toFixed(2));
    }, [currentPlanMonthlyCost]);

    useEffect(() => {
        setPaidDaysLeft(getDaysDifferenceBetweenTwoDates(planDeadline, new Date()));
    }, [planDeadline]);

    useEffect(() => {
        setValueOfPaidDaysLeft(Math.floor(paidDaysLeft * currentPlanCostPerDay))
    }, [paidDaysLeft, currentPlanCostPerDay]);

    useEffect(() => {
        setNewPlanMonthlyCost(plan[`price_${currency.toLowerCase()}`]);
    }, [plan]);

    useEffect(() => {
        setNewPlanCostPerDay((newPlanMonthlyCost / 30).toFixed(2));
    }, [newPlanMonthlyCost]);

    useEffect(() => {
        setNumberOfFreeDays(Math.floor(valueOfPaidDaysLeft / newPlanCostPerDay));
    }, [valueOfPaidDaysLeft, newPlanCostPerDay]);

    useEffect(() => {
        setNewPlanDeadline(addDaysToCurrentDate(numberOfFreeDays));
    }, [numberOfFreeDays]);

    useEffect(() => {
        if(conversionStatus) {
            setLoading(false);

            setTimeout(() => {
                setConversionStatus(0);
            }, 3000);
        }
    }, [conversionStatus]);

    const convertAndBuyLongerDeadline = () => {
        setLoading(true);

        convertSubscription(user.teamId, plan.id, newPlanDeadline)
            .then(() => {
                window.location = `/subskrypcja?id=${plan.id}`;
            });
    }

    const convert = async () => {
        setLoading(true);

        if(planId < plan.id) {
            try {
                const conversionPossibility = await validateConversionPossibility(user.teamId, plan.id);

                if(conversionPossibility) {
                    if(conversionPossibility.data?.error) {
                        setConversionErrorObject(conversionPossibility.data);
                        setConversionNotPossibleModalVisible(true);
                        setLoading(false);
                        return 0;
                    }
                }
                else {
                    setConversionStatus(-1);
                }
            }
            catch(e) {
                setConversionStatus(-1);
            }
        }

        convertSubscription(user.teamId, plan.id, newPlanDeadline)
            .then((res) => {
                if(res) {
                    setConversionStatus(1);
                }
                else {
                    setConversionStatus(-1);
                }
            })
            .catch(() => {
                setConversionStatus(-1);
            });
    }

    return <div className="subscription__inner subscription__inner--conversion center shadow">
        {conversionStatus ? <BottomNotification text={conversionStatus === 1 ? content.conversionSuccess : content.error}
                                                background={conversionStatus === 1 ? '#508345' : 'red'} /> : ''}

        {conversionNotPossibleModalVisible ? <ConversionNotPossibleModal conversionErrorObject={conversionErrorObject}
                                                                         closeModal={() => { setConversionNotPossibleModalVisible(false); }} /> : ''}

        <h2 className="subscription__inner__header">
            {content.convertPlan}
        </h2>

        <div className="subscription__inner__plans">
            <div className="subscription__inner__plans__item">
                <span className="subscription__inner__plans__item__header">
                    {content.currentPlan}:
                </span>

                <h3 className="subscription__inner__planName center" style={{
                    background: plansColors[currentPlan?.id-1]
                }}>
                    {currentPlan?.name}
                </h3>
            </div>

            <div className="subscription__inner__plans__item">
                <span className="subscription__inner__plans__item__header">
                    {content.targetPlan}:
                </span>

                <h3 className="subscription__inner__planName center" style={{
                    background: plansColors[plan?.id-1]
                }}>
                    {plan?.name}
                </h3>
            </div>
        </div>

        <div className="flex flex--subscriptionConversion">
            <div className="subscription__inner__left">
                <div className="subscription__inner__data">
                    <div className="subscription__inner__data__item">
                        <p className="subscription__inner__data__item__key">
                            {content.monthlyCostOfCurrentPlan}
                        </p>
                        <p className="subscription__inner__data__item__value">
                            {currentPlanMonthlyCost} {currency}
                        </p>
                    </div>
                    <div className="subscription__inner__data__item">
                        <p className="subscription__inner__data__item__key">
                            {content.currentPlanCostPerDay}
                        </p>
                        <p className="subscription__inner__data__item__value">
                            {currentPlanCostPerDay} {currency}
                        </p>
                    </div>
                    <div className="subscription__inner__data__item">
                        <p className="subscription__inner__data__item__key">
                            {content.paidDaysLeft}
                        </p>
                        <p className="subscription__inner__data__item__value">
                            {paidDaysLeft}
                        </p>
                    </div>
                    <div className="subscription__inner__data__item">
                        <p className="subscription__inner__data__item__key">
                            {content.valueOfPaidDaysLeft}
                        </p>
                        <p className="subscription__inner__data__item__value">
                            {valueOfPaidDaysLeft}
                        </p>
                    </div>
                    <div className="subscription__inner__data__item subscription__inner__data__item--marginTop">
                        <p className="subscription__inner__data__item__key">
                            {content.monthlyCostOfTargetPlan}
                        </p>
                        <p className="subscription__inner__data__item__value">
                            {newPlanMonthlyCost} {currency}
                        </p>
                    </div>
                    <div className="subscription__inner__data__item">
                        <p className="subscription__inner__data__item__key">
                            {content.targetPlanCostPerDay}
                        </p>
                        <p className="subscription__inner__data__item__value">
                            {newPlanCostPerDay} {currency}
                        </p>
                    </div>
                    <div className="subscription__inner__data__item">
                        <p className="subscription__inner__data__item__key">
                            {content.numberOfFreeDays}
                        </p>
                        <p className="subscription__inner__data__item__value">
                            {numberOfFreeDays}
                        </p>
                    </div>
                </div>
            </div>

            <div className="subscription__inner__right">
                <div className="subscription__inner__dateSelector">
                    <h4 className="subscription__inner__dateSelector__header">
                        {content.newDeadlineAfterConversion}
                    </h4>

                    <h5 className="subscription__inner__dateSelector__content">
                        {addTrailingZero(newPlanDeadline.getDate())}.{addTrailingZero(newPlanDeadline.getMonth()+1)}.{newPlanDeadline.getFullYear()}
                    </h5>
                </div>

                <p className="subscription__inner__info">
                    {content.payPlanWindowDisclaimer}
                </p>

                {loading ? <div className="center">
                    <Loader width={40} />
                </div> : <>
                    <button className="btn btn--makePayment"
                            onClick={convert}>
                        {content.convert}
                    </button>
                    <button className="btn btn--makePayment btn--makePayment--white"
                            onClick={convertAndBuyLongerDeadline}>
                        {content.convertAndBuyLongerDeadline}
                    </button>
                </>}
            </div>
        </div>
    </div>
};

export default PlanConversionWindow;
