import React, {useContext, useState } from "react";
import './Viewemployee.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import {writeBatch} from "firebase/firestore";
import { db } from "../../../Firebase";
import { createworkers } from "../../../Data/Docs";
//imported material ui 
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
//show processing
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Viewemployee(){
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);//get a new write batch
    const [showprogress,setshowprogress]=useState(false);
    // search bar input 
    const [searchworker,setsearchworker]=useState('');
    //deleting user input
    const [workerdelete,setworkerdelete] = useState({
        active:false,
        uid:''
    });
    const deleteUserByUID = async () => {
        
        setworkerdelete({
            active:false,
            uid:''
        })
      };
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here

    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully changed the manager');
    const loginerror = () =>toast.error('you got an error while changing the manager');

    //lets change the manager 
    async function handlechangemanager(e,workerid){
        setshowprogress(true);
        try{
            batch.update(createworkers,{
                [workerid]:{
                    ...sharedvalue.workersdata[workerid],
                    "managerid":e.target.value
                }
            });
            await batch.commit();
            loginsuccess();
        }catch(e){
            console.log('you got error while changing the manager ',e);
            loginerror();
        }
        setshowprogress(false);
    }
    return(
        <>
            <div className={`manlead-con ${workerdelete.active===true?'manlead-con-inactive':''}`}>
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
                    {/* your view employee starts from here */}
                    <div className='create-lead-con'>
                        <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>All Employee</h1>
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
                                            {sharedvalue.role==='admin'?<th>Assign Manager</th>:<th>manager</th>}
                                            {sharedvalue.role==='admin' && <th>action</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sharedvalue.workerskeys.length>0 &&
                                            sharedvalue.workerskeys.filter(item=>(sharedvalue.role==='admin'||sharedvalue.uid===sharedvalue.workersdata[item].managerid)).filter((item)=>sharedvalue.workersdata[item].role==='employee' &&(sharedvalue.workersdata[item].name.includes(searchworker) ||sharedvalue.workersdata[item].email.includes(searchworker) )).map((worker,idx)=>(
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
                                                    {sharedvalue.role==='admin'?<td className="view-select-field-in-viewemployee">
                                                        <select value={sharedvalue.workersdata[worker].managerid} onChange={(e)=>handlechangemanager(e,worker)}>
                                                            <option value=''>Assign Manager</option>
                                                            {sharedvalue.workerskeys.filter(item=>sharedvalue.workersdata[item].role==='manager').map((item,idx)=>(
                                                                <option key={idx} value={item}>{sharedvalue.workersdata[item].name}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    :
                                                    <td>
                                                        <p className="view-manager-list-name">{sharedvalue.workersdata[sharedvalue.uid].name}</p>
                                                    </td>
                                                    }
                                                    {sharedvalue.role==='admin' && 
                                                    <td >
                                                        <DeleteOutlineRoundedIcon sx={{color:'red',cursor:'pointer'}}
                                                        onClick={()=>setworkerdelete(prev=>({
                                                            ...prev,
                                                            active:true,
                                                            uid:worker
                                                        }))}/>
                                                    </td>
                                                    }
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
                <p>Are You Sure You want to delete the user <span>{workerdelete.uid?sharedvalue.workersdata[workerdelete.uid].email:''}</span></p>
                <div>
                    <button onClick={()=>deleteUserByUID(workerdelete.uid)}>Yes</button>
                    <button onClick={()=>setworkerdelete(prev=>({
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
            <ToastContainer
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
                    />
        </>
    );
}

export default Viewemployee;