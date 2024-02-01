import React, { useContext, useEffect, useState } from 'react';
import './Verifyexpense.css';
import Sidenav from '../../Sidenav/Sidenav';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import MyContext from '../../../MyContext';
import { useParams ,useNavigate } from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Error from '../../../Error/Error';
import { writeBatch} from "firebase/firestore";
import { db } from '../../../Firebase';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { createexpense } from '../../../Data/Docs';

function Verifyexpense(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    const {expid} = useParams();
    const [editdata,seteditdata] = useState({
        expfinalamount:'',
        expstatus:'',
        explatestcomment:'',
        expfinanceid:''
    })
    const [open, setOpen] = useState(false);//this is for loading image
    const batch = writeBatch(db);// Get a new write batch
    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Updated The Expense');
    const loginerror = () =>toast.error('Getting error while updaing the VERIFY EXPENSE data');
    const formerror = () =>toast.warn('please fill form correctly ');

    // code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    //lets edit the expensesdata
    async function handleupdateverify(){
        setOpen(true);
        try{
            if(
                editdata.expfinalamount!=='' &&
                editdata.expstatus!=='' &&
                editdata.expfinanceid!==''
            ){
                if(expid!==0){
                    await batch.update(createexpense,{
                        [expid]:{
                            ...sharedvalue.expensesdata[expid],
                            expfinalamount:editdata.expfinalamount,
                            expstatus:editdata.expstatus,
                            explatestcomment:editdata.explatestcomment,
                            expfinanceid:editdata.expfinanceid
                        }
                    });
                    await batch.commit();
                    loginsuccess();
                }
            }else{
                formerror();
            }
            
        }catch(e){
            console.log('you got an error while updating: ',e);
            loginerror();
        }
        setOpen(false);
    }
    // toggle menu bar code ends here
    useEffect(()=>{
        if(sharedvalue.expenseskeys.length>0 && sharedvalue.expenseskeys.includes(expid)){
            seteditdata(prev=>({
                ...prev,
                expfinalamount:sharedvalue.expensesdata[expid].expfinalamount,
                expstatus:sharedvalue.expensesdata[expid].expstatus,
                explatestcomment:sharedvalue.expensesdata[expid].explatestcomment,
                expfinanceid:sharedvalue.expensesdata[expid].expfinanceid
            }));
        }
    },[sharedvalue.expenseskeys,sharedvalue.expensesdata ,expid]);
    return(
        <>
        {(sharedvalue.expenseskeys.length>0 && sharedvalue.workerskeys.length>0 && sharedvalue.expenseskeys.includes(expid)  && sharedvalue.expensesdata[expid].expstatus!=='closed')?
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
                            <h1>Verify Expense</h1>
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
                                    <input type='text' value={editdata.expfinalamount} onChange={(e)=>seteditdata(prev=>({
                                        ...prev,
                                        expfinalamount:e.target.value
                                    }))}/>
                                </div>
                                <div>
                                    <label>status*</label>
                                    <select value={editdata.expstatus} onChange={(e)=>seteditdata(prev=>({
                                        ...prev,
                                        expstatus:e.target.value
                                    }))}>
                                        <option value='approved'>Approved</option>
                                        <option value='open'>Open</option>
                                        <option value='rejected'>Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label>finance manage*</label>
                                    
                                    <select value={editdata.expfinanceid} onChange={(e)=>seteditdata(prev=>({
                                        ...prev,
                                        expfinanceid:e.target.value
                                    }))}>
                                        <option value=''>Select manager</option>
                                        {
                                            sharedvalue.workerskeys.filter(item=>sharedvalue.workersdata[item].role==='finance').map((finance,idx)=>(
                                                <option value={sharedvalue.workersdata[finance].uid} key={idx}>{sharedvalue.workersdata[finance].name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>comment</label>
                                    <textarea type='text' value={editdata.explatestcomment} onChange={(e)=>seteditdata(prev=>({
                                        ...prev,
                                        explatestcomment:e.target.value
                                    }))}/>
                                </div>
                        </div>
                        {/* create lead button starts here */}
                        <div className='create-lead-submit-btns'>
                            <button onClick={()=>handleupdateverify()}>Update</button>
                        </div>
                        {/* create lead button ends here */}
                    </div>
                </div>
                {/* inner navbar container  ends here*/}
        </div>
        : <Error/>
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

export default Verifyexpense;