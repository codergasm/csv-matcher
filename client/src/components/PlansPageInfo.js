import React from 'react';

const PlansPageInfo = () => {
    return <div className="plans__info">
        <h4 className="plans__info__header">
            Tylko administrator zespołu może wykupić plan abonamentowy
        </h4>
        <p className="plans__info__text">
            Możesz w każdym momencie zmienić plan na wyższy lub niższy. Jeżeli
            zapragniesz wrócić do darmowej wersji - to Twój wcześniej zakupiony
            plan płatny będzie aktywny aż do momentu, do którego był opłacony.
        </p>
        <p className="plans__info__text">
            *Każdorazowo limity obowiązują cały zespół, jak i każdego użytkownika z osobna.
            Limity wliczają się, tym samym jeśli użytkownicy posiadają przykładowo 10MB danych
            dostępnych tylko dla siebie, oraz 20MB udostępnionych zespołowi - to łączna
            wartość zużycia wynosi 50MB.
        </p>
    </div>
};

export default PlansPageInfo;
