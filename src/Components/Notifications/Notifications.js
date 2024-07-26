import React, { useContext,useEffect,useState } from 'react';
import './Notifications.css';
import MyContext from '../../MyContext';
// import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from '../Sidenav/Sidenav';
// import { useNavigate } from 'react-router-dom';
// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Notify from './Notify';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../../Firebase';




function Notifications(){
    const sharedvalue = useContext(MyContext);
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    useEffect(()=>{
        if(sharedvalue.notifications.length>0){
            const unSeenData = sharedvalue.notifications.filter((item)=>item.seen===false).length;
            if(unSeenData>0){
                const batch = writeBatch(db);
                batch.update(doc(db,"notifications",sharedvalue.uid),{
                    notify:sharedvalue.notifications.map((item,idx)=>({
                        ...item,
                        seen:true
                    }))
                })
                batch.commit();
            }
        }
    },[sharedvalue.notifications,sharedvalue.uid]);
    
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

                        <div className='whole-notification-list'>
                            { sharedvalue.notifications.length>0 && 
                                sharedvalue.notifications.map((item,idx)=>(
                                    <div className='notification-each-list' key={idx}>
                                        <div className='notification-each-list-div1'>
                                            <h1>{item.title}</h1>
                                            <h2>{item.body}</h2>
                                        </div>
                                        <div className='notification-each-list-div2'>
                                            <h3>{item.date}</h3>
                                            <p>{item.time}</p>
                                        </div>
                                    </div>
                                ))
                            }
                            

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