import React,{useContext, useState} from "react";
import './Passwords.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../Sidenav/Sidenav";
import MyContext from "../../MyContext";
import { useNavigate } from "react-router-dom";
import {signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../Firebase';
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { doc, writeBatch } from "firebase/firestore";
function Passwords(){
    const [open, setOpen] = React.useState(false);
    const [filter,setfilter] = useState('');
    const batch = writeBatch(db);

    // search bar input 
    const [searchworker,setsearchworker]=useState('');
    //code only for toggle the menu bar
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }

    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Logged In');
    const loginerror = () =>toast.error('please check your credientials');
    // const loginformerror = () => toast.info('please fill the form correctly');
    const invalidmail = () => toast.warn('Invalid Mail');

    async  function handleloginform(email,password){
        setOpen(true);
        try{
           
                await signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    if(user){
                        loginsuccess();
                    }
                    navigate('/');
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    if(errorCode==='auth/invalid-credential'){
                        loginerror();
                    }
                    else if(errorCode === 'auth/invalid-email') {
                        invalidmail();
                    }
                    else{
                        alert('You Got An Error While Sign In');
                    }
                });
            
            
        }catch(e){
            alert('you got an error')
        }
        setOpen(false);
    }

    //convert employee to manager
    async function convertEmployeeToManager(e,uid){
        e.preventDefault();
        setOpen(true);
        try{
            //updating the leads
            const templeads = sharedvalue.leadskeys.filter((item)=>sharedvalue.leadsdata[item].employeeid===uid);
            // console.log('here is the temp_leads: ',templeads);
            for(const eachleadid of templeads){//updating the leads
                await batch.update(doc(db,"leads",`${sharedvalue.leadsdata[eachleadid].docid}`),{
                    [eachleadid]:{
                        ...sharedvalue.leadsdata[eachleadid],
                        employeeid:'',
                        managerid:uid
                    }
                })
            }
            //updating tickets
            const temptickets = sharedvalue.ticketskeys.filter((item)=>sharedvalue.ticketsdata[item].ctktemployee===uid);
            // console.log('temptickets data: ',temptickets);
            for(const eachtktid of temptickets){//updating tickets starts from here
                await batch.update(doc(db,"tickets",`${sharedvalue.ticketsdata[eachtktid].docid}`),{
                    [eachtktid]:{
                        ...sharedvalue.ticketsdata[eachtktid],
                        ctktemployee:'',
                        ctktmanager:uid
                    }
                })
            }
            //updating the workers data
            batch.update(doc(db,'workers',`${sharedvalue.workersdata[uid].docid}`),{
                [uid]:{
                    ...sharedvalue.workersdata[uid],
                    "managerid":'',
                    "mcat":'both',
                    "role":'manager',
                }
            })
            await batch.commit();


        }catch(err){
            console.log('you getting an error while converting employee from manager ',err);
        }
        setOpen(false);
    }
    return(
        <>
            {
            sharedvalue.workerskeys.length>0 &&
            <div className='manlead-con'>
                <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                <div className='manage-con-inner'>

                    {/* inner navbar container */}
                    <div className='top-bar'>
                        <div className='top-nav-tog'>
                            <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                        </div>
                        <div className='search-icon-top-nav'>
                            <SearchIcon onClick={()=>navigate('/search')} />
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createmanager starts from here */}
                    <div className='create-lead-con'>
                    <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>Users Credentials</h1>
                            </div>
                        </div>
                        {/* list starts from here */}
                        <div className="view-manager-list-con">
                            <div className="view-list-of-all-search view-passwords-filter">
                                <div>
                                    <label>Filter:</label>
                                    <select value={filter} onChange={(e)=>setfilter(e.target.value)}>
                                        <option value=''>All</option>
                                        <option value='admin'>Admin</option>
                                        <option value='manager'>Manager</option>
                                        <option value='employee'>Employee</option>
                                        <option value='finance'>Finance</option>
                                        <option value='customer'>Customer</option>
                                    </select>
                                </div>
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
                                            <th>name</th>
                                            <th>email</th>
                                            <th>Password</th>
                                            <th>Profile</th>
                                            <th>Login</th>
                                            <th>promote to</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                            sharedvalue.workerskeys.length>0 &&
                                            sharedvalue.workerskeys.filter((item)=> (sharedvalue.workersdata[item].name.includes(searchworker) ||sharedvalue.workersdata[item].email.includes(searchworker) ))
                                            .filter((item)=> sharedvalue.workersdata[item].role.includes(filter))
                                            .map((worker,idx)=>(
                                                <tr key={idx}>
                                                    {/* <td>
                                                        <p className="view-manager-list-sino">
                                                            {Number(idx)+1}
                                                        </p>
                                                    </td> */}
                                                    <td>
                                                        <p className="view-manager-list-name">{sharedvalue.workersdata[worker].name}</p>
                                                    </td>
                                                    <td>
                                                        <p className="view-manager-list-email">
                                                            {sharedvalue.workersdata[worker].email}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="view-manager-list-email">
                                                            {sharedvalue.workersdata[worker].password}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="view-manager-list-role">
                                                            {sharedvalue.workersdata[worker].role}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="view-manager-list-role-login" onClick={()=>handleloginform(sharedvalue.workersdata[worker].email,sharedvalue.workersdata[worker].password)}>
                                                            Login
                                                        </p>
                                                    </td>
                                                    {/* <td >
                                                        <DeleteOutlineRoundedIcon sx={{color:'red',cursor:'pointer'}}
                                                         onClick={()=>setworkerdelete(prev=>({
                                                            ...prev,
                                                            active:true,
                                                            uid:worker
                                                        }))}/>
                                                    </td> */}
                                                    <td>
                                                        {
                                                            sharedvalue.workersdata[worker].role==='employee' && <button onClick={(e)=>convertEmployeeToManager(e,sharedvalue.workersdata[worker].uid)}>manager</button>
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
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

export default Passwords;