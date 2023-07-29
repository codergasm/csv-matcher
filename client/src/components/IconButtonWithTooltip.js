import React from 'react';
import {Tooltip} from "react-tippy";

const IconButtonWithTooltip = ({title, onClick, img}) => {
    return <Tooltip title={title}
                    followCursor={true}
                    size="small"
                    position="top">
        <button className="btn btn--selectAll"
                onClick={onClick}>
            <img className="img" src={img} alt="configure-in-window" />
        </button>
    </Tooltip>
};

export default IconButtonWithTooltip;
