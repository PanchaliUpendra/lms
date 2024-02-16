import React from 'react';
import './Error.css';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
function Error(){
    const navigate = useNavigate();
    return(
        <>
            <div className='erro-con'>
                <CircularProgress/>
                <p>If loading takes more time please go to homepage</p>
                <button onClick={()=>navigate('/')}>Go To Homepage</button>
            </div>
        </>
    );
}

export default Error;