import React, { useContext,useState } from 'react';
import './Notifications.css';
import MyContext from '../../MyContext';
// import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from '../Sidenav/Sidenav';
// import { useNavigate } from 'react-router-dom';
// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Notify from './Notify';




function Notifications(){
    const sharedvalue = useContext(MyContext);
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    
    return(
        <>
            <div className='manlead-con'>
                <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                <div className='manage-con-inner'>

                    {/* inner navbar container */}
                    <div className='top-bar'>
                        <div className='top-nav-tog'>
                            <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                        </div>
                        <div className='search-icon-top-nav'>
                           <Notify/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createmanager starts from here */}
                    <form className='create-lead-con'>
                        {/* create lead head */}
                        <div className='create-lead-head'>
                            <h1>Notifications</h1>
                        </div>
                        
                        {/* customer inquiry form */}
                        {/* <div className='customer-inquiry-form'>
                            <div className='cust-inq-form-head'>
                                <h1>customer inquiry form</h1>
                            </div>
                        </div> */}
                    </form>
                </div>
            </div>
        </>
    );
}

export default Notifications;