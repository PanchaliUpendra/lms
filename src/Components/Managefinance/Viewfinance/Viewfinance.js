import React, {useContext, useState } from "react";
import './Viewfinance.css';
// import SearchIcon from '@mui/icons-material/Search';
import Notify from "../../Notifications/Notify";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import { writeBatch , doc } from "firebase/firestore";
import { db } from "../../../Firebase";
//imported material ui 
// import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
// import { useNavigate } from "react-router-dom";
//toastify importing
// import { toast, ToastContainer } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";
//show processing
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


function Viewfinance(){
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);
    // const navigate = useNavigate();
     // search bar input 
     const [searchworker,setsearchworker]=useState('');
     const [showprogress,setshowprogress]=useState(false);
     //deleting user input
    const [workerdelete,setworkerdelete] = useState({
        active:false,
        uid:''
    });
    //enabling the users
    const [workerEnable , setWorkerEnable] = useState({
        active:false,
        uid:''
    });
    //disabling the user
    const deleteUserByUID = async () => {
        setshowprogress(true)
        try{
            batch.update(doc(db,"workers",`${sharedvalue.workersdata[workerdelete.uid].docid}`),{
                [workerdelete.uid]:{
                    ...sharedvalue.workersdata[workerdelete.uid],
                    "disable":true
                }
            });
            await batch.commit();
            setworkerdelete({
                active:false,
                uid:''
            })
        }catch(err){
            console.log('you getting an error when changing the users status ',err);
        }
        setshowprogress(false)
      };
    
    //enabling the user
    const enableUserByUID = async () =>{
        setshowprogress(true)
        try{
            batch.update(doc(db,"workers",`${sharedvalue.workersdata[workerEnable.uid].docid}`),{
                [workerEnable.uid]:{
                    ...sharedvalue.workersdata[workerEnable.uid],
                    "disable":false
                }
            });
            await batch.commit();
            setWorkerEnable({
                active:false,
                uid:''
            })
        }catch(err){
            console.log("you getting an error while enabling the users data: ",err);
        }
        setshowprogress(false)
    }
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    return(
        <>
            <div className={`manlead-con ${(workerdelete.active===true||workerEnable.active===true)?'manlead-con-inactive':''}`}>
                <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                <div className='manage-con-inner'>

                    {/* inner navbar container */}
                    <div className='top-bar'>
                        <div className='top-nav-tog'>
                            <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                        </div>
                        <div className='search-icon-top-nav'>
                            {/* <SearchIcon onClick={()=>navigate('/search')} /> */}
                            <Notify/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createmanager starts from here */}
                    <div className='create-lead-con'>
                        <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>Finance Manager</h1>
                            </div>
                        </div>
                        {/* list starts from here */}
                        <div className="view-manager-list-con">
                            <div className="view-list-of-all-search">
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Name/Email" onChange={(e)=>setsearchworker(e.target.value)}/>
                                </div>
                            </div>
                            {/* search bar complet6ed here */}
                            <div className="view-list-table-con">
                                <table>
                                    <thead>
                                        <tr className="table-head-row">
                                            <th>si.no</th>
                                            <th>name</th>
                                            <th>email</th>
                                            <th>status</th>
                                            <th>action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sharedvalue.workerskeys.length>0 &&
                                            sharedvalue.workerskeys.filter((item)=>sharedvalue.workersdata[item].role==='finance' &&(sharedvalue.workersdata[item].name.includes(searchworker) ||sharedvalue.workersdata[item].email.includes(searchworker) )).map((worker,idx)=>(
                                                <tr key={idx}>
                                                    <td>
                                                        <p className="view-manager-list-sino">
                                                            {Number(idx)+1}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="view-manager-list-name">{sharedvalue.workersdata[worker].name}</p>
                                                    </td>
                                                    <td>
                                                        <p className="view-manager-list-email">
                                                            {sharedvalue.workersdata[worker].email}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="view-manager-list-role">
                                                            {sharedvalue.workersdata[worker].role}
                                                        </p>
                                                    </td>
                                                    <td >
                                                    <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                                        {
                                                            (Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[worker],'disable') && sharedvalue.workersdata[worker].disable===true)===true?
                                                            <p 
                                                            style={{cursor:'pointer',padding:7,backgroundColor:'#EEAF00',fontSize:'0.8rem',fontWeight:'500',borderRadius:5,width:'fit-content'}}
                                                            onClick={()=>setWorkerEnable(prev=>({
                                                                ...prev,
                                                                active:true,
                                                                uid:worker
                                                            }))}
                                                            >Enable</p>:
                                                            <p 
                                                            style={{cursor:'pointer',padding:7,backgroundColor:'red',color:'white',fontSize:'0.8rem',fontWeight:'500',borderRadius:5,width:'fit-content'}}
                                                            onClick={()=>setworkerdelete(prev=>({
                                                                ...prev,
                                                                active:true,
                                                                uid:worker
                                                            }))}>Disable</p>
                                                        }
                                                        </div>
                                                        {/* <DeleteOutlineRoundedIcon sx={{color:'red',cursor:'pointer'}}
                                                        onClick={()=>setworkerdelete(prev=>({
                                                            ...prev,
                                                            active:true,
                                                            uid:worker
                                                        }))}/> */}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* your table completes here */}
                        </div>
                        {/* list form ends here */}
                    </div>
                </div>
            </div>
            {/* popup to delete an item */}
            <div className={`view-manager-list-popup-delete ${workerdelete.active===true?'active-delete-popup':''}`}>
                <p>Are You Sure You want to disable the user <span>{workerdelete.uid?sharedvalue.workersdata[workerdelete.uid].email:''}</span></p>
                <div>
                    <button onClick={()=>deleteUserByUID()}>Yes</button>
                    <button onClick={()=>setworkerdelete(prev=>({
                        ...prev,
                        active:false,
                        uid:''
                    }))}>No</button>
                </div>
            </div>
            {/* popup to enable the user */}
            <div className={`view-manager-list-popup-delete ${workerEnable.active===true?'active-delete-popup':''}`}>
                <p>Are You Sure You want to enable the user <span>{workerEnable.uid?sharedvalue.workersdata[workerEnable.uid].email:''}</span></p>
                <div>
                    <button onClick={()=>enableUserByUID()}>Yes</button>
                    <button onClick={()=>setWorkerEnable(prev=>({
                        ...prev,
                        active:false,
                        uid:''
                    }))}>No</button>
                </div>
            </div>
            {/* bacdrop */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showprogress}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* adding the notifications */}
            {/* <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    limit={1}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover
                    theme="light"
                    /> */}
        </>
    );

}

export default Viewfinance;