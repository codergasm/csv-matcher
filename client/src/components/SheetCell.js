import React from 'react';
import {Tooltip} from "react-tippy";

const SheetCell = ({children}) => {
    return children ? <Tooltip title={children}
                    followCursor={true}
                    size="small"
                    position="top">
        {children}
    </Tooltip> : '';
};

export default SheetCell;
