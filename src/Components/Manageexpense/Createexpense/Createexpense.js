import React, {useContext, useEffect, useState } from "react";
import './Createexpense.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import { onSnapshot ,writeBatch} from "firebase/firestore";
import { db } from "../../../Firebase";
import { createexpenseid ,createexpense, API_ONE_TO_ONE } from "../../../Data/Docs";
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";

function Createexpense(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    const batch = writeBatch(db);//get a new write batch
    //backdrop loading toggle
    const[showloading,setshowloading] = useState(false);
    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Created the expense');
    const loginerror = () =>toast.error('Getting Error while Creating expense');
    const loginformerror = () => toast.info('please fill the form correctly');
    const invalidmail = () => toast.warn('unique id was not generating!!!');
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

    //fetch a unique id from database
    const fetchexpenseid = async()=>{
        try{
            return new Promise((resolve,reject)=>{
                onSnapshot(createexpenseid,(doc)=>{
                    const temptexpid = doc.data();
                    resolve(temptexpid.expenseid+1);
                })
            })
        }catch(e){
            console.log('you got an error while fetching the expense id:',e);
            invalidmail();//error message notification
        }
    }

    // send msg to admin
    async function handleSendMsgToAdmin(data){
        try{
            // console.log('response is here...');
            const response = await fetch(`${API_ONE_TO_ONE}/v1`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            });
            console.log(await response.json());

        }catch(e){
            console.log('you got an error while send msg to adim..',e);
        }
    }

    //function to handle to submit the data
    async function handlesubmitdata(event){
        event.preventDefault();
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
                    const result = await fetchexpenseid();
                    if(result!==0){
                        const message = `${sharedvalue.workersdata[sharedvalue.uid].name} created the expense.[exp.id${result}]`;
                        const phone = `9440000815`;//here we have to give the admin number
                        const data={
                            message:message,
                            phone:phone
                        }
                        await handleSendMsgToAdmin(data);
                    }
                    if(result!==0){
                        await batch.update(createexpense,{
                            [result]:{
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
                                expid:result,
                                expfinalamount:Number(expenseinfo.exptransportcost)+Number(expenseinfo.expfoodcost)-Number(expenseinfo.expamountpaid),
                                expstatus:'open',
                                expfinanceid:expenseinfo.expfinanceid,
                                expcreatedbyid:sharedvalue.uid,
                                expcustomername:expenseinfo.expcustomername,
                                expaddeddate:expenseinfo.expaddeddate,
                                explatestcomment:'',
                                expcloseremarks:''
                            }
                        });

                        await batch.update(createexpenseid,{
                            "expenseid":result
                        })
                        await batch.commit();//commit all batches at once
                        window.scrollTo({top:0,behavior:'smooth'})
                        loginsuccess();//success notification
                        setexpenseinfo(prev=>({
                            ...prev,
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
                            explatestcomment:''
                        }));
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
    },[]);
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
                    {/* your createexpense starts from here */}
                    <form className='create-lead-con'>
                        <div className='each-lead-head-comes-here'>
                            <h1>Create Expense</h1>
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
                                        <label>Date<span style={{color:'red'}}>*</span></label>
                                        <input type='date'  value={expenseinfo.fromdate} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            fromdate:e.target.value
                                        }))} required/>
                                    </div>
                                    <div>
                                        <label>Time<span style={{color:'red'}}>*</span></label>
                                        <input type='time'  value={expenseinfo.fromtime} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            fromtime:e.target.value
                                        }))} required/>
                                    </div>
                                    <div>
                                        <label>Place<span style={{color:'red'}}>*</span></label>
                                        <input type='text'  value={expenseinfo.fromplace} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            fromplace:e.target.value
                                        }))} required/>
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
                                        <label>Date<span style={{color:'red'}}>*</span></label>
                                        <input type='date' value={expenseinfo.todate} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            todate:e.target.value
                                        }))} required />
                                    </div>
                                    <div>
                                        <label>Time<span style={{color:'red'}}>*</span></label>
                                        <input type='time' value={expenseinfo.totime} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            totime:e.target.value
                                        }))} required/>
                                    </div>
                                    <div>
                                        <label>Place<span style={{color:'red'}}>*</span></label>
                                        <input type='text'  value={expenseinfo.toplace} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            toplace:e.target.value
                                        }))} required/>
                                    </div>
                            </div>
                        </div>
                        {/* mode food and cost comes here */}
                        <div className='expense-sheet-form-con'>
                                <div className='create-lead-requirements-all-fields'>
                                    <div>
                                        <label>Mode<span style={{color:'red'}}>*</span></label>
                                        <select value={expenseinfo.expmode} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            expmode:e.target.value
                                        }))} required>
                                            <option value=''>Select Mode</option>
                                            <option value='Auto'>Auto</option>
                                            <option value='Bus'>Bus</option>
                                            <option value='Car'>Car</option>
                                            <option value='Train'>Train</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Transport Cost<span style={{color:'red'}}>*</span></label>
                                        <input type='number' value={expenseinfo.exptransportcost} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            exptransportcost:e.target.value
                                        }))} required/>
                                    </div>
                                    <div>
                                        <label>Food Cost<span style={{color:'red'}}>*</span></label>
                                        <input type='number'  value={expenseinfo.expfoodcost} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            expfoodcost:e.target.value
                                        }))} required/>
                                    </div>
                                    <div>
                                        <label>Purpose<span style={{color:'red'}}>*</span></label>
                                        <select value={expenseinfo.exppurpose} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            exppurpose:e.target.value
                                        }))} required>
                                            <option value=''>Select Purpose</option>
                                            <option value='Service'>Service</option>
                                            <option value='Sale'>Sale</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Amount Paid<span style={{color:'red'}}>*</span></label>
                                        <input type='number' value={expenseinfo.expamountpaid} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            expamountpaid:e.target.value
                                        }))} required/>
                                    </div>
                                    <div>
                                        <label>Amount Pending</label>
                                        <input type='number' value={Number(expenseinfo.exptransportcost)+Number(expenseinfo.expfoodcost)-Number(expenseinfo.expamountpaid)} readOnly/>
                                    </div>
                                    <div>
                                        <label>Customer Name<span style={{color:'red'}}>*</span></label>
                                        <input type='text' value={expenseinfo.expcustomername} onChange={(e)=>setexpenseinfo(prev=>({
                                            ...prev,
                                            expcustomername:e.target.value
                                        }))}  required/>
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
                            <button onClick={(e)=>handlesubmitdata(e)}>create Expense</button>
                        </div>
                        {/* create lead button ends here */}
                    </form>
                    {/* your create expenmse ends here */}
                </div>
            </div>
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

export default Createexpense;