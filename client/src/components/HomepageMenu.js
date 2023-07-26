import React, {useContext} from 'react';
import icon1 from "../static/img/file.svg";
import icon2 from "../static/img/diagram.svg";
import icon3 from "../static/img/puzzle.svg";
import icon4 from "../static/img/team.svg";
import LinkTile from "./LinkTile";
import {TranslationContext} from "../App";

const mainMenuLinks = ['/pliki', '/schematy-dopasowania', '/edytor-dopasowania', '/zespol'];
const mainMenuIcons = [icon1, icon2, icon3, icon4];

const HomepageMenu = () => {
    const { content } = useContext(TranslationContext);

    return <div className="homepage__menu">
        {content.mainMenu.map((item, index) => {
            return <LinkTile key={index}
                             href={mainMenuLinks[index]}
                             icon={mainMenuIcons[index]}>
                {item}
            </LinkTile>
        })}
    </div>
};

export default HomepageMenu;
