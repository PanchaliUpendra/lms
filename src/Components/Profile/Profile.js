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
        {sharedvalue.workerskeys.length>0 && sharedvalue.uid!=='' && 
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
                            <div className="profile-info-div-img">
                                <p>{sharedvalue.workersdata[sharedvalue.uid].name[0]}</p>
                            </div>
                            <div className="profile-info-div-details">
                                <div className="profile-info-div-details-name">
                                    <h1>{sharedvalue.workersdata[sharedvalue.uid].name}</h1>
                                    <p>{sharedvalue.workersdata[sharedvalue.uid].role}</p>
                                </div>
                                
                                <div className="profile-info-div-details-email">
                                    <p>Email: <span>{sharedvalue.workersdata[sharedvalue.uid].email}</span></p>
                                    <p>Phone: <span>9390000xxx</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* profile ends here */}
                </div>
            </div>
            }
        </>
    );
}

export default Profile;