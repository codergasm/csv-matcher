import React from 'react';
import icon1 from '../static/img/file.svg';
import icon2 from '../static/img/diagram.svg';
import icon3 from '../static/img/puzzle.svg';
import icon4 from '../static/img/team.svg';

const Homepage = () => {
    return <div className="container">
        <div className="homepage w">
            <h1 className="homepage__header">
                RowMatcher.com
            </h1>
            <div className="homepage__menu">
                <a className="homepage__menu__item shadow"
                   href="/pliki">
                    <img className="img" src={icon1} alt="moje-pliki" />

                    <span>
                        Moje pliki
                    </span>
                </a>
                <a className="homepage__menu__item shadow"
                   href="/schematy-dopasowania">
                    <img className="img" src={icon2} alt="moje-schematy-dopasowania" />

                    <span>
                        Moje schematy dopasowania
                    </span>
                </a>
                <a className="homepage__menu__item shadow"
                   href="/edytor-dopasowania">
                    <img className="img" src={icon3} alt="uwtorz-nowe-dopasowanie" />

                    <span>
                        Utwórz nowe dopasowanie
                    </span>
                </a>
                <a className="homepage__menu__item shadow"
                   href="/zespol">
                    <img className="img" src={icon4} alt="zarzadzaj-zespolem" />

                    <span>
                        Zarządzaj zespołem i użytkownikami
                    </span>
                </a>
            </div>
        </div>
    </div>
};

export default Homepage;
