import React, {useContext, useState } from "react";
import './Profile.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../Sidenav/Sidenav";
import MyContext from "../../MyContext";
import { useNavigate } from "react-router-dom";


function Profile(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
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
                            <SearchIcon onClick={()=>navigate('/search')}/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* profile  starts from here */}
                    <div className="profile-starts-con">
                        
                    </div>
                    <div className="profile-info-div-outer">
                        <div className="profile-info-div">
                            <h1>Heelo world</h1>
                        </div>
                    </div>
                    
                    {/* profile ends here */}
                </div>
            </div>
        </>
    );
}

export default Profile;