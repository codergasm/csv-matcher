import React from 'react';
import { TailSpin } from "react-loader-spinner";

const Loader = ({width}) => {
    return <div className="center">
        <TailSpin width={width ? width : 80} />
    </div>
};

export default Loader;
