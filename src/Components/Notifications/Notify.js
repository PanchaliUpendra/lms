import React, { useContext } from "react";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import Badge from '@mui/material/Badge';
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import MyContext from "../../MyContext";
const CustomBadgetwo = styled(Badge)(({theme})=>({
    '& .MuiBadge-badge':{
        fontSize:'10px',
        height:'16px',
        minWidth:'16px',
        padding:'0 4px',
        color:'white',
        backgroundColor:'red',
    }
}))

function Notify(){
    const sharedvalue=useContext(MyContext);
    const navigate = useNavigate();
    return(
        <>
         <CustomBadgetwo badgeContent={sharedvalue.notifications.length} color="Primary" onClick={()=>navigate('/notifications')}>
            <NotificationsNoneIcon   sx={{fontSize:'20px',color:'black'}}/>
        </CustomBadgetwo>
        </>
    );
}

export default Notify;