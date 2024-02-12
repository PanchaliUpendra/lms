import React, {useContext, useState } from "react";
import './Createticket.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import {counrtycode} from '../../../Data/countrycode';
import {states} from '../../../Data/states';
import { onSnapshot ,writeBatch} from "firebase/firestore";
import { db } from "../../../Firebase";
import { createticketid, createtickets, ticketsgraphdoc } from "../../../Data/Docs";
//import storage 
import { getDownloadURL,ref,uploadBytes } from 'firebase/storage';
import { storage } from "../../../Firebase";
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
//loading gif
import loading from '../../../Assets/loading.gif';
import { useNavigate } from "react-router-dom";
import { months } from "../../../Data/Months";

function Createticket(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Created the Ticket');
    const loginerror = () =>toast.error('Getting Error while Creating ticket');
    const loginformerror = () => toast.info('please fill the form correctly');
    const invalidmail = () => toast.warn('unique id was not generating!!!');
    const batch = writeBatch(db);//get a new write batch
    const [pleasewait,setpleasewait] = useState(false);
    // selected ticket information
    const [ticketinfo,setticketinfo] = useState({
        ctktcountry:'',
        ctktstate:'',
        ctktdist:'',
        ctktcustname:'',
        ctktcalltype:'',
        ctktcate:'-',
        ctktdes:'',
        ctktpriority:'',
        ctktasslc:'',
    })
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    //select ticket file 
    const [ctktfile,setctktfile]=useState('');
    function handleselectfile(e){
        const selectedFile = e.target.files[0];
        setctktfile(selectedFile);
    }

    //generating the ticket id from database
    const fetchtktid = async() =>{
        try{
            return new Promise((resolve, reject) =>{
                onSnapshot(createticketid,(doc)=>{
                    const temptktid = doc.data();
                    resolve(temptktid.tktid+1);
                    resolve('ubbu')
                });
            })
        }catch(e){
            console.log('you got an error while fetching the tktid',e);
            invalidmail();
        }
    }

    //downloading the file url from datastorage
    const downloadfileurl = async() =>{
        try{
            return new Promise((resolve,reject)=>{
                const storageref = ref(storage,ctktfile.name);
                const downloadurl = getDownloadURL(storageref);
                resolve(downloadurl);
            })
                
        }catch(e){
            console.log('you getting an error while downloading url ',e);
            invalidmail();
        }
    }

    async function handlesubmitform(){
        setpleasewait(true);
        try{
            // console.log(ticketinfo);
            if(
                ticketinfo.ctktcountry!=='' &&
                ticketinfo.ctktstate!=='' &&
                ticketinfo.ctktdist!=='' &&
                ticketinfo.ctktcustname!=='' &&
                ticketinfo.ctktcalltype!=='' &&
                ticketinfo.ctktpriority!=='' 
            ){
                const result = await fetchtktid();
                const storageref = ref(storage,ctktfile.name);
                await uploadBytes(storageref,ctktfile);
                const fileurl= await downloadfileurl();
                //adding the data here
                if(result>=1109699 && fileurl!==null){
                    await batch.update(createtickets,{
                        [result]:{
                            ctktcountry:ticketinfo.ctktcountry,
                            ctktstate:ticketinfo.ctktstate,
                            ctktdist:ticketinfo.ctktdist,
                            ctktcustname:ticketinfo.ctktcustname,
                            ctktcalltype:ticketinfo.ctktcalltype,
                            ctktcate:ticketinfo.ctktcate,
                            ctktdes:ticketinfo.ctktdes,
                            ctktpriority:ticketinfo.ctktpriority,
                            ctktasslc:ticketinfo.ctktasslc,
                            ctktmanager:sharedvalue.role==='manager'?sharedvalue.uid:sharedvalue.role==='employee'?sharedvalue.workersdata[sharedvalue.uid].managerid:'',
                            ctktemployee:sharedvalue.role==='employee'?sharedvalue.uid:'',
                            status:'open',
                            workingstatus:'',
                            fileurl:fileurl,
                            id:result,
                            createdbyid:sharedvalue.uid
                        }
                    });
                    //updating the tickets graph data
                    let currentDate = new Date();
                    let year = currentDate.getFullYear();
                    let month = (currentDate.getMonth()+1).toString().padStart(2,'0');
                    let yearMonth = year + month;
                    let yearMonthNumber = Number(yearMonth);
                    console.log('year monthg number: ', yearMonthNumber);
                    if(sharedvalue.ticketsgraphkeys.includes(yearMonth)){
                        
                        await batch.update(ticketsgraphdoc,{
                            [yearMonthNumber]:{
                                ...sharedvalue.ticketsgraphdata[yearMonthNumber],
                                to:Number(sharedvalue.ticketsgraphdata[yearMonthNumber].to)+1
                            }
                        })
                    }else{
                        
                        await batch.update(ticketsgraphdoc,{
                            [yearMonthNumber]:{
                                to:1,
                                tc:0,
                                month:months[month]
                            }
                        })
                    }

                    await batch.update(createticketid,{
                        "tktid":result
                    });

                    await batch.commit();
                    loginsuccess();//successfully added the data
                    setticketinfo({
                        ctktcountry:'',
                        ctktstate:'',
                        ctktdist:'',
                        ctktcustname:'',
                        ctktcalltype:'',
                        ctktcate:'-',
                        ctktdes:'',
                        ctktpriority:'',
                        ctktasslc:'',
                    });
                    setctktfile('');
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
    return(
        <>
            <div className={`manlead-con ${pleasewait===true?'manlead-con-inactive':''}`}>
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
                    {/* your create tickets leads  starts from here */}
                    <div className='create-lead-con'>
                        <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>New Ticket</h1>
                            </div>
                        </div>
                        {/* form starts from here */}
                        <div className="create-ticket-form-starts">
                            <div>
                                <label>country</label>
                                {/* choosen country */}
                                <select value={ticketinfo.ctktcountry} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktcountry:e.target.value
                                }))}>
                                    <option value='' selected>Select country</option>
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
                                        <option value=''selected>Select State</option>
                                        {states.map((item,idx)=>(
                                            <option key={idx} value={item.state}>{item.state}</option>
                                        ))}
                                    </select>
                                }
                                {/* if the selected country is not india */}
                                {
                                    ticketinfo.ctktcountry!=='India' &&
                                    <input type='text' onChange={(e)=>setticketinfo(prev=>({
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
                                        <option value='' selected>Select District</option>
                                        {states.filter(item=>item.state===ticketinfo.ctktstate)[0].districts.map((prod,idx)=>(
                                            <option key={idx} value={prod}>{prod}</option>
                                        ))}
                                    </select>
                                }
                                {/* if selected country is not india */}
                                {
                                    ticketinfo.ctktcountry!=='India' &&
                                    <input type='text' onChange={(e)=>setticketinfo(prev=>({
                                        ...prev,
                                        ctktdist:e.target.value
                                    }))}/>
                                }
                            </div>
                            <div>
                                <label>Company Name*</label>
                                <input type='text' value={ticketinfo.ctktcustname} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktcustname:e.target.value
                                }
                                ))}/>
                            </div>
                            <div>
                                    <label>Associated Lead Code</label>
                                    <select value={ticketinfo.ctktasslc} onChange={(e)=>setticketinfo(prev=>({
                                        ...prev,
                                        ctktasslc:e.target.value
                                    }))}>
                                        <option value='' selected>Select Lead</option>
                                        {
                                            sharedvalue.leadskeys
                                            .filter(item =>((sharedvalue.role==='employee' && sharedvalue.leadsdata[item].employeeid===sharedvalue.uid)||(sharedvalue.role==='admin')||(sharedvalue.role==='manager' && sharedvalue.leadsdata[item].managerid===sharedvalue.uid)))
                                            .map((leads,idx)=>(
                                                <option value={leads} key={idx}>{leads}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            {/* call type starts here */}
                            <div>
                                <label>Call type*</label>
                                <select value={ticketinfo.ctktcalltype} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktcalltype:e.target.value
                                }))}>
                                    <option value='' selected>Select Call Type</option>
                                    <option value='Pre-Installation'>Pre-Installation</option>
                                    <option value='Installation'>Installation</option>
                                    <option value='Charge'>Charge</option>
                                    <option value='Free'>Free</option>
                                </select>
                            </div>
                            {/* if call type is free or charge */}

                            {
                                (ticketinfo.ctktcalltype==='Charge' || ticketinfo.ctktcalltype==='Free') &&
                                <div>
                                    <label>Category*</label>
                                    <select value={ticketinfo.ctktcate} onChange={(e)=>setticketinfo(prev=>({
                                        ...prev,
                                        ctktcate:e.target.value
                                    }))}>
                                        <option value='-' selected>Select Category</option>
                                        <option value='Power Issue'>Power Issue</option>
                                        <option value='Quality Issue'>Quality Issue</option>
                                        <option value='Vibrator Issue'>Vibrator Issue</option>
                                        <option value='Display Issue'>Display Issue</option>
                                        <option value='Product Trial'>Product Trial</option>
                                        <option value='Software Issue'>Software Issue</option>
                                        <option value='Mode Setting'>Mode Setting</option>
                                        <option value='Ejector Issue'>Ejector Issue</option>
                                        <option value='Wiper Issue'>Wiper Issue</option>
                                        <option value='Capacitor Issue'>Capacitor Issue</option>
                                        <option value='Glass Changing'>Glass Changing</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </div>
                            }
                            {/* category completed */}
                            {/* description starts here */}
                                    <div>
                                        <label>Description*</label>
                                        <textarea placeholder="Description" onChange={(e)=>setticketinfo(prev=>({
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
                                            <option value='' selected>Select Priority</option>
                                            <option value='Urgent'>Urgent</option>
                                            <option value='High'>High</option>
                                            <option value='Medium'>Medium</option>
                                            <option value='Low'>Low</option>
                                        </select>
                                    </div>
                            {/* priority ends here */}
                               
                            {/* associated lead code ends here */}
                            <div>
                                <label>File</label>
                                <input type='file' onChange={(e)=>handleselectfile(e)}/>
                            </div>
                            {/* file ends here */}
                            <button onClick={()=>handlesubmitform()}>
                                create
                            </button>
                                <div>
                            </div>
                        </div>
                        {/* inner div completes here */}

                    </div>
                    {/* form completes here */}
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
            <div className={`please-wait-ti-will-take-few-seconds ${pleasewait===true?'active-please-wait':''}`}>
                <img src={loading} alt='loading'/>
                <p>please wait</p>
                <p>it will few seconds</p>
            </div>
        </>
    );
}

export default Createticket;