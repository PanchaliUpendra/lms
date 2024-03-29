import React, { useContext, useEffect, useState } from 'react';
import './Updatelead.css';
import Sidenav from '../../Sidenav/Sidenav';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import MyContext from '../../../MyContext';
import { counrtycode } from '../../../Data/countrycode';
import { states } from '../../../Data/states';
import { writeBatch} from "firebase/firestore"; 
import { db } from '../../../Firebase';
import { leaddoc } from '../../../Data/Docs';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate} from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Error from '../../../Error/Error';

import { leadsgraphdoc } from '../../../Data/Docs';
import { months } from '../../../Data/Months';

function Updatelead(){
    const sharedvalue = useContext(MyContext);

    //lead id
    const {leadid} = useParams();
    const navigate = useNavigate();
    
    const [open, setOpen] = useState(false);
    const batch = writeBatch(db);// Get a new write batch

    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Updated The LEAD');
    const loginerror = () =>toast.error('Getting error while updaing the LEAD data');
    const loginformerror = () => toast.info('please fill the form correctly');
    const invalidmail = () => toast.warn('leadid does found here!!!');

    //select manager and employee
    const [selectmanager,setselectmanager]=useState({
        managerid:'',
        employee:''
    })
    //customer inquiry
    const [custinquiry,setcustinquiry] = useState({
        custtype:'',//customer type
        custstatus:'',//customer status
        custstartdate:'',//customer start date
        custenddate:'',//customer end date
        custnextdate:'',//customer next date
        custsourceofenquiry:'',//cuatomer source of enquiry
        custcompanyname:''//customer company name
    });
    //contact personal details
    const [contpersondtl,setcontpersondtl] = useState({
        contperson:'',//contact person detail
        contdesignation:'',//contact designation
        contcountrycode:'',//contact country code
        contmobilenum:'',//const mobile number
        contpersonemail:''//const person email
    })
    //alternate contact details
    const [altcontdtl,setaltcontdtl] = useState({
        altcontperson:'', //alternate contact person details
        altcontdesignation:'',//alternate contact designation
        altcontmobile:'',//alternate contact mobile
        altcontemail:''//alternate contact email
    })
    const [altercontact,setaltercont]=useState('')//here is an alternate contact
    const [leadofficedtls,setleadooficedtls]=useState({//office details comes here
        ofd:'',//office details
        ofdcountry:'',//office details country
        ofdst:'',//oofice details state
        ofddst:'',//ofice details district
        ofdcty:'',//office city
        ofdpinc:'',//office pincode
        ofdgstin:'',//GSTIN
        ofdiec:''//office details IE CODE
    })

    //office details and factory are same or not
    const [leadofficefactory,setleadofficefactory]= useState('')
    const [leadfactorydtl,setleadfactorydtl] = useState({// factory details 
        factdtl: '',
        factdtlstate:'',
        factdtlcity:'',
        factdtlpinc:''
    })

    //create lead requirements
    const [leadrequirements,setleadrequirements]=useState({
        businesstype:'',
        millcap:'',
        capreq:'',
        machinereq:'',
        make:'',
        machinetype:'',
        std:'',
        payment:'',
        chutes:'',
        reqdes:''
    })
    // code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here

   
    
    //store whole data in the database
    async function handlecreatelead(){
        setOpen(true);
        try{
            if(
                contpersondtl.contperson!=='' &&
                leadofficedtls.ofdcountry!=='' &&
                leadofficedtls.ofdst!=='' &&
                leadrequirements.machinereq!=='' &&
                leadrequirements.chutes!=='' &&
                custinquiry.custnextdate!==''
            ){
             
            if(leadid!==0){
                //this batch is for updating the leads document!!!
                const temppresentDate = new Date();//lets creating the present date
                const formatDateString = (date) => date.toISOString().split('T')[0];
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
                await batch.update(leaddoc, {[leadid]:{
                        ...sharedvalue.leadsdata[leadid],
                        custtype:custinquiry.custtype,//customer type
                        custstatus:custinquiry.custstatus,//customer status
                        custstartdate:custinquiry.custstartdate,//customer start date
                        custenddate:custinquiry.custenddate,//customer end date
                        custnextdate:custinquiry.custnextdate,//customer next date
                        custsourceofenquiry:custinquiry.custsourceofenquiry,//cuatomer source of enquiry
                        custcompanyname:custinquiry.custcompanyname,//customer company name
                        contperson:contpersondtl.contperson,//contact person detail
                        contdesignation:contpersondtl.contdesignation,//contact designation
                        contcountrycode:contpersondtl.contcountrycode,//contact country code
                        contmobilenum:contpersondtl.contmobilenum,//const mobile number
                        contpersonemail:contpersondtl.contpersonemail,//const person email
                        altcontperson:altcontdtl.altcontperson, //alternate contact person details
                        altcontdesignation:altcontdtl.altcontdesignation,//alternate contact designation
                        altcontmobile:altcontdtl.altcontmobile,//alternate contact mobile
                        altcontemail:altcontdtl.altcontemail,//alternate contact email
                        altercontact:altercontact,//altercontact will check here
                        ofd:leadofficedtls.ofd,//office details
                        ofdcountry:leadofficedtls.ofdcountry,//office details country
                        ofdst:leadofficedtls.ofdst,//oofice details state
                        ofddst:leadofficedtls.ofddst,//ofice details district
                        ofdcty:leadofficedtls.ofdcty,//office city
                        ofdpinc:leadofficedtls.ofdpinc,//office pincode
                        ofdgstin:leadofficedtls.ofdgstin,//GSTIN
                        ofdiec:leadofficedtls.ofdiec,//office details IE CODE
                        leadofficefactory:leadofficefactory,//lead office factory is same or not
                        factdtl:leadfactorydtl.factdtl,//lead factory dtls
                        factdtlstate:leadfactorydtl.factdtlstate,//lead factory state
                        factdtlcity:leadfactorydtl.factdtlcity,//lead factory city
                        factdtlpinc:leadfactorydtl.factdtlpinc,//lead factory pincode
                        businesstype:leadrequirements.businesstype,//lead requirements businesstype
                        millcap:leadrequirements.millcap,//lead requirements mill cap
                        capreq:leadrequirements.capreq,//lead requirements capacity required
                        machinereq:leadrequirements.machinereq,//lead requirements machine req
                        make:leadrequirements.make,//lead requirements make
                        machinetype:leadrequirements.machinetype,//lead requirements machine type
                        std:leadrequirements.std,//lead requirements std
                        payment:leadrequirements.payment,//lead requirements payment
                        chutes:leadrequirements.chutes,//leads requirement chutes
                        reqdes:leadrequirements.reqdes,//lead requirement description,
                        employeeid:selectmanager.employeeid,
                        managerid:selectmanager.managerid,
                        modifiedby:[...sharedvalue.leadsdata[leadid].modifiedby,{
                            uid:sharedvalue.uid,
                            date:formatDateString(temppresentDate),
                            time:formatDateTimeString(temppresentDate)
                        }]
                    }});

                    if(custinquiry.custstatus==='Closed'){
                        //updating the leads graph data
                        let currentDate = new Date();
                        let year = currentDate.getFullYear();
                        let month = (currentDate.getMonth()+1).toString().padStart(2,'0');
                        let yearMonth = year + month;
                        let yearMonthNumber = Number(yearMonth);
                    
                        if(sharedvalue.leadsgraphkeys.includes(yearMonth)){
                        
                            await batch.update(leadsgraphdoc,{
                                [yearMonthNumber]:{
                                    ...sharedvalue.leadsgraphdata[yearMonthNumber],
                                    lc:Number(sharedvalue.leadsgraphdata[yearMonthNumber].lc)+1,
                                }
                            })
                        }else{
                            
                            await batch.update(leadsgraphdoc,{
                                [yearMonthNumber]:{
                                    lo:0,
                                    lc:1,
                                    month:months[month]
                                }
                            })
                        }
                        //updating the leads graph ends here
                    }

                
                await batch.commit();
                loginsuccess();
                navigate(-1);
               
                window.scrollTo({top:0,behavior:'smooth'})
            }else{
                invalidmail()
            }
        }
        else{//if given credentials are not given
            loginformerror();
        }
        
        }catch(e){
            console.error('you getting error while adding the lead:',e);
            loginerror()
        }
        setOpen(false);
    }
    
    useEffect(()=>{
        const currentDate = new Date();
        // Calculate the future date by adding 75 years
        const futureDate = new Date(currentDate);
        futureDate.setFullYear(currentDate.getFullYear() + 75);
        //future week
        const futureweek = new Date(currentDate);
        futureweek.setDate(currentDate.getDate() + 7);
        // Format dates for display
        const formatDateString = (date) => date.toISOString().split('T')[0];
        setcustinquiry(prev=>({
            ...prev,
            custstartdate:formatDateString(currentDate),
            custenddate:formatDateString(futureDate),
            custnextdate:formatDateString(futureweek)
        }))
        if(sharedvalue.leadskeys.length>0 && sharedvalue.leadskeys.includes(leadid)){
            //setselectmanager
            setselectmanager(prev=>({
                ...prev,
                managerid:sharedvalue.leadsdata[leadid].managerid,
                employeeid:sharedvalue.leadsdata[leadid].employeeid
            }))
            //setcustinquirey
            setcustinquiry(prev=>({
                ...prev,
                custtype:sharedvalue.leadsdata[leadid].custtype,//customer type
                custstatus:sharedvalue.leadsdata[leadid].custstatus,//customer status
                custstartdate:sharedvalue.leadsdata[leadid].custstartdate,//customer start date
                custenddate:sharedvalue.leadsdata[leadid].custenddate,//customer end date
                custnextdate:sharedvalue.leadsdata[leadid].custnextdate,//customer next date
                custsourceofenquiry:sharedvalue.leadsdata[leadid].custsourceofenquiry,//cuatomer source of enquiry
                custcompanyname:sharedvalue.leadsdata[leadid].custcompanyname//customer company name
            }));
            //setcontperson dtls
            setcontpersondtl(prev=>({
                ...prev,
                contperson:sharedvalue.leadsdata[leadid].contperson,//contact person detail
                contdesignation:sharedvalue.leadsdata[leadid].contdesignation,//contact designation
                contcountrycode:sharedvalue.leadsdata[leadid].contcountrycode,//contact country code
                contmobilenum:sharedvalue.leadsdata[leadid].contmobilenum,//const mobile number
                contpersonemail:sharedvalue.leadsdata[leadid].contpersonemail//const person email
            }));
            //setaltcontdtl
            setaltcontdtl(prev=>({
                ...prev,
                altcontperson:sharedvalue.leadsdata[leadid].altcontperson, //alternate contact person details
                altcontdesignation:sharedvalue.leadsdata[leadid].altcontdesignation,//alternate contact designation
                altcontmobile:sharedvalue.leadsdata[leadid].altcontmobile,//alternate contact mobile
                altcontemail:sharedvalue.leadsdata[leadid].altcontemail//alternate contact email
            }))
            //setaltercont
            setaltercont(sharedvalue.leadsdata[leadid].altercontact);
            //setlead office details
            setleadooficedtls(prev=>({
                ...prev,
                ofd:sharedvalue.leadsdata[leadid].ofd,//office details
                ofdcountry:sharedvalue.leadsdata[leadid].ofdcountry,//office details country
                ofdst:sharedvalue.leadsdata[leadid].ofdst,//oofice details state
                ofddst:sharedvalue.leadsdata[leadid].ofddst,//ofice details district
                ofdcty:sharedvalue.leadsdata[leadid].ofdcty,//office city
                ofdpinc:sharedvalue.leadsdata[leadid].ofdpinc,//office pincode
                ofdgstin:sharedvalue.leadsdata[leadid].ofdgstin,//GSTIN
                ofdiec:sharedvalue.leadsdata[leadid].ofdiec//office details IE CODE
            }));
            //set lead office factory
            setleadofficefactory(sharedvalue.leadsdata[leadid].leadofficefactory);
            //set lead factory details
            setleadfactorydtl(prev=>({// factory details
                ...prev, 
                factdtl:sharedvalue.leadsdata[leadid].factdtl,
                factdtlstate:sharedvalue.leadsdata[leadid].factdtlstate,
                factdtlcity:sharedvalue.leadsdata[leadid].factdtlcity,
                factdtlpinc:sharedvalue.leadsdata[leadid].factdtlpinc
            }));
            //set lead requirements
            setleadrequirements(prev=>({
                ...prev,
                businesstype:sharedvalue.leadsdata[leadid].businesstype,
                millcap:sharedvalue.leadsdata[leadid].millcap,
                capreq:sharedvalue.leadsdata[leadid].capreq,
                machinereq:sharedvalue.leadsdata[leadid].machinereq,
                make:sharedvalue.leadsdata[leadid].make,
                machinetype:sharedvalue.leadsdata[leadid].machinetype,
                std:sharedvalue.leadsdata[leadid].std,
                payment:sharedvalue.leadsdata[leadid].payment,
                chutes:sharedvalue.leadsdata[leadid].chutes,
                reqdes:sharedvalue.leadsdata[leadid].reqdes
            }));

        }
    },[leadid,sharedvalue.leadsdata,sharedvalue.leadskeys]);
    return(
        <>
        {(sharedvalue.leadskeys.length>0 && sharedvalue.leadskeys.includes(leadid))===true && (sharedvalue.leadsdata[leadid].custstatus==='Closed' || sharedvalue.leadsdata[leadid].custstatus==='Lost')===false &&
        (sharedvalue.role==='admin' ||
        (sharedvalue.role==='employee' && sharedvalue.leadsdata[leadid].employeeid===sharedvalue.uid)||
        (sharedvalue.role==='manager' && sharedvalue.leadsdata[leadid].managerid===sharedvalue.uid)||
        sharedvalue.uid===sharedvalue.leadsdata[leadid].createdbyid)===true?
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

                    {/* create lead starts from here */}
                    <div className='create-lead-con'>
                        {/* create lead head */}
                        <div className='create-lead-head'>
                            <h1>Update Lead</h1>
                        </div>
                        <div className='create-lead-head-button-comes-here'>
                            <button onClick={()=>navigate(-1)}>
                                <ChevronLeftIcon/>
                                Go Back
                            </button>
                        </div>
                        {/* view manqager and employee starts here*/}
                        <div className='create-lead-requirements'>
                            {(sharedvalue.role==='admin' || sharedvalue.role==='manager') && 
                                <div className='create-lead-requirements-head'>
                                    <h1>manager and employee</h1>
                                </div>
                            }
                                <div className='create-lead-requirements-all-fields'>
                                {/* manger  */}
                                {sharedvalue.role==='admin' && 
                                <div>
                                    <label>Manager</label>
                                    
                                    <select value={selectmanager.managerid} onChange={(e)=>setselectmanager(prev=>({
                                        ...prev,
                                        employeeid:'',
                                        managerid:e.target.value
                                    }))}>
                                        <option value=''>select manager</option>
                                        {
                                            sharedvalue.workerskeys.filter((item)=>sharedvalue.workersdata[item].role==='manager').map((manager,idx)=>(
                                                <option value={manager} key={idx}>{sharedvalue.workersdata[manager].name}</option>
                                            ))
                                        }
                                    </select>
                                    
                                </div>
                                }
                                {/* employee */}
                                {(sharedvalue.role==='admin' || (sharedvalue.role==='manager' && sharedvalue.uid===sharedvalue.leadsdata[leadid].managerid)) &&
                                <div>
                                    <label>Employee</label>
                                    <select value={selectmanager.employeeid} onChange={(e)=>setselectmanager(prev=>({
                                        ...prev,
                                        employeeid:e.target.value
                                    }))}>
                                        <option value=''>select employee</option>
                                        {
                                            sharedvalue.workerskeys.filter((item)=>sharedvalue.workersdata[item].role==='employee' && sharedvalue.workersdata[item].managerid===selectmanager.managerid).map((employee,idx)=>(
                                                <option value={employee} key={idx}>{sharedvalue.workersdata[employee].name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                }
                            </div>
                        </div>
                        {/* view manager and employee ends here */}
                        
                        {/* customer inquiry form */}
                        <div className='customer-inquiry-form'>
                            <div className='cust-inq-form-head'>
                                <h1>customer inquiry form</h1>
                            </div>
                            
                            {/* customer inquiry form start from here */}
                            <div className='cust-inq-inner-form'>
                                {/* first row */}
                                <div className='cust-inq-customer-type-status'>
                                    <div className='cust-inq-customer-type'>
                                        <label>customer type</label>
                                        <select value={custinquiry.custtype} onChange={(e)=>setcustinquiry(prev=>({
                                            ...prev,
                                            custtype:e.target.value
                                        }))}>
                                            
                                            <option value='New'>New</option>
                                            <option value='Old'>Old</option>
                                        </select>
                                    </div>

                                    {(sharedvalue.role==='manager' || sharedvalue.role==='employee' || sharedvalue.role==='admin') === true && 
                                    <div className='cust-inq-customer-status'>
                                        <label>customer status</label>
                                        <select value={custinquiry.custstatus} onChange={(e)=>setcustinquiry(prev=>({
                                            ...prev,
                                            custstatus:e.target.value
                                        }))}>
                                            
                                            <option value='Active'>Active</option>
                                            <option value='Closed'>Closed</option>
                                            <option value='Name Changed'>Name Changed</option>
                                            <option value='Cold'>Cold</option>
                                            <option value='Lost'>Lost</option>
                                        </select>
                                    </div>
                                    }
                                    

                                </div>
                                
                                {/* second  row*/}
                                <div className='cust-inq-start-end-next-date'>
                                    <div className='cust-inq-start-date'>
                                        <label>start date</label>
                                        <input type='date' value={custinquiry.custstartdate} onChange={(e)=>setcustinquiry(prev=>({
                                            ...prev,
                                            custstartdate:e.target.value
                                        }))}/>
                                    </div>
                                    <div className='cust-inq-end-date'>
                                        <label>End date</label>
                                        <input type='date' value={custinquiry.custenddate} onChange={(e)=>setcustinquiry(prev=>({
                                            ...prev,
                                            custenddate:e.target.value
                                        }))}/>
                                    </div>
                                    <div className='cust-inq-next-date'>
                                        <label>next  date</label>
                                        <input type='date' value={custinquiry.custnextdate} onChange={(e)=>setcustinquiry(prev=>({
                                            ...prev,
                                            custnextdate:e.target.value
                                        }))}/>
                                    </div>
                                </div>
                                {/* third row */}
                                <div className='cust-inq-source-of-enquiry'>
                                    <label>source of enquiry</label>
                                    <select value={custinquiry.custsourceofenquiry} onChange={(e)=>setcustinquiry(prev=>({
                                            ...prev,
                                            custsourceofenquiry:e.target.value
                                        }))}>
                                        <option value='Just Dial'>Just Dial</option>
                                        <option value='Exhibition'>Exhibition</option>
                                        <option value='Direct'>Direct</option>
                                        <option value='Referal'>Referal</option>
                                    </select>

                                </div>
                                {/* fourth div */}
                                <div className='cust-inq-company-name'>
                                    <label>company name</label>
                                    <input type='text' value={custinquiry.custcompanyname} onChange={(e)=>setcustinquiry(prev=>({
                                        ...prev,
                                        custcompanyname:e.target.value
                                    }))}/>
                                </div>
                            </div>
                        </div>
                        {/* customer inquriy form completed */}

                        {/*contact5 personal details  starts here*/}
                        <div className='con-per-dtl'>
                            <div className='con-per-dtl-head'>
                                <h1>contact personal details</h1>
                            </div>
                            {/* personal row 1 */}
                            <div className='con-contact-designation-person'>
                                <div className='con-contact-person'>
                                    <label>contact person</label>
                                    <input type='text' value={contpersondtl.contperson} onChange={(e)=>setcontpersondtl(prev=>({
                                        ...prev,
                                        contperson:e.target.value
                                    }))}/>
                                </div>
                                <div className='con-designation-person'>
                                    <label>Designation</label>
                                    <select value={contpersondtl.contdesignation} onChange={(e)=>setcontpersondtl(prev=>({
                                        ...prev,
                                        contdesignation:e.target.value
                                    }))}>
                                        <option value='MD'>MD</option>
                                        <option value='MG'>MG</option>
                                        <option value='Propriter'>Propriter</option>
                                        <option value='CEO'>CEO</option>
                                    </select>
                                </div>
                            </div>
                            {/* personal second row */}
                            <div className='con-person-email-number'>
                                <div className='con-person-contact-number'>
                                    <label>contact person number</label>
                                    <div className='con-person-contact-number-inner'>
                                        <select value={contpersondtl.contcountrycode} onChange={(e)=>setcontpersondtl(prev=>({
                                        ...prev,
                                        contcountrycode:e.target.value
                                    }))}>
                                            
                                            {
                                                counrtycode.map((item,idx)=>(
                                                    <option key={idx} value={item.code}>{item.name}</option>
                                                ))
                                            }
                                        </select>
                                        <input type='number' value={contpersondtl.contmobilenum} 
                                        onChange={(e)=>setcontpersondtl(prev=>({
                                        ...prev,
                                        contmobilenum:e.target.value
                                    }))}/>

                                    </div>
                                </div>
                                <div className='con-person-contact-email'>
                                    <label>contact personal email</label>
                                    <input type='email' value={contpersondtl.contpersonemail}
                                        onChange={(e)=>setcontpersondtl(prev=>({
                                        ...prev,
                                        contpersonemail:e.target.value
                                    }))}/>
                                </div>
                            </div>
                            {/* personal third row */}
                            <div className='con-alternate-personal-info'>
                                <div>
                                    <input type='radio' checked={altercontact==='No'} onChange={()=>setaltercont('No')}/>
                                    <label>no alternate contact details</label>
                                </div>
                                <div>
                                    <input type='radio' checked={altercontact==='Yes'} onChange={()=>setaltercont('Yes')}/>
                                    <label>alternate contact details</label>
                                </div>
                            </div>
                            {/* alternate number */}
                            {altercontact==='Yes' && 
                            <div className='contact-person-alternate-number'>
                                <div className='alternate-number-form-head'>
                                    <h1>alternate person details</h1>
                                </div>
                                 {/* first row comes here  */}
                                <div className='con-per-alter-num-each'>
                                    <label>alternate contact person</label>
                                    <input type='text' value={altcontdtl.altcontperson} 
                                    onChange={(e)=>setaltcontdtl(prev=>({
                                        ...prev,
                                        altcontperson:e.target.value
                                    }))}
                                    />
                                </div>
                                <div className='con-designation-person'>
                                    <label>Designation</label>
                                    <select value={altcontdtl.altcontdesignation}
                                    onChange={(e)=>setaltcontdtl(prev=>({
                                        ...prev,
                                        altcontdesignation:e.target.value
                                    }))}
                                    >
                                        
                                        <option value='MD'>MD</option>
                                        <option value='MG'>MG</option>
                                        <option value='propriter'>propriter</option>
                                        <option value='CEO'>CEO</option>
                                    </select>
                                </div>
                                <div className='con-per-alter-num-each'>
                                    <label>alternate contact number / whatsApp number</label>
                                    <input type='text' value={altcontdtl.altcontmobile}
                                    onChange={(e)=>setaltcontdtl(prev=>({
                                        ...prev,
                                        altcontmobile:e.target.value
                                    }))}
                                    />
                                </div><div className='con-per-alter-num-each'>
                                    <label>alternate contact email</label>
                                    <input type='text' value={altcontdtl.altcontemail} 
                                    onChange={(e)=>setaltcontdtl(prev=>({
                                        ...prev,
                                        altcontemail:e.target.value
                                    }))}
                                    />
                                </div>
                            </div>}
                        </div>
                        {/* contact personal details ends here */}

                        {/* office details starts here */}
                        <div className='create-lead-office-details-con'>
                                <div className='create-lead-office-details-head'>
                                    <h1>office details</h1>
                                </div>
                                <div className='cl-office-dtl-country-form'>
                                    <div className='cl-office-dtl-form'>
                                        <label>Office Details</label>
                                        <textarea value={leadofficedtls.ofd} onChange={(e)=>setleadooficedtls(prev=>({
                                            ...prev,
                                            ofd:e.target.value
                                        }))} />
                                    </div>
                                    <div className='cl-office-dtl-country'>
                                        <label>country</label>
                                        <select value={leadofficedtls.ofdcountry} onChange={(e)=>setleadooficedtls(prev=>({
                                            ...prev,
                                            ofdcountry:e.target.value
                                        }))}>
                                            
                                            {
                                                counrtycode.map((item,idx)=>(
                                                    <option key={idx} value={item.name}>{item.name}</option>
                                                ))
                                            }
                                            <option value='other'>other</option>
                                        </select>
                                    </div>
                                </div>
                                {/* grid for remaing office details */}
                                <div className='office-details-remaining'>
                                   {leadofficedtls.ofdcountry!=='' &&
                                   <div>
                                        <label>state</label>
                                        {/* if country is india ,select state*/}
                                        {leadofficedtls.ofdcountry==='India' &&
                                        <select value={leadofficedtls.ofdst} onChange={(e)=>setleadooficedtls(prev=>({
                                            ...prev,
                                            ofdst:e.target.value
                                        }))}>
                                            
                                            {
                                                states.map((item,idx)=>(
                                                    <option key={idx} value={item.state}>{item.state}</option>
                                                ))
                                            }
                                        </select>
                                        }
                                        {/* if country is not india select state*/}
                                        {
                                            leadofficedtls.ofdcountry!=='India' &&
                                            <input type='text' value={leadofficedtls.ofdst} onChange={(e)=>setleadooficedtls(prev=>({
                                                    ...prev,
                                                    ofdst:e.target.value
                                                }))}/>
                                        }
                                    </div>
                                   }
                                   {/* this is the option for district */}
                                   {
                                    leadofficedtls.ofdcountry!=='' && leadofficedtls.ofdst!=='' &&
                                    <div>
                                        <label>district</label>
                                        {/* if country india  */}
                                        {
                                            leadofficedtls.ofdcountry==='India' &&
                                            <select value={leadofficedtls.ofddst} onChange={(e)=>setleadooficedtls(prev=>({
                                                ...prev,
                                                ofddst:e.target.value
                                            }))}>
                                                
                                                {states.filter(item=>item.state===leadofficedtls.ofdst)[0].districts.map((prod,idx)=>(
                                                    <option key={idx} value={prod}>{prod}</option>
                                                ))}
                                            </select>
                                        }
                                        {/* if country is not india */}
                                        {
                                            leadofficedtls.ofdcountry!=='India' &&
                                            <input type='text' value={leadofficedtls.ofddst} onChange={(e)=>setleadooficedtls(prev=>({
                                                ...prev,
                                                ofddst:e.target.value
                                            }))}/>
                                        }
                                        
                                    </div>
                                   }
                                    
                                    <div>
                                        <label>city / town / village</label>
                                        <input type='text' value={leadofficedtls.ofdcty} onChange={(e)=>setleadooficedtls(prev=>({
                                            ...prev,
                                            ofdcty:e.target.value
                                        }))}/>
                                    </div>
                                    <div>
                                        <label>pincode</label>
                                        <input type='number' value={leadofficedtls.ofdpinc} onChange={(e)=>setleadooficedtls(prev=>({
                                            ...prev,
                                            ofdpinc:e.target.value
                                        }))}/>
                                    </div>
                                    <div>
                                        <label>GSTIN</label>
                                        <input type='text' value={leadofficedtls.ofdgstin} onChange={(e)=>setleadooficedtls(prev=>({
                                            ...prev,
                                            ofdgstin:e.target.value
                                        }))}/>
                                    </div>
                                    <div>
                                        <label>IE Code</label>
                                        <input type='text' value={leadofficedtls.ofdiec} onChange={(e)=>setleadooficedtls(prev=>({
                                            ...prev,
                                            ofdiec:e.target.value
                                        }))}/>
                                    </div>
                                </div>
                        </div>
                        {/* office details ends here */}

                        {/* office details radio buttons starts here*/}
                        <div className='office-factory-alternate'>
                            <div>
                                <input type='radio' checked={leadofficefactory==='YES'} onChange={()=>setleadofficefactory('YES')}/>
                                <label>Office address same as Factory address</label>
                            </div>
                            <div>
                                <input type='radio' checked={leadofficefactory==='NO'} onChange={()=>setleadofficefactory('NO')}/>
                                <label>Factory address is different from office address</label>
                            </div>
                        </div>
                        {/* office details radio buttons ends here*/}

                        {/* factory bdetails starts from here */}
                        {
                            leadofficefactory==='NO' &&
                            <div className='clead-factory-details'>
                                <section className='clead-factory-details-lead'>
                                    <h1>Factory details</h1>
                                </section>
                                <div>
                                    <label>Factory Details</label>
                                    <textarea value={leadfactorydtl.factdtl} onChange={(e)=>setleadfactorydtl(prev=>({
                                        ...prev,
                                        factdtl:e.target.value
                                    }))}/>
                                </div>
                                {leadofficedtls.ofdcountry!=='' &&
                                   <div>
                                        <label>state</label>
                                        {/* if country is india ,select state*/}
                                        {leadofficedtls.ofdcountry==='India' &&
                                        <select value={leadfactorydtl.factdtlstate} onChange={((e)=>setleadfactorydtl(prev=>({
                                            ...prev,
                                            factdtlstate:e.target.value
                                        })))}>
                                            
                                            {
                                                states.map((item,idx)=>(
                                                    <option key={idx} value={item.state}>{item.state}</option>
                                                ))
                                            }
                                        </select>
                                        }
                                        {/* if country is not india select state*/}
                                        {
                                            leadofficedtls.ofdcountry!=='India' &&
                                            <input type='text' value={leadfactorydtl.factdtlstate} onChange={((e)=>setleadfactorydtl(prev=>({
                                                ...prev,
                                                factdtlstate:e.target.value
                                            })))}/>
                                        }
                                    </div>
                                   }
                                <div>
                                    <label>Factory City</label>
                                    <input type='text' value={leadfactorydtl.factdtlcity} onChange={(e)=>setleadfactorydtl(prev=>({
                                        ...prev,
                                        factdtlcity:e.target.value
                                    }))}/>
                                </div>
                                <div>
                                    <label>Factory Pincode</label>
                                    <input type='number' value={leadfactorydtl.factdtlpinc} onChange={(e)=>setleadfactorydtl(prev=>({
                                        ...prev,
                                        factdtlpinc:e.target.value
                                    }))}/>
                                </div>
                            </div>
                        }
                        {/* factory details ends here */}

                        {/* create lead requirements starts here*/}
                        <div className='create-lead-requirements'>
                            <div className='create-lead-requirements-head'>
                                <h1>REQUIREMENTS</h1>
                            </div>
                            <div className='create-lead-mill-businesstype'>
                                <select value={leadrequirements.businesstype} onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    businesstype:e.target.value
                                }))}>
                                    
                                    <option value='dall mill'>Dall Mill</option>
                                    <option value='rice mill'>Rice Mill</option>
                                    <option value='multigrain'>Multigrain</option>
                                    <option value='spices'>Spices</option>
                                    <option value='quartz'>Quartz</option>
                                    <option value='mminerals'>Minerals</option>
                                    <option value='plastics'>Plastics</option>
                                    <option value='others'>Others</option>
                                </select>
                            </div>
                            <div className='create-lead-req-grid'>
                                <div>
                                    <label>Mill Capacity (per Hour)</label>
                                    <input type='number' value={leadrequirements.millcap} onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    millcap:e.target.value
                                }))}/>
                                </div>
                                <div>
                                    <label>Capacity Required (per Hour)</label>
                                    <input type='number' value={leadrequirements.capreq} onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    capreq:e.target.value
                                }))}/>
                                </div>
                                <div>
                                    <label>Machine Required</label>
                                    <select value={leadrequirements.machinereq} onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    machinereq:e.target.value
                                }))}>
                                        
                                        <option value='Sorter'>Sorter</option>
                                        <option value='Packing Machine'>Packing Machine</option>
                                        <option value='Classifer'>Classifer</option>
                                        <option value='Destoner'>Destoner</option>
                                        <option value='Cyclone'>Cyclone</option>
                                        <option value='Airlock'>Airlock</option>
                                        <option value='Elevator'>Elevator</option>
                                        <option value='Rubber Rolls'>Rubber Rolls</option>
                                        <option value='Emery stoner'>Emery stoner</option>
                                        <option value='Air Compressor'>Air Compressor</option>
                                        <option value='UPS'>UPS</option>
                                        <option value='Complete Projects'>Complete Projects</option>
                                        <option value='Grain Dryers'>Grain Dryers</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Make</label>
                                    <select value={leadrequirements.make}  onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    make:e.target.value
                                }))}>
                                        
                                        <option value='Comaas'>Comaas</option>
                                        <option value='NDPL'>NDPL</option>
                                    </select>
                                </div>
                                <div>
                                    <select value={leadrequirements.machinetype} onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    machinetype:e.target.value
                                }))} >
                                        
                                        <option value='ULTIMA'>ULTIMA</option>
                                        <option value='ULTRA-S'>ULTRA-S</option>
                                        <option value='RGBS'>RGBS</option>
                                        <option value='FALCON'>FALCON</option>
                                    </select>
                                </div>
                                <div>
                                    <select value={leadrequirements.std} onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    std:e.target.value
                                }))}>
                                        <option value='STD'>STD</option>
                                        <option value='EXP'>EXP</option>
                                    </select>
                                </div>
                                <div>
                                    <select value={leadrequirements.payment} onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    payment:e.target.value
                                }))}>
                                        
                                        <option value='LC'>LC</option>
                                        <option value='TT'>TT</option>
                                        <option value='EMI'>EMI</option>
                                    </select>
                                </div>
                                <div>
                                    <select value={leadrequirements.chutes} onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    chutes:e.target.value
                                }))}>
                                        
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                    </select>
                                </div>
                                <div>
                                    <textarea value={leadrequirements.reqdes} onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    reqdes:e.target.value
                                }))}/>
                                </div>
                            </div>

                        </div>
                        {/* create lead requirements ends here */}

                        {/* create lead button starts here */}
                        <div className='create-lead-submit-btns'>
                            <button onClick={()=>handlecreatelead()}>update lead</button>
                        </div>
                        {/* create lead button ends here */}
                    </div>
                </div>
            </div>:<Error/>
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

export default Updatelead;