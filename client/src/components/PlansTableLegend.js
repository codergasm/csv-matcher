import React from 'react';
import PlansTableLegendCell from "./PlansTableLegendCell";

const PlansTableLegend = () => {
    return <div className="plansTable__left__legend">
        <PlansTableLegendCell content={'Maksymalna ilość członków zespołu'} />
        <PlansTableLegendCell content={'Limit ilości plików na zespół'}
                              info={'Wliczamy zarówno pliki zespołowe, jak i prywatne każdego członka zespołu'} />
        <PlansTableLegendCell content={'Maksymalna ilość rekordów w pojedynczym pliku'}
                              info={'Czyli jak duże zbiory danych możesz przyrównywać'} />
        <PlansTableLegendCell content={'Maksymalna ilość kolumn w pojedynczym pliku'}
                              info={'Czyli jak duże zbiory danych możesz przyrównywać'} />
        <PlansTableLegendCell content={'Maksymalny rozmiar pojedynczego pliku'} />
        <PlansTableLegendCell content={'Przestrzeń dyskowa'}
                              info={'Czyli ile łącznie powierzchni mogą zajmować wszystkie pliki zespołu'} />
        <PlansTableLegendCell content={'Maksymalna ilość schematów dopasowania'} />
        <PlansTableLegendCell large={true}
                              content={'Maksymalna ilość automatycznie dopasowanych rekordów w skali miesięcznej'}
                              info={`Licznik zeruje się 1. dnia miesiąca. Dotyczy tylko rekordów dopasowanych automatycznie, 
                                       naliczane każdorazowo przy uruchomieniu automatycznego dopasowania, gdy zostaną przydzielone
                                       wyniki - nawet jeśli z nich nie skorzystasz. Licznik zeruje się co miesiąc licząc od 
                                       dnia uruchomienia danego pakietu.`} />
    </div>
};

export default PlansTableLegend;
