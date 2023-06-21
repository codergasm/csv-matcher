import React from 'react';
import icon1 from "../static/img/file.svg";
import icon2 from "../static/img/diagram.svg";
import icon3 from "../static/img/puzzle.svg";
import icon4 from "../static/img/team.svg";
import LinkTile from "./LinkTile";

const HomepageMenu = () => {
    return <div className="homepage__menu">
        <LinkTile href={'/pliki'}
                  icon={icon1}>
            Moje pliki
        </LinkTile>
        <LinkTile href={'/schematy-dopasowania'}
                  icon={icon2}>
            Moje schematy dopasowania
        </LinkTile>
        <LinkTile href={'/edytor-dopasowania'}
                  icon={icon3}>
            Utwórz nowe dopasowanie
        </LinkTile>
        <LinkTile href={'/zespol'}
                  icon={icon4}>
            Zarządzaj zespołem i użytkownikami
        </LinkTile>
    </div>
};

export default HomepageMenu;
