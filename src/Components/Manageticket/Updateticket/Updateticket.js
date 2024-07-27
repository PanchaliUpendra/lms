import React, {useContext, useState ,useEffect} from "react";
import './Updateticket.css';
// import SearchIcon from '@mui/icons-material/Search';
import Notify from "../../Notifications/Notify";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import {counrtycode} from '../../../Data/countrycode';
import {states} from '../../../Data/states';
import { runTransaction, writeBatch} from "firebase/firestore";
import { db, storage } from "../../../Firebase";
import {GCP_API_ONE_TO_ONE} from "../../../Data/Docs";
import { doc } from "firebase/firestore";
//import storage 
// import { getDownloadURL,ref,uploadBytes } from 'firebase/storage';
// import { storage } from "../../../Firebase";
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
//loading gif
import loading from '../../../Assets/loading.gif';
import { useNavigate, useParams } from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Error from '../../../Error/Error';
import {getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

function Updateticket(){
    const sharedvalue = useContext(MyContext);
    const {tktid} = useParams();
    const navigate = useNavigate();
    //creating the state of the for status, employee and manager
    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully updated the Ticket');
    const loginerror = () =>toast.error('Getting Error while updatinging ticket');
    const loginformerror = () => toast.info('Please fill the mandatory fields');
    // const invalidmail = () => toast.warn('unique id was not generating!!!');
    const batch = writeBatch(db);//get a new write batch
    const [pleasewait,setpleasewait] = useState(false);
    const [tktfileone,settktfileone] = useState('');
    const [tktfiletwo,settktfiletwo] = useState('');
    const [token,setToken] = useState('');

    // selected ticket information
    const [ticketinfo,setticketinfo] = useState({
        ctktcountry:'',
        ctktstate:'',
        ctktdist:'',
        ctktcustname:'',
        ctktothercustname:'',
        ctktcalltype:'',
        ctktcate:'-',
        ctktdes:'',
        ctktpriority:'',
        ctktasslc:'',
        ctktemployee:'',
        ctktmanager:'',
        status:'',
        devicedtls:'',
        //extra fields for resolving work
        ctktmodedata:'',
        ctktservicereport:''
    })
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }

    //first file upload
    function handlefirstfileupload(e){
        const selectedfileone = e.target.files[0];
        settktfileone(selectedfileone);
    }

    //second file upload
    function handlesecondfileupload(e){
        const selectedfiletwo = e.target.files[0];
        settktfiletwo(selectedfiletwo);
    }


    // toggle menu bar code ends here
    //select ticket file 
    // const [ctktfile,setctktfile]=useState('');
    // function handleselectfile(e){
    //     const selectedFile = e.target.files[0];
    //     setctktfile(selectedFile);
    // }

   

    // downloading the file url from datastorage
    const downloadfileurl1 = async() =>{
        try{
            return new Promise((resolve,reject)=>{
                const storageref = ref(storage,tktfileone.name);
                const downloadurl = getDownloadURL(storageref);
                console.log('download url1: ',downloadurl);
                resolve(downloadurl);
            })
                
        }catch(e){
            console.log('you getting an error while downloading url..unique id was not generating',e);
        }
    }

    const downloadfileurl2 = async() =>{
        try{
            return new Promise((resolve,reject)=>{
                const storageref = ref(storage,tktfiletwo.name);
                const downloadurl = getDownloadURL(storageref);
                console.log('download url2: ',downloadurl);
                resolve(downloadurl);
            })
                
        }catch(e){
            console.log('you getting an error while downloading url..unique id was not generating',e);
        }
    }

    // send msg to admin
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

    async function handlesubmitform(event){
        event.preventDefault();
        setpleasewait(true);
        try{
            // console.log(ticketinfo);
            if(
                ticketinfo.ctktcountry!=='' &&
                ticketinfo.ctktstate!=='' &&
                ticketinfo.ctktdist!=='' &&
                (sharedvalue.role==='customer'||ticketinfo.ctktcustname!=='') &&
                ticketinfo.ctktcalltype!=='' &&
                ticketinfo.ctktpriority!=='' &&
                // ticketinfo.ctktmodedata!=='' &&
                // ticketinfo.ctktservicereport!==''
                ((ticketinfo.status==='resolved' && tktfileone!=='')||(ticketinfo.status==='open')) &&
                ((ticketinfo.status==='resolved' && tktfiletwo!=='')||(ticketinfo.status==='open'))
            ){
                const formatDateString = (date) => date.toISOString().split('T')[0];
                const currentDate = new Date();
                const stringtodaydate = formatDateString(currentDate);
                // const storageref = ref(storage,ctktfile.name);
                // await uploadBytes(storageref,ctktfile);
                // const fileurl= await downloadfileurl();
                //adding the data here
                var fileurl1 ='';
                if(tktfileone!==''){
                    const storageref = ref(storage,tktfileone.name);
                    await uploadBytes(storageref,tktfileone);
                    fileurl1=await downloadfileurl1(tktfileone.name);
                    console.log('fileurl1:', fileurl1)
                }
                var fileurl2='';
                if(tktfiletwo!==''){
                    const storageref = ref(storage,tktfiletwo.name);
                    await uploadBytes(storageref,tktfiletwo);
                    fileurl2=await downloadfileurl2(tktfiletwo.name);
                    console.log('fileurl2:',fileurl2);
                }
                if(tktid!==0 && fileurl1!==null && fileurl2!==null ){
                    // if(sharedvalue.ticketsdata[tktid].status!==ticketinfo.status){
                    //     const message = `${sharedvalue.workersdata[sharedvalue.uid].name} changed the status of ticket [tkt.id ${tktid}] to ${ticketinfo.status} state`;
                    //     const phone = `9440000815`;//here we have to give the admin number
                    //     const data={
                    //         message:message,
                    //         phone:phone
                    //     }
                    //     await handleSendMsgToAdmin(data);
                    // }
                    if(sharedvalue.ticketsdata[tktid].ctktmanager!==ticketinfo.ctktmanager){
                        const data={
                            regToken:'',
                            msg:{
                                title:`${sharedvalue.role} assinged a ticket`,
                                body:`${sharedvalue.workersdata[sharedvalue.uid].name} assigned the new ticket.[ID${tktid}]`
                            }
                        }
                        const notmsg = 'Assigned a Lead';
                        await handleSendMsgToAdmin(data,ticketinfo.ctktmanager,notmsg)
                    }

                    if(sharedvalue.ticketsdata[tktid].ctktemployee!==ticketinfo.ctktemployee){
                        const data={
                            regToken:'',
                            msg:{
                                title:`${sharedvalue.role} assinged a ticket`,
                                body:`${sharedvalue.workersdata[sharedvalue.uid].name} assigned the new ticket.[ID${tktid}]`
                            }
                        }
                        const notmsg = 'Assigned a Lead';
                        await handleSendMsgToAdmin(data,ticketinfo.ctktemployee,notmsg)
                    }

                    if(sharedvalue.ticketsdata[tktid].status!==ticketinfo.status){
                        const data={
                            regToken:'',
                            msg:{
                                title:`${sharedvalue.role} Changed  the ticket Status`,
                                body:`${sharedvalue.workersdata[sharedvalue.uid].name} Changed  the ticket Status to ${ticketinfo.status}.[ID${tktid}]`
                            }
                        }
                        const notmsg ="ticket status chnaged"
                        await handleSendMsgToAdmin(data,'uEZqZKjorFWUmEQuBW5icGmfMrH3',notmsg)
                    }
                }
                if(tktid!==0 && fileurl1!==null && fileurl2!==null ){
                    
                    await batch.update(doc(db,"tickets",`${sharedvalue.ticketsdata[tktid].docid}`),{
                        [tktid]:{
                            ...sharedvalue.ticketsdata[tktid],
                            ctktcountry:ticketinfo.ctktcountry,
                            ctktstate:ticketinfo.ctktstate,
                            ctktdist:ticketinfo.ctktdist,
                            ctktcustname:sharedvalue.role==='customer'?sharedvalue.uid:ticketinfo.ctktcustname,
                            ctktcalltype:ticketinfo.ctktcalltype,
                            ctktcate:ticketinfo.ctktcate,
                            ctktdes:ticketinfo.ctktdes,
                            ctktpriority:ticketinfo.ctktpriority,
                            ctktasslc:ticketinfo.ctktasslc,
                            ctktmanager:ticketinfo.ctktmanager,
                            ctktemployee:ticketinfo.ctktemployee,
                            status:ticketinfo.status,
                            devicedtls:ticketinfo.devicedtls,
                            ctktclose:(ticketinfo.status==='resolved'||ticketinfo.status==='close')?stringtodaydate:'',
                            workingstatus:'',
                            ctktothercustname:ticketinfo.ctktothercustname,
                            // ctktmodedata:ticketinfo.ctktmodedata,
                            // ctktservicereport:ticketinfo.ctktservicereport,
                            //extra fields for resolving work
                            ctktmodedata:fileurl1,
                            ctktservicereport:fileurl2
                        }
                    });
                    await batch.commit();
                    loginsuccess();//successfully added the data
                    window.scrollTo({top:0,behavior:'smooth'});
                    navigate(-1);
                }
            }
            else{
                loginformerror();
            }
        }catch(e){
            console.log('you getting an error while uploading the form!!!',e);
            loginerror();
        }
        setpleasewait(false);
    }
    useEffect(()=>{
        if(sharedvalue.ticketskeys.length>0 && sharedvalue.ticketskeys.includes(tktid)){
            setticketinfo(prev=>({
                ...prev,
                ctktcountry:sharedvalue.ticketsdata[tktid].ctktcountry,
                ctktstate:sharedvalue.ticketsdata[tktid].ctktstate,
                ctktdist:sharedvalue.ticketsdata[tktid].ctktdist,
                ctktcustname:sharedvalue.ticketsdata[tktid].ctktcustname,
                ctktcalltype:sharedvalue.ticketsdata[tktid].ctktcalltype,
                ctktcate:sharedvalue.ticketsdata[tktid].ctktcate,
                ctktdes:sharedvalue.ticketsdata[tktid].ctktdes,
                ctktpriority:sharedvalue.ticketsdata[tktid].ctktpriority,
                ctktasslc:sharedvalue.ticketsdata[tktid].ctktasslc,
                ctktmanager:sharedvalue.ticketsdata[tktid].ctktmanager,
                ctktemployee:sharedvalue.ticketsdata[tktid].ctktemployee,
                status:sharedvalue.ticketsdata[tktid].status,
                devicedtls:sharedvalue.ticketsdata[tktid].devicedtls,
                ctktothercustname:sharedvalue.ticketsdata[tktid].ctktothercustname,
                //extra fields for resolving work
                //Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[ticketinfo.ctktcustname], "cmachinetype")?
                //sharedvalue.workersdata[ticketinfo.ctktcustname].cmachinetype:''
                // ctktmodedata:sharedvalue.ticketsdata[tktid].ctktmodedata,
                ctktmodedata:Object.prototype.hasOwnProperty.call(sharedvalue.ticketsdata[tktid],"ctktmodedata")?sharedvalue.ticketsdata[tktid].ctktmodedata:'',
                // ctktservicereport:sharedvalue.ticketsdata[tktid].ctktservicereport
                ctktservicereport:Object.prototype.hasOwnProperty.call(sharedvalue.ticketsdata[tktid],"ctktservicereport")?sharedvalue.ticketsdata[tktid].ctktservicereport:''
            }));
        }
    },[sharedvalue.ticketsdata,sharedvalue.ticketskeys,tktid]);
    return(
        <>
        {(sharedvalue.ticketskeys.length>0 && sharedvalue.ticketskeys.includes(tktid) && sharedvalue.ticketsdata[tktid].status==='open' &&
         (sharedvalue.role==='admin' ||(sharedvalue.role==='employee' && sharedvalue.ticketsdata[tktid].ctktemployee===sharedvalue.uid)||(sharedvalue.role==='manager' && sharedvalue.ticketsdata[tktid].ctktmanager===sharedvalue.uid)||
         (sharedvalue.ticketsdata[tktid].ctktcustname!=='other' && sharedvalue.uid===sharedvalue.workersdata[sharedvalue.ticketsdata[tktid].ctktcustname].uid)||
         (sharedvalue.ticketsdata[tktid].ctktcustname==='other' && sharedvalue.uid===sharedvalue.ticketsdata[tktid].createdbyid)))===true?
            <div className={`manlead-con ${pleasewait===true?'manlead-con-inactive':''}`}>
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
                    {/* your create tickets leads  starts from here */}
                    <form className='create-lead-con'>
                        {/* header for updating lead */}
                        <div className='create-lead-head'>
                            <h1>Update Ticket</h1>
                        </div>
                        <div className='create-lead-head-button-comes-here'>
                            <button onClick={(e)=>{
                                e.preventDefault();
                                navigate(-1);
                                }}>
                                <ChevronLeftIcon/>
                                Go Back
                            </button>
                        </div>
                        {/* form starts from here */}
                        <div className="create-ticket-form-starts">
                            <div>
                                <label>country</label>
                                {/* choosen country */}
                                <select value={ticketinfo.ctktcountry} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktstate:e.target.value==='India'?'':ticketinfo.ctktstate,
                                    ctktdist:e.target.value==='India'?'':ticketinfo.ctktdist,
                                    ctktcountry:e.target.value
                                }))}>
                                    <option value=''>Select country</option>
                                    {
                                        counrtycode.map((item,idx)=>(
                                            <option key={idx} value={item.name}>{item.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div>
                                <label>state</label>
                                {/* if selected country is india  */}
                                {
                                    ticketinfo.ctktcountry==='India' &&
                                    <select value={ticketinfo.ctktstate} onChange={(e)=>setticketinfo(prev=>({
                                        ...prev,
                                        ctktstate:e.target.value
                                    }))}>
                                        <option value=''>Select State</option>
                                        {states.map((item,idx)=>(
                                            <option key={idx} value={item.state}>{item.state}</option>
                                        ))}
                                    </select>
                                }
                                {/* if the selected country is not india */}
                                {
                                    ticketinfo.ctktcountry!=='India' &&
                                    <input type='text' value={ticketinfo.ctktstate} onChange={(e)=>setticketinfo(prev=>({
                                        ...prev,
                                        ctktstate:e.target.value
                                    }))}/>
                                }
                            </div>
                            <div>
                                <label>district</label>
                                {/* if selected country is india */}
                                {
                                    ticketinfo.ctktcountry==='India' && ticketinfo.ctktstate!=='' &&
                                    <select value={ticketinfo.ctktdist} onChange={(e)=>setticketinfo(prev=>({
                                        ...prev,
                                        ctktdist:e.target.value
                                    }))}>
                                        <option value='' >Select District</option>
                                        {states.filter(item=>item.state===ticketinfo.ctktstate)[0].districts.map((prod,idx)=>(
                                            <option key={idx} value={prod}>{prod}</option>
                                        ))}
                                    </select>
                                }
                                {/* if selected country is not india */}
                                {
                                    ticketinfo.ctktcountry!=='India' &&
                                    <input type='text' value={ticketinfo.ctktdist} onChange={(e)=>setticketinfo(prev=>({
                                        ...prev,
                                        ctktdist:e.target.value
                                    }))}/>
                                }
                            </div>
                            {sharedvalue.role==='customer'?
                                <div>
                                    <label>Company Name*</label>
                                    <input type='text' value={sharedvalue.workersdata[sharedvalue.uid].cname} readOnly />
                                </div>
                                :
                                <div>
                                    <label>Company Name*</label>
                                    <select value={ticketinfo.ctktcustname} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktcustname:e.target.value,
                                    ctktothercustname:''
                                    }
                                    ))}>
                                        <option value=''>Select Company</option>
                                        {
                                            sharedvalue.workerskeys.filter(item=>sharedvalue.workersdata[item].role==='customer')
                                            .map((worker,idx)=>(
                                                <option key={idx} value={sharedvalue.workersdata[worker].uid}>{sharedvalue.workersdata[worker].cname}</option>
                                            ))
                                        }
                                        <option value='other'>other</option>

                                    </select>
                                </div>
                            }
                            {ticketinfo.ctktcustname==='other' &&
                            <div>
                                <label>Other Company Name*</label>
                                <input type='text' value={ticketinfo.ctktothercustname} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktothercustname:e.target.value
                                }
                                ))}/>
                            </div>
                             }
                            {/* description starts here */}
                            <div>
                                <label>device details</label>
                                <textarea placeholder="enter your device details..." value={ticketinfo.devicedtls} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    devicedtls:e.target.value
                                }))}/>
                            </div>
                            {/* call type starts here */}
                            <div>
                                <label>Call type*</label>
                                <select value={ticketinfo.ctktcalltype} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktcalltype:e.target.value
                                }))}>
                                    <option value=''>Select Call Type</option>
                                    <option value='Pre-Installation'>Pre-Installation</option>
                                    <option value='Installation'>Installation</option>
                                    <option value='Charge'>Chargable</option>
                                    <option value='Warranty'>Warranty</option>
                                    <option value='AMC'>AMC</option>
                                </select>
                            </div>
                            {/* if call type is free or charge */}

                            {
                                (ticketinfo.ctktcalltype==='Charge' || ticketinfo.ctktcalltype==='Warranty' || ticketinfo.ctktcalltype==='AMC') &&
                                <div>
                                    <label>Category*</label>
                                    <select value={ticketinfo.ctktcate} onChange={(e)=>setticketinfo(prev=>({
                                        ...prev,
                                        ctktcate:e.target.value
                                    }))}>
                                        <option value='-' >Select Category</option>
                                        <option value='Power Issue'>Power Issue</option>
                                        <option value='Quality Issue'>Quality Issue</option>
                                        <option value='Vibrator Issue'>Vibrator Issue</option>
                                        <option value='Display Issue'>Display Issue</option>
                                        <option value='Product Trial'>Product Trial</option>
                                        <option value='Software Issue'>Software Issue</option>
                                        <option value='Mode Setting'>Mode Setting</option>
                                        <option value='Ejector Issue'>Ejector Issue</option>
                                        <option value='Wiper Issue'>Wiper Issue</option>
                                        <option value='Capacity Issue'>Capacity Issue</option>
                                        <option value='Glass Changing'>Glass Changing</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </div>
                            }
                            {/* category completed */}
                            {
                                ticketinfo.ctktcustname!=='other' && ticketinfo.ctktcustname!=='' &&
                                 (ticketinfo.ctktcalltype==='Warranty' || ticketinfo.ctktcalltype==='AMC') &&
                                 ((Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[ticketinfo.ctktcustname], "woramc") && sharedvalue.workersdata[ticketinfo.ctktcustname].woramc!=='')===true?
                                 (sharedvalue.workersdata[ticketinfo.ctktcustname].woramc==='Warranty')?
                                 <section className="create-ticket-imported-data">
                                    <div>
                                        <label>warranty start date</label>
                                        <input type='date' value={sharedvalue.workersdata[ticketinfo.ctktcustname].cIdate} readOnly/>
                                    </div>
                                    <div>
                                        <label>warranty duration</label>
                                        <input type='text' value={`${sharedvalue.workersdata[ticketinfo.ctktcustname].wtydur} Years`} readOnly/>
                                            
                                    </div>
                                    <div>
                                        <label>warranty end date</label>
                                        <input type='date' value={sharedvalue.workersdata[ticketinfo.ctktcustname].wtyenddate} readOnly/>
                                    </div>

                                </section>:
                                <section className="create-ticket-imported-data">
                                    <div>
                                        <label>AMC start date</label>
                                        <input type='date' value={sharedvalue.workersdata[ticketinfo.ctktcustname].amcsrtdate} readOnly/>
                                    </div>
                                    <div>
                                        <label>AMC duration</label>
                                        <input type="text" value={`${sharedvalue.workersdata[ticketinfo.ctktcustname].amcdur} months`} readOnly/>
                                            
                                    </div>
                                    <div>
                                        <label>AMC visits</label>
                                        <input type='text' value={`${sharedvalue.workersdata[ticketinfo.ctktcustname].amcvisits} visits`} readOnly/>
                                            
                                    </div>
                                    <div>
                                        <label>AMC end date</label>
                                        <input type='date' value={sharedvalue.workersdata[ticketinfo.ctktcustname].amcenddate} readOnly/>
                                    </div>

                                </section>
                                 :
                                 <p>Sorry you won't have any AMC or warranty!!!</p>)
                            }
                            {/* description starts here */}
                                    <div>
                                        <label>Description*</label>
                                        <textarea placeholder="Description" value={ticketinfo.ctktdes} onChange={(e)=>setticketinfo(prev=>({
                                            ...prev,
                                            ctktdes:e.target.value
                                        }))}/>
                                    </div>
                            {/* description ends here */}
                                    <div>
                                        <label>Priority*</label>
                                        <select value={ticketinfo.ctktpriority} onChange={(e)=>setticketinfo(prev=>({
                                            ...prev,
                                            ctktpriority:e.target.value
                                        }))}>
                                            <option value='' >Select Priority</option>
                                            <option value='Urgent'>Urgent</option>
                                            <option value='High'>High</option>
                                            <option value='Medium'>Medium</option>
                                            <option value='Low'>Low</option>
                                        </select>
                                    </div>
                            {/* priority ends here */}
                            {/* employee and manager starts here */}
                            {(sharedvalue.role==='manager'||sharedvalue.role==='employee') &&
                            <div>
                                <label>status</label>
                                <select value={ticketinfo.status} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    status:e.target.value
                                }))}>
                                    <option value='open'>Open</option>
                                    <option value='resolved'>Resolved</option>
                                </select>
                            </div>}
                            {/* mode data */}
                            {ticketinfo.status==='resolved' && (sharedvalue.role==='manager'||sharedvalue.role==='employee') &&
                            <div>
                                <label>Mode Data<span style={{color:'red'}}>*</span></label>
                                <input type='file' onChange={(e)=>handlefirstfileupload(e)} required/>
                            </div>}
                            {/* service report */}
                            {ticketinfo.status==='resolved' && (sharedvalue.role==='manager'||sharedvalue.role==='employee') &&
                            <div>
                                <label>service report<span style={{color:'red'}}>*</span></label>
                                <input type='file' onChange={(e)=>handlesecondfileupload(e)} required/>
                            </div>}
                            {/* manager div */}
                            {sharedvalue.role==='admin' && 
                            <div>
                                <label>manager</label>
                                <select value={ticketinfo.ctktmanager} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktmanager:e.target.value,
                                    ctktemployee:''
                                }))}>
                                    <option value='-'> select manager</option>
                                    {sharedvalue.workerskeys.filter(item=> sharedvalue.workersdata[item].role==='manager' ).map((manager,idx)=>(
                                        <option key={idx} value={manager}>{sharedvalue.workersdata[manager].name}</option>
                                    ))}
                                </select>
                            </div>
                            }
                            {/* employee div */}
                            {(sharedvalue.role==='admin'||sharedvalue.role==='manager') && 
                            <div>
                                <label>employee</label>
                                <select value={ticketinfo.ctktemployee} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktemployee:e.target.value
                                }))}>
                                    <option value=''>select employee</option>
                                    {sharedvalue.workerskeys.filter(item=> sharedvalue.workersdata[item].role==='employee' && sharedvalue.workersdata[item].managerid===ticketinfo.ctktmanager).map((employee,idx)=>(
                                        <option key={idx} value={employee}>{sharedvalue.workersdata[employee].name}</option>
                                    ))}
                                </select>
                            </div>}
                                {/* employee and manager ends here */}
                                {/* <div>
                                    <label>Associated Lead Code</label>
                                    <select value={ticketinfo.ctktasslc} onChange={(e)=>setticketinfo(prev=>({
                                        ...prev,
                                        ctktasslc:e.target.value
                                    }))}>
                                        <option value='' >Select Lead</option>
                                        {
                                            sharedvalue.leadskeys.map((leads,idx)=>(
                                                <option value={leads} key={idx}>{leads}</option>
                                            ))
                                        }
                                    </select>
                                </div> */}
                            {/* associated lead code ends here */}
                            {/* <div>
                                <label>File</label>
                                <input type='file' onChange={(e)=>handleselectfile(e)}/>
                            </div> */}
                            {/* file ends here */}
                            <button onClick={(e)=>handlesubmitform(e)}>
                                update ticket
                            </button>
                                <div>
                            </div>
                        </div>
                        {/* inner div completes here */}

                    </form>
                    {/* form completes here */}
                </div>
            </div>:<Error/>
            }
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
            <div className={`please-wait-ti-will-take-few-seconds ${pleasewait===true?'active-please-wait':''}`}>
                <img src={loading} alt='loading'/>
                <p>please wait</p>
                <p>it will few seconds</p>
            </div>
        </>
    );
}

export default Updateticket;