import React, { useContext, useEffect, useState } from 'react';
import './Financeverify.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from '../../Sidenav/Sidenav';
import MyContext from '../../../MyContext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useParams ,useNavigate } from "react-router-dom";
import {writeBatch} from "firebase/firestore"; 
import { db } from '../../../Firebase';
import { createexpense } from '../../../Data/Docs';
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Error from '../../../Error/Error';
function Financeverify(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    const {expid} = useParams();
    const [open, setOpen] = useState(false);//this is for loading image
    const [closeddate,setcloseddate] = useState('');
    const batch = writeBatch(db);// Get a new write batch
    // adding notifications 
    const loginsuccess = async() =>toast.success('Successfully Closed The Expense');
    const loginerror = async() =>toast.error('Getting error while updaing the Closing The EXPENSE data');
    // code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    //lets edit the expensesdata
    //lets edit the expensesdata
    async function handleupdateverify(){
        setOpen(true);
        try{
            if(expid!==0){
                const currentDate = new Date();
                const formatDateTimeString = (dateTime) => {
                    const options = {
                        timeZone: 'Asia/Kolkata', // Set the time zone to Indian Standard Time
                        hour12: false, // Use 24-hour format
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      };
                      return dateTime.toLocaleTimeString('en-US', options);
                };
                
                await batch.update(createexpense,{
                    [expid]:{
                        ...sharedvalue.expensesdata[expid],
                        expcloseremarks:`paid on ${closeddate}, ${formatDateTimeString(currentDate)} `,
                        expstatus:'closed'
                    }
                });
                await batch.commit();
                
                await loginsuccess();
                navigate(-1);
                
            }
        }catch(e){
            console.log('you got an error while Closing expense: ',e);
            loginerror();
        }
        setOpen(false)
    }
    useEffect(()=>{
        const currentDate = new Date();
        const formatDateString = (date) => date.toISOString().split('T')[0];
        setcloseddate(formatDateString(currentDate));
    },[]);
    return(
        <>
        {(sharedvalue.expenseskeys.length>0 && sharedvalue.workerskeys.length>0 && sharedvalue.expenseskeys.includes(expid)  && sharedvalue.expensesdata[expid].expstatus!=='closed')===true?
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
                    {/* verify expense  starts from here */}
                    <div className='create-lead-con'>
                        {/* create lead head */}
                        <div className='create-lead-head'>
                            <h1>Verify and Close  Expense</h1>
                        </div>
                        <div className='create-lead-head-button-comes-here'>
                            <button onClick={()=>navigate(-1)}>
                                <ChevronLeftIcon/>
                                Go Back
                            </button>
                        </div>
                        {/* customer ends here */}
                        <div className='view-each-ticket-form-starts-here'>
                                <div>
                                    <label>Final Amount(to be paid)*</label>
                                    <input type='text' value={sharedvalue.expensesdata[expid].expfinalamount}  readOnly/>
                                   
                                </div>
                                <div>
                                    <label>status*</label>
                                    <input type='text' value={sharedvalue.expensesdata[expid].expstatus} readOnly/>
                                    
                                </div>
                                <div>
                                    <label>finance manage*</label>
                                    <input type='text' value={sharedvalue.workersdata[sharedvalue.expensesdata[expid].expfinanceid].name}/>
                                    
                                </div>
                                <div>
                                    <label>Remarks</label>
                                    <textarea type='text' value={`Paid on ${closeddate}`} readOnly/>
                                </div>
                        </div>
                        {/* create lead button starts here */}
                        <div className='create-lead-submit-btns'>
                            <button onClick={()=>handleupdateverify()}>Close</button>
                        </div>
                        {/* create lead button ends here */}
                    </div>
                </div>
            </div>
            :<Error/>
            }
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
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

export default Financeverify;