import React,{useContext, useEffect, useState} from "react";
import './VerifySpare.css';

// import SearchIcon from '@mui/icons-material/Search';
import Notify from "../../Notifications/Notify";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import { useNavigate, useParams } from "react-router-dom";
import MyContext from "../../../MyContext";
// import { counrtycode } from "../../../Data/countrycode";

// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {  runTransaction, writeBatch } from "firebase/firestore";
// import { sparequotationid } from "../../../Data/Docs";
import { db } from "../../../Firebase";
import { doc} from "firebase/firestore";

import { v4 as uuidv4 } from 'uuid';
import { GCP_API_ONE_TO_ONE } from "../../../Data/Docs";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Error from "../../../Error/Error";

function VerifySpare(){
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);
    const navigate = useNavigate();
    const {spareid} = useParams();
    const [showloading,setshowloading] = useState(false);
    const [token,setToken] = useState('');
    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Updated the spare Quotation');
    const loginerror = () =>toast.error('Getting Error while Creating spare Quotation');
    const loginformerror = () => toast.info('please fill the all Required Fields');
    // const invalidmail = () => toast.warn('unique id was not generating!!!');
    //array of spare parts data
    const [spares,setspares] = useState([{//here spares means both machines and spares
        id:0,
        reqtype:'spare',
        sparepart:'',
        machinepart:'',
        qty:0,
        sparemodel:'',
        sparesubtype:'',
        machineproduct:'',
        machinecap:'',
        machinespecification:'',
        unitprice:0,
    }]);

    
    
    //whole form data
    const [sparequotedata,setsparequotedata] = useState({
        sparequottype:'',
        companyname:'',
        othercompanyname:'',
        sparecountry:'India',
        sparestate:'',
        sparedist:'',
        sparecity:'',
        sparereqmachine:'',
        sparestatus:'open',
        spareadmincommt:''
    });
    
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }

    //function to handle the notifications
    async function handleSendMsgToAdmin(data , notifyID , notmsg){
        try{
            
            await runTransaction(db,async(transaction)=>{
                const notifyDoc = await transaction.get(doc(db,"notifications",notifyID));
                if(!notifyDoc.exists()){
                    return "Document does not exist!!";
                }
                const dataset = notifyDoc.data();
                const newNotify = notifyDoc.data().notify;
                if(Object.prototype.hasOwnProperty.call(dataset,'token')){
                    setToken(dataset.token);
                }
                const now = new Date();
                const options ={
                    timeZone:'Asia/Kolkata',
                    day:'2-digit',
                    month:'2-digit',
                    year:'numeric'
                }
                const formattedDate = now.toLocaleDateString('en-GB',options).split('/').join('-');
                const options2 = {
                    timeZone:'Asia/Kolkata',
                    hour:'2-digit',
                    minute:'2-digit',
                    second:'2-digit',
                    hour12:false
                }
                const formattedTime = now.toLocaleTimeString('en-GB',options2);
                const nuid = uuidv4();
                // console.log(newNotify);
                transaction.update(doc(db,"notifications",notifyID),{
                    notify:[
                        {
                            time:formattedTime,
                            date:formattedDate,
                            title:notmsg,
                            body:data.msg.body,
                            nid:nuid,
                            seen:false
                        },
                        ...newNotify
                        ]
                    })
                })
            // console.log('updated the lead',data);
            if(token!==''){
                const newData={
                    ...data,
                    regToken:token
                }
                const response = await fetch(`${GCP_API_ONE_TO_ONE}/send-single-notification`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(newData)
                });
                console.log(await response.json());
            }

        }catch(e){
            console.log('you got an error while send msg to adim..',e);
        }
    }
    
    
    //function handle the submit data
    async function handlesubmitdata(event){
        event.preventDefault();
        setshowloading(true);
        try{
            if(
                sparequotedata.sparequottype!=='' &&
                sparequotedata.companyname!=='' &&
                sparequotedata.sparecountry!=='' &&
                sparequotedata.sparestate!=='' &&
                sparequotedata.sparedist!=='' &&
                sparequotedata.sparecity!=='' &&
                sparequotedata.sparereqmachine!=='' &&
                sparequotedata.sparestatus!==''
            ){

                if(sharedvalue.sparesdata[spareid].sparestatus!==sparequotedata.sparestatus){
                    const data={
                        regToken:'',
                        msg:{
                            title:`${sharedvalue.role} Verified the Spare Quotation`,
                            body:`${sharedvalue.workersdata[sharedvalue.uid].name} Verified the Spare Quotation and changed the  Status to ${sparequotedata.sparestatus}.[ID${spareid}]`
                        }
                    }
                    const notmsg = "Quotation verified";
                    await handleSendMsgToAdmin(data,sharedvalue.sparesdata[spareid].sparecreatedby,notmsg)
                }
            
                    await batch.update(doc(db,"sparequotation",`${sharedvalue.sparesdata[spareid].docid}`),{
                        [spareid]:{
                            ...sharedvalue.sparesdata[spareid],
                            sparestatus:sparequotedata.sparestatus,
                            spareadmincommt:sparequotedata.spareadmincommt
                        }
                    })
                    
                    await batch.commit();
                    window.scrollTo({top:0,behavior:'smooth'});
                    loginsuccess();
            }else{
                loginformerror();
            }
        }catch(err){
            console.log('you got an error while adding the spare quotation',err);
            loginerror();
        }
        setshowloading(false);
    }

    useEffect(()=>{
        if(sharedvalue.spareskeys.length>0 && sharedvalue.spareskeys.includes(spareid)){
            setsparequotedata(prev => ({
                ...prev,
                sparequottype:sharedvalue.sparesdata[spareid].sparequottype,
                companyname:sharedvalue.sparesdata[spareid].companyname,
                othercompanyname:sharedvalue.sparesdata[spareid].othercompanyname,
                sparecountry:sharedvalue.sparesdata[spareid].sparecountry,
                sparestate:sharedvalue.sparesdata[spareid].sparestate,
                sparedist:sharedvalue.sparesdata[spareid].sparedist,
                sparecity:sharedvalue.sparesdata[spareid].sparecity,
                sparereqmachine:sharedvalue.sparesdata[spareid].sparereqmachine,
                spares:sharedvalue.sparesdata[spareid].spares,
                docid:sharedvalue.sparesdata[spareid].docid,
                sparecreatedby:sharedvalue.sparesdata[spareid].sparecreatedby,
                sparestatus:sharedvalue.sparesdata[spareid].sparestatus,
                spareadmincommt:sharedvalue.sparesdata[spareid].spareadmincommt
            }))

            setspares(sharedvalue.sparesdata[spareid].spares)
        }
    },[sharedvalue.spareskeys,spareid,sharedvalue.sparesdata,sharedvalue.uid])


    return(
        <>
        {(sharedvalue.spareskeys.length>0 && sharedvalue.spareskeys.includes(spareid)===true && sharedvalue.role==='admin' && sharedvalue.sparesdata[spareid].sparestatus!=='closed')===true?
            <div className='manlead-con'>
                <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                <div className='manage-con-inner'>

                    {/* inner navbar container */}
                    <div className='top-bar'>
                        <div className='top-nav-tog'>
                            <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                        </div>
                        <div className='search-icon-top-nav'>
                            {/* <SearchIcon onClick={()=>navigate('/search')}/> */}
                            <Notify/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createmanager starts from here */}
                    <form className='create-lead-con'>
                        <div className='create-lead-head'>
                            <h1>Verify Spare Quotation</h1>
                        </div>
                        <div className='create-lead-head-button-comes-here updatequote-backwards'>
                            <button onClick={(e)=>{
                                e.preventDefault();
                                navigate(-1);

                                }}>
                                <ChevronLeftIcon/>
                                Go Back
                            </button>
                        </div>
                        {/* form starts here */}
                        <div className="create-quotation-form-starts-here">
                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                {/* quotation type */}
                                <div>
                                    <label>Performa Invoice or Quotation<span style={{color:'red'}}>*</span></label>
                                    <input value={sparequotedata.sparequottype} readOnly/>
                                        
                                </div>
                                {/* company name */}
                                <div>
                                    <label>Company Name<span style={{color:'red'}}>*</span></label>
                                    <input value={sparequotedata.companyname} readOnly/>
                                        
                                </div>
                                {/*enter your company name */}
                                {
                                    sparequotedata.companyname==='other' && 
                                    <div>
                                        <label>Enter your Company Name<span style={{color:'red'}}>*</span></label>
                                        <input type="text" value={sparequotedata.othercompanyname} readOnly/>
                                    </div>
                                }
                                
                                {/*select the country */}
                                <div>
                                    <label>country<span style={{color:'red'}}>*</span></label>
                                    <input value={sparequotedata.sparecountry} readOnly/>
                                        
                                </div>
                                {/*enter your state */}
                                <div>
                                    <label>state<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={sparequotedata.sparestate} readOnly/>
                                </div>
                                {/*enter your district */}
                                <div>
                                    <label>district<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={sparequotedata.sparedist} readOnly/>
                                </div>
                                {/*enter your city/town/village */}
                                <div>
                                    <label>enter city/town/village name<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={sparequotedata.sparecity} readOnly/>
                                </div>
                                {/*spares required of which machine */}
                                <div>
                                    <label>Machine<span style={{color:'red'}}>*</span></label>
                                    <input value={sparequotedata.sparereqmachine} readOnly/>
                                        
                                </div>
                            </div>
                            {/* spares starts from here */}
                            <div className='create-lead-requirements-head spare-req-head'>
                                <h1>Enter Required Spare Parts</h1>
                            </div>
                            {
                                spares.map((item,idx)=>(
                                        <div key={idx}>
                                            <div className="eachspare-part-header">
                                                <h1>{item.reqtype} part_{Number(idx)+1}</h1>
                                            </div>
                        
                                            <div  className='create-lead-requirements-all-fields creatquotation-forms'>
                                                {/* quotation type */}
                                                <div>
                                                    <label>required type</label>
                                                    <input type="text" value={item.reqtype} readOnly/>
                                                </div>
                                                {item.reqtype==='spare' && 
                                                <>
                                                    <div>
                                                        <label>Enter required spare<span style={{color:'red'}}>*</span></label>
                                                        <input type="text" value={item.sparepart} readOnly/>
                                                    </div>
                                                    {item.sparepart!=='' && 
                                                    <div>
                                                        <label>model</label>
                                                        <input type="text" value={item.sparemodel} readOnly/>
                                                    </div>}

                                                    {item.sparepart!=='' && item.sparemodel!=='' && 
                                                    <div>
                                                        <label>sub type</label>
                                                        <input type="text" value={item.sparesubtype} readOnly/>
                                                    </div>}
                                                </>}
                                                {
                                                item.reqtype==='machine' &&
                                                <>
                                                    <div>
                                                        <label>Enter required machine<span style={{color:'red'}}>*</span></label>
                                                        <input value={item.machinepart} type="text" readOnly/>
                                                    </div>
                                                    {item.machinepart!=='' && 
                                                    <div>
                                                        <label>product</label>
                                                        <input value={item.machineproduct} type="text" readOnly/>
                                                    </div>}
                                                    <div>
                                                        <label>capacity</label>
                                                        <input type="text" value={item.machinecap} readOnly/>
                                                    </div>
                                                    <div>
                                                        <label>specification</label>
                                                        <input value={item.machinespecification} type="text" readOnly/>
                                                    </div>
                                                </>
                                                }
                                                <div>
                                                    <label>quantity<span style={{color:'red'}}>*</span></label>
                                                    <input type="number" value={item.qty} readOnly/>
                                                </div>
                                                <div>
                                                    <label>unit price<span style={{color:'red'}}>*</span></label>
                                                    <input value={item.unitprice} type="text" readOnly/>
                                                </div>
                                                <div>
                                                    <label>totalprice<span style={{color:'red'}}>*</span></label>
                                                    <input type="number" value={Number(item.unitprice)*Number(item.qty)} readOnly/>
                                                </div>
                                            </div>
                                        </div>
                                ))
                            }
                            
                            <div className='create-lead-requirements-head spare-req-head'>
                                <h1>Verify the quotation here</h1>
                            </div>
                            <div  className='create-lead-requirements-all-fields creatquotation-forms'>
                                <div>
                                    <label>status*</label>
                                    <select value={sparequotedata.sparestatus} onChange={(e)=>setsparequotedata(prev=>({
                                        ...prev,
                                        sparestatus:e.target.value
                                    }))}>
                                        <option value=''>Select Status</option>
                                        <option value='open'>Open</option>
                                        <option value='rework'>Rework</option>
                                        <option value='approved'>Approved</option>
                                    </select>
                                </div>
                                
                                {/* additional info */}
                                <div>
                                    <label>comment*</label>
                                    <textarea  placeholder="write at least one comment" value={sparequotedata.spareadmincommt} onChange={(e)=>setsparequotedata(prev=>({
                                        ...prev,
                                        spareadmincommt:e.target.value
                                    }))}/>
                                </div>
                            </div>
                            <button className="creatquotation-final-button" onClick={(e)=>handlesubmitdata(e)}>
                                Verify Spare quotation
                            </button>
                        </div>
                    </form>
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

export default VerifySpare;