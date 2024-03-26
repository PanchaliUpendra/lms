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

import { createworkers } from "../../../Data/Docs";


function Createticket(){
    const sharedvalue = useContext(MyContext);
    // State to keep track of the checkbox value
    const [isChecked, setIsChecked] = useState(false);

    //four fields data
    const [importfourfld,setimportfourfld] = useState({
        cmachinetype:'',
        cMdate:'',
        cSnum:'',
        cIdate:''
    });

    const tempimportfourfld = {
        cmachinetype:'',
        cMdate:'',
        cSnum:'',
        cIdate:''
    }

    // Function to handle checkbox change
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked); // Toggle the checkbox value
    };
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
        ctktcountry:'India',
        ctktstate:'',
        ctktdist:'',
        ctktcustname:'',
        ctktothercustname:'',
        ctktcalltype:'',
        ctktcate:'-',
        ctktdes:'',
        ctktpriority:'',
        ctktasslc:'',
        // extra fields for warranty
        ctktwtysrtdate:'',
        ctktwtydur:'',
        ctktwtyenddate:'',
        //extra fields for AMC
        ctktamcsrtdate:'',
        ctktamcdur:'',
        ctktamcvisits:'',
        ctktamcenddate:''

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
                // ticketinfo.ctktcustname!=='' &&
                (sharedvalue.role==='customer'||ticketinfo.ctktcustname!=='') &&
                ticketinfo.ctktcalltype!=='' &&
                ticketinfo.ctktpriority!=='' 
            ){
                const result = await fetchtktid();
                var fileurl ='';
                if(ctktfile!==''){
                    const storageref = ref(storage,ctktfile.name);
                    await uploadBytes(storageref,ctktfile);
                    fileurl= await downloadfileurl();
                }

                const formatDateString = (date) => date.toISOString().split('T')[0];
                const currentDate = new Date();
                const currentdatetime = currentDate.toISOString();
                const stringtodaydate = formatDateString(currentDate);
                
                //adding the data here
                if(result>=1109699 && fileurl!==null){
                    await batch.update(createtickets,{
                        [result]:{
                            ctktcountry:ticketinfo.ctktcountry,
                            ctktstate:ticketinfo.ctktstate,
                            ctktdist:ticketinfo.ctktdist,
                            ctktcustname:sharedvalue.role==='customer'?sharedvalue.uid:ticketinfo.ctktcustname,
                            ctktothercustname:ticketinfo.ctktothercustname,
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
                            createdbyid:sharedvalue.uid,
                            ctktopen:stringtodaydate,
                            ctktclose:'',
                            ctktdatetime:currentdatetime,
                            // extra fields for warranty
                            ctktwtysrtdate:ticketinfo.ctktwtysrtdate,
                            ctktwtydur:ticketinfo.ctktwtydur,
                            ctktwtyenddate:ticketinfo.ctktwtyenddate,
                            //extra fields for AMC
                            ctktamcsrtdate:ticketinfo.ctktamcsrtdate,
                            ctktamcdur:ticketinfo.ctktamcdur,
                            ctktamcvisits:ticketinfo.ctktamcvisits,
                            ctktamcenddate:ticketinfo.ctktamcenddate
                        }
                    });
                    //updating the tickets graph data
                    let currentDate = new Date();
                    let year = currentDate.getFullYear();
                    let month = (currentDate.getMonth()+1).toString().padStart(2,'0');
                    let yearMonth = year + month;
                    let yearMonthNumber = Number(yearMonth);
                    
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
                        ctktcountry:'India',
                        ctktstate:'',
                        ctktdist:'',
                        ctktcustname:'',
                        ctktcalltype:'',
                        ctktcate:'-',
                        ctktdes:'',
                        ctktpriority:'',
                        ctktasslc:'',
                        ctktothercustname:'',
                        // extra fields for warranty
                        ctktwtysrtdate:'',
                        ctktwtydur:'',
                        ctktwtyenddate:'',
                        //extra fields for AMC
                        ctktamcsrtdate:'',
                        ctktamcdur:'',
                        ctktamcvisits:'',
                        ctktamcenddate:''
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

    async function handleupddateform(){
        setpleasewait(true);
        try{
            if(ticketinfo.ctktcustname!==''){
                batch.update(createworkers,{[ticketinfo.ctktcustname]:{
                    ...sharedvalue.workersdata[ticketinfo.ctktcustname],
                    cmachinetype:importfourfld.cmachinetype!==''?importfourfld.cmachinetype
                    :Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[ticketinfo.ctktcustname], "cmachinetype")?
                    sharedvalue.workersdata[ticketinfo.ctktcustname].cmachinetype:'',
                    
                    cMdate:importfourfld.cMdate!==''?importfourfld.cMdate
                    :Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[ticketinfo.ctktcustname], "cMdate")?
                    sharedvalue.workersdata[ticketinfo.ctktcustname].cMdate:'',
                    
                    cSnum:importfourfld.cSnum!==''?importfourfld.cSnum
                    :Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[ticketinfo.ctktcustname], "cSnum")?
                    sharedvalue.workersdata[ticketinfo.ctktcustname].cSnum:'',

                    cIdate:importfourfld.cIdate!==''?importfourfld.cIdate
                    :Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[ticketinfo.ctktcustname], "cIdate")?
                    sharedvalue.workersdata[ticketinfo.ctktcustname].cIdate:''
                }});
                await batch.commit();
                setimportfourfld(prev=>({
                    ...prev,
                    cmachinetype:'',
                    cMdate:'',
                    cSnum:'',
                    cIdate:''
                }));
            }else{
                alert('sorry you got an error...');
            }
            
        }catch(e){
            console.log('you got an error while updatting the form!!',e);
        }
        setpleasewait(false);
    }

    //function to handle the Warranty end date
    async function handlewty(e){
        try{
            const currentDate = ticketinfo.ctktwtysrtdate!==''?new Date(ticketinfo.ctktwtysrtdate):new Date();
            const futureEndDate = new Date(currentDate);
            // console.log(typeof Number(e.target.value));
            const curvalue = e.target.value;
            futureEndDate.setFullYear(currentDate.getFullYear()+Number(curvalue));
            const formatDateString = (date) => date.toISOString().split('T')[0];
            setticketinfo(prev=>({
                ...prev,
                ctktwtyenddate:formatDateString(futureEndDate)
            }));
            // return formatDateString(futureEndDate);
        }catch(e){
            console.log('you got an error while fetching the date',e);
        }
    }

    //function to handle the amc end date
    async function handleamcenddate(e){
        try{
            const currentDate = ticketinfo.ctktamcsrtdate!==''? new Date(ticketinfo.ctktamcsrtdate):new Date();
            const futureEndDate = new Date(currentDate);
            const curvalue = e.target.value;
            futureEndDate.setMonth(currentDate.getMonth()+Number(curvalue));
            const formatDateString = (date) => date.toISOString().split('T')[0];
            setticketinfo(prev=>({
                ...prev,
                ctktamcenddate:formatDateString(futureEndDate)
            }))
        }catch(e){
            console.log('you got an error while fetching the date',e);
        }
    }

    //handling fetching the warranty 

    // async function handlefetchingwarranty(tktname){
    //     try{
    //         setticketinfo(prev=>({
    //             ...prev,
    //             ctktwtydur:sharedvalue.workersdata[tktname].wtydur,
    //             ctktwtysrtdate:sharedvalue.workersdata[tktname].cIdate,
    //             ctktwtyenddate:sharedvalue.workersdata[tktname].wtyenddate
    //         }))
    //         console.log(sharedvalue.workersdata[tktname].wtydur);
    //         console.log(sharedvalue.workersdata[tktname].cIdate);
    //         console.log(sharedvalue.workersdata[tktname].wtyenddate);
    //     }catch(e){
    //         console.log('you got an error while fetching the warranty data',e);
    //     }
    // }

    //handling fetching the AMC data

    // async function handlefetchingAMC(tktname){
    //     try{
    //         setticketinfo(prev=>({
    //             ...prev,
    //             ctktamcsrtdate:sharedvalue.workersdata[tktname].amcsrtdate,
    //             ctktamcdur:sharedvalue.workersdata[tktname].amcdur,
    //             ctktamcvisits:sharedvalue.workersdata[tktname].amcvisits,
    //             ctktamcenddate:sharedvalue.workersdata[tktname].amcenddate
    //         }))
    //     }catch(e){
    //         console.log('you got an error while fetching the AMC data',e);
    //     }
    // }
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
                                <label>country<span style={{color:'red'}}>*</span></label>
                                {/* choosen country */}
                                <select value={ticketinfo.ctktcountry} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktstate:'',
                                    ctktdist:'',
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
                                <label>state<span style={{color:'red'}}>*</span></label>
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
                                    <input type='text' value={ticketinfo.ctktstate} onChange={(e)=>setticketinfo(prev=>({
                                        ...prev,
                                        ctktstate:e.target.value
                                    }))}/>
                                }
                            </div>
                            <div>

                                {ticketinfo.ctktcountry==='India' && ticketinfo.ctktstate!=='' && <label>district<span style={{color:'red'}}>*</span></label> }
                                {ticketinfo.ctktcountry!=='India' && <label>district<span style={{color:'red'}}>*</span></label> }
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
                                    <input type='text' value={ticketinfo.ctktdist} onChange={(e)=>setticketinfo(prev=>({
                                        ...prev,
                                        ctktdist:e.target.value
                                    }))}/>
                                }
                            </div>
                            
                            {sharedvalue.role==='customer'?
                                <div>
                                    <label>Company Name<span style={{color:'red'}}>*</span></label>
                                    <input type='text' value={sharedvalue.workersdata[sharedvalue.uid].cname} readOnly />
                                </div>
                                :
                                <div>
                                    <label>Company Name<span style={{color:'red'}}>*</span></label>
                                    <select value={ticketinfo.ctktcustname} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktcustname:e.target.value,
                                    ctktothercustname:''
                                    }
                                    ))}>
                                        <option value=''>Select Company</option>
                                        {
                                            sharedvalue.workerskeys.filter(item=>sharedvalue.workersdata[item].role==='customer')
                                            .filter(item=>(Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[item],"ccountry")?sharedvalue.workersdata[item].ccountry.includes(ticketinfo.ctktcountry):true))
                                            .filter(item=>(Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[item],"cstate")?sharedvalue.workersdata[item].cstate.includes(ticketinfo.ctktstate):true))
                                            .map((worker,idx)=>(
                                                <option key={idx} value={sharedvalue.workersdata[worker].uid}>{sharedvalue.workersdata[worker].cname}</option>
                                            ))
                                        }
                                        <option value='other'>other</option>

                                    </select>
                                </div>
                            }
                            {
                                ticketinfo.ctktcustname!=='other' && ticketinfo.ctktcustname!=='' &&
                                <section className="importing-customer-data">
                                    <input type='checkbox' checked={isChecked} onChange={handleCheckboxChange}/>
                                    <label>import customer details</label>
                                </section>
                            }

                            {
                                isChecked===true && ticketinfo.ctktcustname!=='other' &&
                                <section className="create-ticket-imported-data">
                                    <div>
                                        <label>Machine Type</label>
                                        {(ticketinfo.ctktcustname!=='' && Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[ticketinfo.ctktcustname], "cmachinetype") && sharedvalue.workersdata[ticketinfo.ctktcustname].cmachinetype!=='')?
                                        <input type='text' value={sharedvalue.workersdata[ticketinfo.ctktcustname].cmachinetype} readOnly/>
                                        :
                                        <input type='text' value={importfourfld.cmachinetype} onChange={(e)=>setimportfourfld(prev=>({
                                            ...prev,
                                            cmachinetype:e.target.value
                                        }))} />
                                        }
                                    </div>
                                    <div>
                                        <label>Manufacture Date</label>
                                        {(ticketinfo.ctktcustname!=='' && Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[ticketinfo.ctktcustname], "cMdate") && sharedvalue.workersdata[ticketinfo.ctktcustname].cMdate!=='')?
                                        <input type='text' value={sharedvalue.workersdata[ticketinfo.ctktcustname].cMdate} readOnly/> :
                                        <input type='date' value={importfourfld.cMdate} onChange={(e)=>setimportfourfld(prev=>({
                                            ...prev,
                                            cMdate:e.target.value
                                        }))}/>
                                        }
                                    </div>
                                    <div>
                                        <label>Serial Number</label>
                                        {(ticketinfo.ctktcustname!=='' && Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[ticketinfo.ctktcustname], "cSnum") && sharedvalue.workersdata[ticketinfo.ctktcustname].cSnum!=='')?
                                        <input type='text' value={sharedvalue.workersdata[ticketinfo.ctktcustname].cSnum} readOnly/>
                                        :
                                        <input type='text' value={importfourfld.cSnum} onChange={(e)=>setimportfourfld(prev=>({
                                            ...prev,
                                            cSnum:e.target.value
                                        }))}/>
                                        }
                                    </div>
                                    <div>
                                        <label>Installation Date</label>
                                        {(ticketinfo.ctktcustname!=='' && Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[ticketinfo.ctktcustname], "cIdate") && sharedvalue.workersdata[ticketinfo.ctktcustname].cIdate!=='')?
                                            <input type='text' value={sharedvalue.workersdata[ticketinfo.ctktcustname].cIdate} readOnly/>
                                            :
                                            <input type='text' value={importfourfld.cIdate} onChange={(e)=>setimportfourfld(prev=>({
                                                ...prev,
                                                cIdate:e.target.value
                                            }))}/>
                                        }
                                    </div>
                                </section>
                            }

                            {JSON.stringify(tempimportfourfld)!==JSON.stringify(importfourfld) &&
                            <div className="import-four-update-btn">
                                <button onClick={()=>handleupddateform()}>update</button>
                            </div>
                            }

                            {ticketinfo.ctktcustname==='other' &&
                            <div>
                                <label>Other Company Name<span style={{color:'red'}}>*</span></label>
                                <input type='text' value={ticketinfo.ctktothercustname} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktothercustname:e.target.value
                                }
                                ))}/>
                            </div>
                             }
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
                                <label>Call type<span style={{color:'red'}}>*</span></label>
                                <select value={ticketinfo.ctktcalltype} onChange={(e)=>setticketinfo(prev=>({
                                    ...prev,
                                    ctktcalltype:e.target.value
                                }))}>
                                    <option value='' selected>Select Call Type</option>
                                    <option value='Pre-Installation'>Pre-Installation</option>
                                    <option value='Installation'>Installation</option>
                                    <option value='Charge'>Chargable</option>
                                    <option value='Warranty'>Warranty</option>
                                    <option value='AMC'>AMC</option>
                                    {/* <option value='Free'>Free</option> */}
                                </select>
                            </div>
                            {/* if call type is free or charge */}

                            {
                                (ticketinfo.ctktcalltype==='Charge' || ticketinfo.ctktcalltype==='Warranty' || ticketinfo.ctktcalltype==='AMC') &&
                                <div>
                                    <label>Category<span style={{color:'red'}}>*</span></label>
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
                                 <p>Sorry you won't have any awc or warranty!!!</p>)
                            }
                            {
                                ticketinfo.ctktcustname==='other' && ticketinfo.ctktcalltype==='Warranty' &&
                                <section className="create-ticket-imported-data">
                                    <div>
                                        <label>warranty start date</label>
                                        <input type='date' value={ticketinfo.ctktwtysrtdate} onChange={(e)=>setticketinfo(prev=>({
                                            ...prev,
                                            ctktwtysrtdate:e.target.value,
                                            ctktwtydur:''
                                        }))}/>
                                    </div>
                                    <div>
                                        <label>warranty duration</label>
                                        <select value={ticketinfo.ctktwtydur} onChange={(e)=>{
                                            setticketinfo(prev=>({
                                                ...prev,
                                                ctktwtydur:e.target.value
                                            }));
                                            handlewty(e);
                                        }}>
                                            <option value=''>Choose duration</option>
                                            <option value={1}>1 YEAR</option>
                                            <option value={2}>2 YEARs</option>
                                            <option value={3}>3 YEARs</option>
                                            <option value={4}>4 YEARs</option>
                                            <option value={5}>5 YEARs</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>warranty end date</label>
                                        <input type='date' value={ticketinfo.ctktwtyenddate} readOnly/>
                                    </div>

                                </section>
                            }
                            {
                                ticketinfo.ctktcustname==='other' && ticketinfo.ctktcalltype==='AMC' &&
                                <section className="create-ticket-imported-data">
                                    <div>
                                        <label>AMC start date</label>
                                        <input type='date' value={ticketinfo.ctktamcsrtdate} onChange={(e)=>setticketinfo(prev=>({
                                            ...prev,
                                            ctktamcsrtdate:e.target.value,
                                            ctktamcdur:''
                                        }))}/>
                                    </div>
                                    <div>
                                        <label>AMC duration</label>
                                        <select value={ticketinfo.ctktamcdur} onChange={(e)=>{
                                            setticketinfo(prev=>({
                                                ...prev,
                                                ctktamcdur:e.target.value
                                            }));
                                            handleamcenddate(e);
                                        }}>
                                            <option value=''>choose months</option>
                                            <option value={6}>6 months</option>
                                            <option value={12}>12 months</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>AMC visits</label>
                                        <select value={ticketinfo.ctktamcvisits} onChange={(e)=>setticketinfo(prev=>({
                                            ...prev,
                                            ctktamcvisits:e.target.value
                                        }))}>
                                            <option value=''>choose months</option>
                                            <option value={6}>6 visits</option>
                                            <option value={12}>12 visits</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>AMC end date</label>
                                        <input type='date' value={ticketinfo.ctktamcenddate} readOnly/>
                                    </div>

                                </section>
                            }
                            {/* description starts here */}
                                    <div>
                                        <label>Description</label>
                                        <textarea placeholder="Description" onChange={(e)=>setticketinfo(prev=>({
                                            ...prev,
                                            ctktdes:e.target.value
                                        }))}/>
                                    </div>
                            {/* description ends here */}
                                    <div>
                                        <label>Priority<span style={{color:'red'}}>*</span></label>
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
                <p>it will take few seconds</p>
            </div>
        </>
    );
}

export default Createticket;