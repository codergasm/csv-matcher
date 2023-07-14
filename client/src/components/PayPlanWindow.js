import React, {useEffect, useState} from 'react';

const PayPlanWindow = ({plan}) => {
    const [amount, setAmount] = useState(0);
    const [endDate, setEndDate] = useState(new Date());
    const [endDateButtonActive, setEndDateButtonActive] = useState(-1);

    useEffect(() => {

    }, [endDate]);

    const setPredefinedDate = (type) => {
        setEndDateButtonActive(type);
    }

    const makePayment = () => {

    }

    return <div className="subscription__inner center shadow">
        <h2 className="subscription__inner__header">
            Opłać plan
        </h2>

        <h3 className="subscription__inner__planName center">
            {plan?.name}
        </h3>

        <div className="subscription__inner__dataSelector">

        </div>

        <div className="subscription__inner__buttons">
            <span>Kliknij i ustaw:</span>
            <button className={endDateButtonActive === 0 ? "btn btn--endDate btn--endDate--active" : 'btn btn--endDate'}
                    onClick={() => { setPredefinedDate(0); }}>
                miesiąc
            </button>
            <button className={endDateButtonActive === 1 ? "btn btn--endDate btn--endDate--active" : 'btn btn--endDate'}
                    onClick={() => { setPredefinedDate(1); }}>
                3 miesiące
            </button>
            <button className={endDateButtonActive === 2 ? "btn btn--endDate btn--endDate--active" : 'btn btn--endDate'}
                    onClick={() => { setPredefinedDate(2); }}>
                rok
            </button>
        </div>

        <p className="subscription__inner__info">
            Możesz w każdym momencie zmienić plan na wyższy lub niższy. Jeżeli zapragniesz wrócić do
            darmowej wersji - to Twój wcześniej zakupiony plan płatny będzie aktywny aż do momentu,
            do którego był opłacony.
        </p>

        <h4 className="subscription__inner__amountToPay">
            <span>{amount} zł</span>
            <span>Do zapłaty</span>
        </h4>

        <button className="btn btn--makePayment"
                onClick={makePayment}>
            Przjedź do płatności
        </button>
    </div>
};

export default PayPlanWindow;
