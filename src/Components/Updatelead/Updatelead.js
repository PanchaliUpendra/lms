import React, { useContext, useState } from 'react';
import './Updatelead.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from '../Sidenav/Sidenav';
import MyContext from '../../MyContext';
import { useParams } from 'react-router-dom';
function Updatelead(){
    const sharedvalue = useContext(MyContext);
    //show details ends here
    const {leadid} = useParams();
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    return(
        <>
            {
                sharedvalue.ticketskeys.length>0  &&
                <div className='manlead-con'>
                    <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                    <div className='manage-con-inner'>

                        {/* inner navbar container */}
                        <div className='top-bar'>
                            <div className='top-nav-tog'>
                                <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                            </div>
                            <div className='search-icon-top-nav'>
                                <SearchIcon />
                            </div>
                            <PersonIcon/>
                            <p>{sharedvalue.userdtl.email}</p>
                        </div>
                         {/* your createcustomer starts from here */}
                        <div className='create-lead-con'>
                            <div className='each-lead-head-comes-here'>
                                <h1>{leadid}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default Updatelead;