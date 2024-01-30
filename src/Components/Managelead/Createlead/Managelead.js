import React, { useContext, useEffect, useState } from 'react';
import './Managelead.css';
import Sidenav from '../../Sidenav/Sidenav';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import MyContext from '../../../MyContext';
import { counrtycode } from '../../../Data/countrycode';
import { states } from '../../../Data/states';
import { onSnapshot, writeBatch} from "firebase/firestore"; 
import { db } from '../../../Firebase';
import { createleadiddoc, leaddoc , createmeetings } from '../../../Data/Docs';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Managelead(){
    const sharedvalue = useContext(MyContext);
    
    const [open, setOpen] = useState(false);
    const batch = writeBatch(db);// Get a new write batch

    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Added The LEAD');
    const loginerror = () =>toast.error('Getting error while Adding the LEAD data');
    const loginformerror = () => toast.info('please fill the form correctly');
    const invalidmail = () => toast.warn('unique id was not generating!!!');


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
    const [altercontact,setaltercont]=useState('No')//here is an alternate contact
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
    const [leadofficefactory,setleadofficefactory]= useState('YES')
    const [leadfactorydtl,setleadfactorydtl] = useState({// factory details 
        factdtl:'',
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

    //generating the uuid from the database
    const fetchuuid = async() => {
            try{ 
                return new Promise((resolve, reject) => {
                    onSnapshot(createleadiddoc, (doc) => {
                        const tempuuid = doc.data();
                        resolve(tempuuid.uuid + 1);
                    });
                });
                }catch(e){
                    console.log('you got an error while fetching the uuid data',e);
                }
            }
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
             //fetching uuid  
             const result = await fetchuuid();
            if(result!==0){
                //this batch is for updating the leads document!!!
                await batch.update(leaddoc, {[result]:{
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
                        employeeid:'',
                        managerid:'',
                        latesttitle:['started now'],
                        latestsubtitle:['No subtitle'],
                        latestcomment:['No Comment'],
                        modifiedby:[],
                        createdbyid:sharedvalue.uid
                    }});
                
                //updating the meeting
                await batch.update(createmeetings,{
                    [result]:[
                        {
                            date:custinquiry.custnextdate,
                            title:'first meeting',
                            subtitle:'first one will come here',
                            comment:'no comments',
                            addedby:sharedvalue.uid

                        }
                    ]
                })

                //this is for updating the lead uuid
                await batch.update(createleadiddoc,{
                    "uuid":result
                })
                await batch.commit();
                loginsuccess();
                //after completeing the form registration give the default values
                setcustinquiry(prev=>({ //filling the inquiry to its previous state
                    ...prev,
                    custtype:'',//customer type
                    custstatus:'',//customer status
                    custsourceofenquiry:'',//cuatomer source of enquiry
                    custcompanyname:''//customer company name
                }));
                setcontpersondtl(prev=>({ //setting previous state to the contact person
                    ...prev,
                    contperson:'',//contact person detail
                    contdesignation:'',//contact designation
                    contcountrycode:'',//contact country code
                    contmobilenum:'',//const mobile number
                    contpersonemail:''//const person email
                }));
                setaltcontdtl(prev=>({
                    ...prev,
                    altcontperson:'', //alternate contact person details
                    altcontdesignation:'',//alternate contact designation
                    altcontmobile:'',//alternate contact mobile
                    altcontemail:''//alternate contact email
                }));
                setaltercont('NO');//alternate contact is there or not
                setleadooficedtls(prev=>({ //lead office details
                    ...prev,
                    ofd:'',//office details
                    ofdcountry:'',//office details country
                    ofdst:'',//oofice details state
                    ofddst:'',//ofice details district
                    ofdcty:'',//office city
                    ofdpinc:'',//office pincode
                    ofdgstin:'',//GSTIN
                    ofdiec:''//office details IE CODE
                }))
                setleadofficefactory('YES');
                setleadfactorydtl(prev=>({
                    ...prev,
                    factdtl:'',
                    factdtlstate:'',
                    factdtlcity:'',
                    factdtlpinc:''
                }));
                setleadrequirements(prev=>({
                    ...prev,
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
                }));
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
                            <SearchIcon />
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>

                    {/* create lead starts from here */}
                    <div className='create-lead-con'>
                        {/* create lead head */}
                        <div className='create-lead-head'>
                            <h1>Create Lead</h1>
                        </div>
                        
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
                                            <option value='' selected disabled>Select Type</option>
                                            <option value='New'>New</option>
                                            <option value='Old'>Old</option>
                                        </select>
                                    </div>
                                    <div className='cust-inq-customer-status'>
                                        <label>customer status</label>
                                        <select value={custinquiry.custstatus} onChange={(e)=>setcustinquiry(prev=>({
                                            ...prev,
                                            custstatus:e.target.value
                                        }))}>
                                            <option value='' selected disabled>Select Status</option>
                                            <option value='Active'>Active</option>
                                            <option value='Closed'>Closed</option>
                                            <option value='Name Changed'>Name Changed</option>
                                            <option value='Cold'>Cold</option>
                                            <option value='Lost'>Lost</option>
                                        </select>
                                    </div>
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
                                        <option value='Just Dial' selected>Just Dial</option>
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
                                        <option value='' selected disabled>Select Designation</option>
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
                                            <option value='' selected disabled>Select Code</option>
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
                                        <option value='' selected disabled>Select Designation</option>
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
                                            <option value='' selected>Select Country</option>
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
                                            <option value='' selected disabled>Select State</option>
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
                                                <option value='' selected disabled>Select Districct</option>
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
                                            <option value='' selected disabled>Select State</option>
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
                                    <option value='' selected>Select Mill/Business Type</option>
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
                                    <input type='number' onChange={(e)=>setleadrequirements(prev=>({
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
                                        <option value='' selected>Required Machine</option>
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
                                        <option value='' selected disabled>Select</option>
                                        <option value='Commas'>Commas</option>
                                        <option value='NDPL'>NDPL</option>
                                    </select>
                                </div>
                                <div>
                                    <select value={leadrequirements.machinetype} onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    machinetype:e.target.value
                                }))} >
                                        <option value='' selected disabled>Select</option>
                                        <option value='ULTIMA'>ULTIMA</option>
                                        <option value='ULTRA'>ULTRA</option>
                                        <option value='RGBS'>RGBS</option>
                                        <option value='FALCON'>FALCON</option>
                                    </select>
                                </div>
                                <div>
                                    <select value={leadrequirements.std} onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    std:e.target.value
                                }))}>
                                        <option value='' selected disabled>Select</option>
                                        <option value='STD'>STD</option>
                                        <option value='EXP'>EXP</option>
                                    </select>
                                </div>
                                <div>
                                    <select value={leadrequirements.payment} onChange={(e)=>setleadrequirements(prev=>({
                                    ...prev,
                                    payment:e.target.value
                                }))}>
                                        <option value='' selected disabled>Select</option>
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
                                        <option value='' selected>choose number of chutes</option>
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
                            <button onClick={()=>handlecreatelead()}>create lead</button>
                        </div>
                        {/* create lead button ends here */}
                    </div>
                </div>
            </div>
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

export default Managelead;