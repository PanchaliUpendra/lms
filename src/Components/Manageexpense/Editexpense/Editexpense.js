import React, {useContext, useEffect, useState } from "react";
import './Editexpense.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import { doc, writeBatch} from "firebase/firestore";
import { db } from "../../../Firebase";
// import { createexpense } from "../../../Data/Docs";
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams,useNavigate } from "react-router-dom";
import Error from '../../../Error/Error';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function Editexpense(){
    
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);//get a new write batch
    const {expid} = useParams();//each id will display here
    const navigate = useNavigate();//navigate will comes here
    console.log(typeof expid)
    //backdrop loading toggle
    const[showloading,setshowloading] = useState(false);
    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Created the expense');
    const loginerror = () =>toast.error('Getting Error while Creating expense');
    const loginformerror = () => toast.info('please fill the form correctly');
    //expense details
    const[expenseinfo,setexpenseinfo] = useState({
        fromdate:'',
        fromtime:'',
        fromplace:'',
        todate:'',
        totime:'',
        toplace:'',
        expmode:'',
        exptransportcost:0,
        expfoodcost:0,
        exppurpose:'',
        expamountpaid:0,
        expamountpending:0,
        expremarks:'',
        expid:'',
        expfinalamount:'',
        expstatus:'open',
        expfinanceid:'',
        expcreatedbyid:'',
        expcustomername:'',
        expaddeddate:'',
        explatestcomment:''
    })
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here

    //function to handle to submit the data
    async function handlesubmitdata(){
        setshowloading(true);
        try{
            if(
                expenseinfo.fromdate!=='' &&
                expenseinfo.fromtime!=='' &&
                expenseinfo.fromplace!=='' &&
                expenseinfo.todate!=='' &&
                expenseinfo.totime!=='' &&
                expenseinfo.toplace!=='' &&
                expenseinfo.expamountpaid!=='' &&
                expenseinfo.expcustomername!=='' &&
                expenseinfo.expfoodcost!=='' &&
                expenseinfo.expmode!=='' &&
                expenseinfo.exppurpose!=='' &&
                expenseinfo.exptransportcost!==''
                ){
                    
                    if(expid!==0){
                        await batch.update(doc(db,"expenses",`${sharedvalue.expensesdata[expid].docid}`),{
                            [expid]:{
                                ...sharedvalue.expensesdata[expid],
                                fromdate:expenseinfo.fromdate,
                                fromtime:expenseinfo.fromtime,
                                fromplace:expenseinfo.fromplace,
                                todate:expenseinfo.todate,
                                totime:expenseinfo.totime,
                                toplace:expenseinfo.toplace,
                                expmode:expenseinfo.expmode,
                                exptransportcost:expenseinfo.exptransportcost,
                                expfoodcost:expenseinfo.expfoodcost,
                                exppurpose:expenseinfo.exppurpose,
                                expamountpaid:expenseinfo.expamountpaid,
                                expamountpending:Number(expenseinfo.exptransportcost)+Number(expenseinfo.expfoodcost)-Number(expenseinfo.expamountpaid),
                                expremarks:expenseinfo.expremarks,
                                expid:expid,
                                expfinalamount:Number(expenseinfo.exptransportcost)+Number(expenseinfo.expfoodcost)-Number(expenseinfo.expamountpaid),
                                expstatus:'open',
                                expfinanceid:expenseinfo.expfinanceid,
                                expcreatedbyid:sharedvalue.uid,
                                expcustomername:expenseinfo.expcustomername,
                                expaddeddate:expenseinfo.expaddeddate,
                                explatestcomment:expenseinfo.explatestcomment
                            }
                        });

                        await batch.commit();//commit all batches at once
                        window.scrollTo({top:0,behavior:'smooth'})
                        loginsuccess();//success notification
                }
            }else{
                loginformerror();
            }
        }catch(e){
            console.log('you got an error while uploading the data',e);
            loginerror();
        }
        setshowloading(false);
    }

    //just fetching the today date
    useEffect(()=>{
        const currentDate = new Date();
        // Format dates for display
        const formatDateString = (date) => date.toISOString().split('T')[0];
        setexpenseinfo(prev=>({
            ...prev,
            expaddeddate:formatDateString(currentDate)
        }))
        if(sharedvalue.expenseskeys.length>0 && sharedvalue.expenseskeys.includes(expid)){
            setexpenseinfo(prev=>({
                ...prev,
                fromdate:sharedvalue.expensesdata[expid].fromdate,
                fromtime:sharedvalue.expensesdata[expid].fromtime,
                fromplace:sharedvalue.expensesdata[expid].fromplace,
                todate:sharedvalue.expensesdata[expid].todate,
                totime:sharedvalue.expensesdata[expid].totime,
                toplace:sharedvalue.expensesdata[expid].toplace,
                expmode:sharedvalue.expensesdata[expid].expmode,
                exptransportcost:sharedvalue.expensesdata[expid].exptransportcost,
                expfoodcost:sharedvalue.expensesdata[expid].expfoodcost,
                exppurpose:sharedvalue.expensesdata[expid].exppurpose,
                expamountpaid:sharedvalue.expensesdata[expid].expamountpaid,
                expamountpending:sharedvalue.expensesdata[expid].expamountpending,
                expremarks:sharedvalue.expensesdata[expid].expremarks,
                expid:sharedvalue.expensesdata[expid].expid,
                expfinalamount:sharedvalue.expensesdata[expid].expfinalamount,
                expstatus:sharedvalue.expensesdata[expid].expstatus,
                expfinanceid:sharedvalue.expensesdata[expid].expfinanceid,
                expcreatedbyid:sharedvalue.expensesdata[expid].expcreatedbyid,
                expcustomername:sharedvalue.expensesdata[expid].expcustomername,
                expaddeddate:sharedvalue.expensesdata[expid].expaddeddate,
                explatestcomment:sharedvalue.expensesdata[expid].explatestcomment
            }))
        }
    },[sharedvalue.expensesdata,sharedvalue.expenseskeys,expid]);
    return(
        <>
        { (sharedvalue.expenseskeys.length>0 && sharedvalue.workerskeys.length>0 && sharedvalue.expenseskeys.includes(expid) && sharedvalue.uid===expenseinfo.expcreatedbyid && (expenseinfo.expstatus==='open' || expenseinfo.expstatus==='rejected'))===true?
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
                    {/* your createexpense starts from here */}
                    <div className='create-lead-con'>
                        <div className='each-lead-head-comes-here'>
                            <h1>Edit Expense</h1>
                        </div>
                        <div className='create-lead-head-button-comes-here'>
                            <button onClick={()=>navigate(-1)}>
                                <ChevronLeftIcon/>
                                Go Back
                            </button>
                        </div>
                        {/* expense sheet form starts here */}
                        <div className='expense-sheet-form-con'>
                            <div className='create-lead-requirements-head'>
                                <h1>Expense Sheet</h1>
                            </div>
                            <div className='create-lead-requirements-head-inner'>
                                <h1>From</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                    <div>
                                        <label>Date</label>
                                        <input type='date'  value={expenseinfo.fromdate} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            fromdate:e.target.value
                                        }))}/>
                                    </div>
                                    <div>
                                        <label>Time</label>
                                        <input type='time'  value={expenseinfo.fromtime} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            fromtime:e.target.value
                                        }))}/>
                                    </div>
                                    <div>
                                        <label>Place</label>
                                        <input type='text'  value={expenseinfo.fromplace} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            fromplace:e.target.value
                                        }))} />
                                    </div>
                            </div>
                            
                            {/* mode ,food and cost */}
                            

                        </div>
                        {/* to comes here */}
                        <div className='expense-sheet-form-con'>
                            {/*expense sheet form starts here*/}
                            <div className='create-lead-requirements-head-inner'>
                                <h1>To</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                    <div>
                                        <label>Date</label>
                                        <input type='date' value={expenseinfo.todate} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            todate:e.target.value
                                        }))}  />
                                    </div>
                                    <div>
                                        <label>Time</label>
                                        <input type='time' value={expenseinfo.totime} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            totime:e.target.value
                                        }))} />
                                    </div>
                                    <div>
                                        <label>Place</label>
                                        <input type='text'  value={expenseinfo.toplace} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            toplace:e.target.value
                                        }))}/>
                                    </div>
                            </div>
                        </div>
                        {/* mode food and cost comes here */}
                        <div className='expense-sheet-form-con'>
                                <div className='create-lead-requirements-all-fields'>
                                    <div>
                                        <label>Mode</label>
                                        <select value={expenseinfo.expmode} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            expmode:e.target.value
                                        }))}>
                                            <option value=''>Select Mode</option>
                                            <option value='Auto'>Auto</option>
                                            <option value='Bus'>Bus</option>
                                            <option value='Car'>Car</option>
                                            <option value='Train'>Train</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Transport Cost</label>
                                        <input type='number' value={expenseinfo.exptransportcost} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            exptransportcost:e.target.value
                                        }))} />
                                    </div>
                                    <div>
                                        <label>Food Cost</label>
                                        <input type='number'  value={expenseinfo.expfoodcost} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            expfoodcost:e.target.value
                                        }))} />
                                    </div>
                                    <div>
                                        <label>Purpose</label>
                                        <select value={expenseinfo.exppurpose} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            exppurpose:e.target.value
                                        }))}>
                                            <option value=''>Select Purpose</option>
                                            <option value='Service'>Service</option>
                                            <option value='Sale'>Sale</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Amount Paid</label>
                                        <input type='number' value={expenseinfo.expamountpaid} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            expamountpaid:e.target.value
                                        }))} min={0}/>
                                    </div>
                                    <div>
                                        <label>{Number(expenseinfo.exptransportcost)+Number(expenseinfo.expfoodcost)-Number(expenseinfo.expamountpaid)<0?'employee need\'s to pay':'company need\'s to pay'}</label>
                                        <input type='number' value={Number(expenseinfo.exptransportcost)+Number(expenseinfo.expfoodcost)-Number(expenseinfo.expamountpaid)} readOnly/>
                                    </div>
                                    <div>
                                        <label>Customer Name</label>
                                        <input type='text' value={expenseinfo.expcustomername} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            expcustomername:e.target.value
                                        }))}  />
                                    </div>
                                    
                                </div>
                               
                        </div>
                        <div className='create-expense-remarks-div'>
                            <label>Remarks</label>
                            <textarea type='text' value={expenseinfo.expremarks} onChange={(e)=>setexpenseinfo(prev=>({
                                ...prev,
                                expremarks:e.target.value
                            }))}  />
                        </div>
                        {/* create lead button starts here */}
                        <div className='create-expense-submit-btns'>
                            <button onClick={()=>handlesubmitdata()}>Update Expense</button>
                        </div>
                        {/* create lead button ends here */}
                    </div>
                    {/* your create expenmse ends here */}
                </div>
            </div>:<Error/>}
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
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
        </>
    );
}

export default Editexpense;