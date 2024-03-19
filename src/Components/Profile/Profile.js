import React, {useContext, useState } from "react";
import './Profile.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../Sidenav/Sidenav";
import MyContext from "../../MyContext";
import { NavLink, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import { createworkers } from "../../Data/Docs";
import {  writeBatch } from "firebase/firestore";
import { db } from "../../Firebase";


function Profile(){
    const sharedvalue = useContext(MyContext);

    const batch = writeBatch(db);
    const navigate = useNavigate();
    const [editmobile,seteditmobile] = useState('');
    const[editmobbtn, seteditmobbtn] = useState(false);
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here

    async function modifymobile(){
        try{
            if(editmobile!=='' && editmobile.length>=5){
                batch.update(createworkers,{
                    [sharedvalue.uid]:{
                        ...sharedvalue.workersdata[sharedvalue.uid],
                        "cNum":editmobile
                    }            
                });
                await batch.commit();
            }else{
                alert('check your mobile number...');
            }
        }catch(e){
            console.log('you got an error while updating the number...',e);
        }
    }
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
                                    <p>Phone: 
                                    <span>{Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[sharedvalue.uid], "cNum") && sharedvalue.workersdata[sharedvalue.uid].cNum!==''?sharedvalue.workersdata[sharedvalue.uid].cNum:'123xxxx'}</span>
                                    {editmobbtn===false && <EditIcon size='large' sx={{color:'#0084ff',cursor:'pointer'}} onClick={()=>seteditmobbtn(true)}/>}
                                    </p>
                                    
                                </div>
                                {editmobbtn===true && 
                                    <div className="edit-mobile-number-div-buttons">
                                        <input placeholder="enter the mobile number" type='number' value={editmobile} onChange={(e)=>seteditmobile(e.target.value)}/>
                                        <div>
                                            <button onClick={()=>seteditmobbtn(false)}>cancel</button>
                                            <button onClick={()=>{
                                                modifymobile();
                                                seteditmobbtn(false);
                                            }}>update</button>
                                        </div>
                                    </div>

                                }
                                
                                {sharedvalue.role==='admin' && 
                                <div className="profile-show-passwords-btn">
                                    <NavLink to='/passwords'><p>View Credentials {`>`}</p></NavLink>
                                </div>
                                }
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