import React from 'react';
import './Error.css';
import { useNavigate } from 'react-router-dom';

function Error(){
    const navigate = useNavigate();
    return(
        <>
            <div className='erro-con'>
                <h2>404 Page Not Found</h2>
                <button onClick={()=>navigate('/')}>Go To Homepage</button>
            </div>
        </>
    );
}

export default Error;