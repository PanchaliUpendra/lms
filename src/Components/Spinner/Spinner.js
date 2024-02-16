import React from "react";
import './Spinner.css';
import CircularProgress from '@mui/material/CircularProgress';

function Spinner(){
    return(
        <>
            <div className="spinner-con">
                <CircularProgress disableShrink />
                <h1>Loading</h1>
            </div>
        </>
    );
}

export default Spinner;