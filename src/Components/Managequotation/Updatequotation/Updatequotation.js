import React, {useContext, useEffect, useState } from "react";
import './Updatequotation.css';
// import SearchIcon from '@mui/icons-material/Search';
import Notify from "../../Notifications/Notify";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import { counrtycode } from "../../../Data/countrycode";
// import {  createquotes } from "../../../Data/Docs";
import {writeBatch} from "firebase/firestore";
import { db } from "../../../Firebase";
import { doc } from "firebase/firestore";
//importing the notifications
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// just checking the ckeditor is working or not
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

//debounce metyhod
// import debounce from "debounce";
import { useNavigate, useParams } from "react-router-dom";
import Error from "../../../Error/Error";

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


function Updatequotation(){
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);//get a new write batch
    const navigate = useNavigate();
    const {quoteid} = useParams();
     //backdrop loading toggle
     const[showloading,setshowloading] = useState(false);
     // adding notifications 
     const loginsuccess = () =>toast.success('Successfully updated the Quotation');
     const loginerror = () =>toast.error('Getting Error while updating Quotation');
     const loginformerror = () => toast.info('please fill the form correctly');
    //create quotation all required fields comes here
    const [quotinfo,setquotinfo] = useState({
        quotcountry:'',
        quotstate:'',
        quotcustname:'',
        // quotlead:'',
        quottype:'',
        quotcompanyname:'',
        quotmachinetype:'',
        quotprodtype:'',
        quotcap:'',//also known as chutes
        quotprice:'',
        quotdim:'',
        quotcon:'',
        quotunits:'',
        quotpayment:'',
        quotclearing:'',
        quotdestination:'',
        quotwarranty:'',
        quotaddinfo:'',
        quotstatus:'open',
        quotperfomaiorquot:'',
        withgstornot:'',
        //common for both usd and gst
        // custcompanyname:'',
        ofdcty:'',
        contperson:'',
        businesstype:'',
        //extra fields for gst
        // ofdst:'',//state
        ofddst:'',//district
        ofdpinc:'',//pincode
        contmobilenum:'',//mobile number
        altcontmobile:''//alternative mobile number
    })
    //create all states
    const [allstates,setallstates] = useState([]);
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    //function to create the array of states
    function handlestatesbycountries(e){
        setquotinfo(prev=>({
            ...prev,
            quotcountry:e.target.value
        }));
        var temparr = sharedvalue.leadskeys.filter(item=>sharedvalue.leadsdata[item].ofdcountry===e.target.value).map((item)=>sharedvalue.leadsdata[item].ofdst).filter((value, index, self) => {
            return self.indexOf(value) === index;
          });
        setallstates(temparr);

    }

   
    

    //ck editor is completed, lest get data from it , thats it!!!
    const [editorData,setEditorData] = useState(''); //ck editor data

    // const handleEditorChange = debounce((event, editor) => {
    //     const data = editor.getData();
    //     setEditorData(data);
        
    //   },300);
    const handleEditorChange =(e)=>{
        e.preventDefault();
        // console.log('data:',e.target.value);
        setEditorData(e.target.value);
    }
    // here handling the submitdata
    async function handlesubmitdata(){
        setshowloading(true);
        try{
            if(
                quotinfo.quotcountry!=='' &&
                quotinfo.quotstate!=='' &&
                quotinfo.quotcustname!=='' &&
                // quotinfo.quotlead!=='' &&
                quotinfo.quotmachinetype!=='' &&
                quotinfo.quotprodtype!=='' &&
                quotinfo.quotcap!=='' &&
                quotinfo.quotprice!=='' &&
                quotinfo.quotpayment!=='' &&
                quotinfo.quotwarranty!=='' &&
                quotinfo.quotperfomaiorquot!=='' &&
                quotinfo.withgstornot!==''
            ){
            if(quoteid!==0){
                await batch.update(doc(db,"quotes",`${sharedvalue.quotesdata[quoteid].docid}`),{
                    [quoteid]:{
                        ...sharedvalue.quotesdata[quoteid],
                        quotcountry:quotinfo.quotcountry,
                        quotstate:quotinfo.quotstate,
                        quotcustname:quotinfo.quotcustname,
                        // quotlead:quotinfo.quotlead,
                        quottype:quotinfo.quottype,
                        quotcompanyname:quotinfo.quotcompanyname,
                        quotmachinetype:quotinfo.quotmachinetype,
                        quotprodtype:quotinfo.quotprodtype,
                        quotcap:quotinfo.quotcap,
                        quotprice:quotinfo.quotprice,
                        quotdim:quotinfo.quotdim,
                        quotcon:quotinfo.quotcon,
                        quotunits:quotinfo.quotunits,
                        quotpayment:quotinfo.quotpayment,
                        quotclearing:quotinfo.quotclearing,
                        quotdestination:quotinfo.quotdestination,
                        quotwarranty:quotinfo.quotwarranty,
                        quotaddinfo:quotinfo.quotaddinfo,
                        quotpayterm:editorData,
                        quotstatus:'open',
                        quotperfomaiorquot:quotinfo.quotperfomaiorquot,
                        withgstornot:quotinfo.withgstornot,
                        //common for both usd and gst
                        // custcompanyname:'',
                        ofdcty:quotinfo.ofdcty,
                        contperson:quotinfo.contperson,
                        businesstype:quotinfo.businesstype,
                        //extra fields for gst
                        // ofdst:quotinfo.,//state
                        ofddst:quotinfo.ofddst,//district
                        ofdpinc:quotinfo.ofdpinc,//pincode
                        contmobilenum:quotinfo.contmobilenum,//mobile number
                        altcontmobile:quotinfo.altcontmobile//alternative mobile number
                    }
                })
                await batch.commit();//commit all baches
                window.scrollTo({top:0,behavior:'smooth'});
                loginsuccess();//success notification
            }
        }else{
            loginformerror();
        }
        }catch(e){
            console.log('you got an error while adding the quotation',e);
            loginerror();
        }
        setshowloading(false);
    }

    useEffect(()=>{
        if(sharedvalue.quoteskeys.length>0 && sharedvalue.quoteskeys.includes(quoteid) ){
            setquotinfo(prev => ({
                ...prev,
                quotcountry:sharedvalue.quotesdata[quoteid].quotcountry,
                quotstate:sharedvalue.quotesdata[quoteid].quotstate,
                quotcustname:sharedvalue.quotesdata[quoteid].quotcustname,
                // quotlead:sharedvalue.quotesdata[quoteid].quotlead,
                quottype:sharedvalue.quotesdata[quoteid].quottype,
                quotcompanyname:sharedvalue.quotesdata[quoteid].quotcompanyname,
                quotmachinetype:sharedvalue.quotesdata[quoteid].quotmachinetype,
                quotprodtype:sharedvalue.quotesdata[quoteid].quotprodtype,
                quotcap:sharedvalue.quotesdata[quoteid].quotcap,
                quotprice:sharedvalue.quotesdata[quoteid].quotprice,
                quotdim:sharedvalue.quotesdata[quoteid].quotdim,
                quotcon:sharedvalue.quotesdata[quoteid].quotcon,
                quotunits:sharedvalue.quotesdata[quoteid].quotunits,
                quotpayment:sharedvalue.quotesdata[quoteid].quotpayment,
                quotclearing:sharedvalue.quotesdata[quoteid].quotclearing,
                quotdestination:sharedvalue.quotesdata[quoteid].quotdestination,
                quotwarranty:sharedvalue.quotesdata[quoteid].quotwarranty,
                quotaddinfo:sharedvalue.quotesdata[quoteid].quotaddinfo,
                quotstatus:sharedvalue.quotesdata[quoteid].quotstatus,
                quotperfomaiorquot:Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "quotperfomaiorquot")?sharedvalue.quotesdata[quoteid].quotperfomaiorquot:'',
                withgstornot:Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "withgstornot")?sharedvalue.quotesdata[quoteid].withgstornot:'',
                //common for both usd and gst
                // custcompanyname:'',
                ofdcty:sharedvalue.quotesdata[quoteid].ofdcty,
                contperson:sharedvalue.quotesdata[quoteid].contperson,
                businesstype:sharedvalue.quotesdata[quoteid].businesstype,
                //extra fields for gst
                // ofdst:sharedvalue.quotesdata[quoteid].,//state
                ofddst:sharedvalue.quotesdata[quoteid].ofddst,//district
                ofdpinc:sharedvalue.quotesdata[quoteid].ofdpinc,//pincode
                contmobilenum:sharedvalue.quotesdata[quoteid].contmobilenum,//mobile number
                altcontmobile:sharedvalue.quotesdata[quoteid].altcontmobile//alternative mobile number
            }));

            setEditorData(sharedvalue.quotesdata[quoteid].quotpayterm);
            
            
             //useffect states function call
            function handleuseeffectstatesbycountries(country){
                setquotinfo(prev=>({
                    ...prev,
                    quotcountry:country
                }));
                var temparr = sharedvalue.leadskeys.filter(item=>sharedvalue.leadsdata[item].ofdcountry===country).map((item)=>sharedvalue.leadsdata[item].ofdst).filter((value, index, self) => {
                    return self.indexOf(value) === index;
                });
                setallstates(temparr);
            }
            handleuseeffectstatesbycountries(sharedvalue.quotesdata[quoteid].quotcountry)
        }
    },[sharedvalue.quoteskeys , sharedvalue.quotesdata,quoteid ,sharedvalue.leadsdata ,sharedvalue.leadskeys ]);

    return(
        <>
        {(sharedvalue.quoteskeys.length>0 && sharedvalue.quoteskeys.includes(quoteid)===true && sharedvalue.quotesdata[quoteid].quotcreatedby===sharedvalue.uid && (sharedvalue.quotesdata[quoteid].quotstatus==='open' || sharedvalue.quotesdata[quoteid].quotstatus==='rework')) ===true? 
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
                    <div className='create-lead-con'>
                        
                        <div className='create-lead-head'>
                            <h1>Update Quotation</h1>
                        </div>
                        <div className='create-lead-head-button-comes-here updatequote-backwards'>
                            <button onClick={()=>navigate(-1)}>
                                <ChevronLeftIcon/>
                                Go Back
                            </button>
                        </div>
                        {/* form starts here */}
                        <div className="create-quotation-form-starts-here">
                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                    {/* quotation type */}
                                    <div>
                                    <label>Quotation type</label>
                                    <select value={quotinfo.quotperfomaiorquot} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        withgstornot:e.target.value==='Performa Invoice'?'GST':e.target.value==='Quotation'?'Without GST':'',
                                        quotperfomaiorquot:e.target.value
                                    }))}>
                                        <option value='' disabled>Select Quotation Type</option>
                                        <option value='Performa Invoice'>Performa Invoice</option>
                                        <option value='Quotation'>Quotation</option>
                                    </select>
                                </div>
                                {/* With Gst Or Without GST */}
                                <div>
                                    <label>GST or Not</label>
                                    {quotinfo.quotperfomaiorquot==='Quotation'?
                                    <select value={quotinfo.withgstornot} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        withgstornot:e.target.value
                                    }))}>
                                        <option value='' disabled>Select with GST or Not</option>
                                        <option value='GST'>GST</option>
                                        <option value='Without GST'>Without GST</option>
                                    </select>
                                    :
                                    <input type='text' value={quotinfo.withgstornot} readOnly/>
                                    }
                                </div>
                                {/* country */}
                                <div>
                                    <label>country</label>
                                    <select value={quotinfo.quotcountry} onChange={(e)=>handlestatesbycountries(e)}>
                                        <option value=''>Select Country</option>
                                        {counrtycode.map((item,idx)=>(
                                            <option key={idx} value={item.name}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* state */}
                                {quotinfo.quotcountry!=='' && 
                                <div>
                                    <label>state</label>
                                    <select value={quotinfo.quotstate} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotstate:e.target.value
                                    }))}>
                                        <option>Select State</option>
                                        {allstates.map((item,idx)=>(
                                            <option key={idx} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                                }
                                
                                {/* customer name */}
                                {quotinfo.quotcountry!=='' && quotinfo.quotstate!=='' && 
                                <div>
                                    <label>customer name</label>
                                    <select value={quotinfo.quotcustname} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotcustname:e.target.value
                                    }))}>
                                        <option value='' selected>Select Customer</option>
                                        {sharedvalue.leadskeys.filter(item=>sharedvalue.leadsdata[item].ofdcountry===quotinfo.quotcountry && sharedvalue.leadsdata[item].ofdst===quotinfo.quotstate).map((lead,idx)=>(
                                            <option key={idx} value={sharedvalue.leadsdata[lead].custcompanyname}>{sharedvalue.leadsdata[lead].custcompanyname}</option>
                                        ))}
                                    </select>
                                </div>
                                }
                                {/* lead id */}
                                {/* {quotinfo.quotcountry!=='' && quotinfo.quotstate!=='' && quotinfo.quotcustname!=='' && 
                                    <div>
                                        <label>lead</label>
                                        <select value={quotinfo.quotlead} onChange={(e)=>setquotinfo(prev=>({
                                            ...prev,
                                            quotlead:e.target.value
                                        }))}>
                                            <option value='' selected>Select LeadID</option>
                                            {sharedvalue.leadskeys.filter(item=>sharedvalue.leadsdata[item].ofdcountry===quotinfo.quotcountry && sharedvalue.leadsdata[item].ofdst===quotinfo.quotstate && sharedvalue.leadsdata[item].custcompanyname===quotinfo.quotcustname).map((lead,idx)=>(
                                                <option key={idx} value={lead}>{lead}</option>
                                            ))}
                                        </select>
                                    </div>
                                } */}
                                {/* quotation type */}
                                <div>
                                    <label>quotation type</label>
                                    <select value={quotinfo.quottype} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quottype:e.target.value
                                    }))}>
                                        <option value='' selected>Select Quotation Type</option>
                                        <option value='USD'>USD</option>
                                        <option value='HSS'>HSS</option>
                                        <option value='GST'>GST</option>
                                    </select>
                                </div>
                                {quotinfo.quottype==='GST' &&
                                <div>
                                    <label>district<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={quotinfo.ofddst} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        ofddst:e.target.value
                                    }))}/>
                                    
                                </div>
                                }

                                {(quotinfo.quottype==='USD'||quotinfo.quottype==='GST')===true &&<>
                                <div>
                                    <label>city<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={quotinfo.ofdcty} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        ofdcty:e.target.value
                                    }))}/>
                                    
                                </div>
                                <div>
                                    <label>contact person name<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={quotinfo.contperson} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        contperson:e.target.value
                                    }))} />
                                    
                                </div>
                                <div>
                                    <label>businesstype<span style={{color:'red'}}>*</span></label>
                                    <select value={quotinfo.businesstype} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        businesstype:e.target.value
                                    }))}>
                                        <option value='' disabled>Select Mill/Business Type</option>
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
                                </>
                                }
                                {/* pincode ,mobile number and alternative mobile number */}
                                {quotinfo.quottype==='GST' &&
                                    <>
                                        <div>
                                            <label>pincode<span style={{color:'red'}}>*</span></label>
                                            <input type="number" value={quotinfo.ofdpinc} onChange={(e)=>setquotinfo(prev=>({
                                                ...prev,
                                                ofdpinc:e.target.value
                                            }))}/>
                                            
                                        </div>
                                        <div>
                                            <label>mobile number<span style={{color:'red'}}>*</span></label>
                                            <input type="number" value={quotinfo.contmobilenum} onChange={(e)=>setquotinfo(prev=>({
                                                ...prev,
                                                contmobilenum:e.target.value
                                            }))}/>
                                            
                                        </div>
                                        <div>
                                            <label>alternate mobile number</label>
                                            <input type="number" value={quotinfo.altcontmobile} onChange={(e)=>setquotinfo(prev=>({
                                                ...prev,
                                                altcontmobile:e.target.value
                                            }))}/>
                                        </div>
                                    </>
                                }
                                {/* company name */}
                                {(quotinfo.quottype==='GST' || quotinfo.quottype ==='HSS') && 
                                <div>
                                    <label>Company Name</label>
                                    <select value={quotinfo.quotcompanyname} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotcompanyname:e.target.value
                                    }))}>
                                        <option value='' selected>Select Company Name</option>
                                        <option value='Sruthi Technologies'>Sruthi Technologies-ST</option>
                                        <option value='Srinivas Mill Stores'>Srinivas Mill Stores-SMS</option>
                                        <option value='Swathi Enterprises'>Swathi Enterprises-SE</option>
                                        <option value='Comaas India Pvt Ltd'>Comaas India Pvt Ltd-COMAAS</option>
                                    </select>
                                </div>
                                }
                                {/* select machine type */}
                                <div>
                                    <label>Machine Type</label>
                                    <select value={quotinfo.quotmachinetype} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotmachinetype:e.target.value
                                    }))}>
                                        <option value='' selected>Select Machine Type</option>
                                        <option value='ULTIMA'>ULTIMA</option>
                                        <option value='ULTRA-S'>ULTRA-S</option>
                                        <option value='RGBS'>RGBS</option>
                                        <option value='FALCON'>FALCON</option>
                                    </select>
                                </div>
                                {/* product type */}
                                <div>
                                    <label>product type</label>
                                    <select value={quotinfo.quotprodtype} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotprodtype:e.target.value
                                    }))}>
                                        <option value='' selected>Select Product Type</option>
                                        <option value='STD'>STD</option>
                                        <option value='EXP'>EXP</option>
                                    </select>
                                </div>
                                {/* capacity here it is also known as chutes*/}
                                <div>
                                    <label>No.of Chutes</label>
                                    <select value={quotinfo.quotcap} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotcap:e.target.value
                                    }))}>
                                        <option value='' selected>Select Capacity</option>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='8'>8</option>}
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='9'>9</option>}
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='10'>10</option>}
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='11'>11</option>}
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='12'>12</option>}
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='13'>13</option>}
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='14'>14</option>}
                                    </select>
                                </div>
                                {/* price */}
                                <div>
                                    <label>price</label>
                                    <input type='number' value={quotinfo.quotprice} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotprice:e.target.value
                                    }))}/>
                                </div>
                                {/* dimension */}
                                {quotinfo.quottype==='USD' && 
                                <div>
                                    <label>dimension</label>
                                    <input type='text' value={quotinfo.quotdim} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotdim:e.target.value
                                    }))}/>
                                </div>
                                }
                                {/* Conversion */}
                                {(quotinfo.quottype==='HSS'  || quotinfo.quottype==='GST') && 
                                <div>
                                    <label>conversion</label>
                                    <input type='number' value={quotinfo.quotcon} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotcon:e.target.value
                                    }))}/>
                                </div>
                                }
                                {/* units */}
                                {(quotinfo.quottype==='HSS'  || quotinfo.quottype==='GST') && 
                                <div>
                                    <label>units</label>
                                    <input type='number' value={quotinfo.quotunits} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotunits:e.target.value
                                    }))}/>
                                </div>
                                }
                                {/* payment */}
                                <div>
                                    <label>Payment</label>
                                    <select value={quotinfo.quotpayment} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotpayment:e.target.value
                                    }))}>
                                        <option value='' selected>Select Payment</option>
                                        <option value='LC'>LC</option>
                                        <option value='TT'>TT</option>
                                        <option value='EMI'>EMI</option>
                                    </select>
                                </div>
                                {/* clearing expenses at port and transportation */}
                                {(quotinfo.quottype==='HSS'  || quotinfo.quottype==='GST') && 
                                <div>
                                    <label>clearing expenses at port and transportation</label>
                                    <input type='number' value={quotinfo.quotclearing} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotclearing:e.target.value
                                    }))}/>
                                </div>
                                }
                                {/* destination port */}
                                {(quotinfo.quottype==='HSS'  || quotinfo.quottype==='USD') && 
                                <div>
                                    <label>destination port</label>
                                    <input type='text' value={quotinfo.quotdestination} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotdestination:e.target.value
                                    }))}/>
                                </div>
                                }
                                
                            </div>
                            {/* create lead requirements all fields ends here */}
                            {/* this div is for open and closed leads for last 6 months */}
                            <div className="create-quotation-payment-term-div">
                                <label>Payment Term</label>
                                {/* <CKEditor
                                    editor={ClassicEditor}
                                    data={editorData===''?sharedvalue.quotesdata[quoteid].quotpayterm:editorData}
                                    // onReady={(editor) => {
                                    //     // You can store the "editor" and use it when needed.
                                    //     setEditorData(sharedvalue.quotesdata[quoteid].quotpayterm)
                                    // }}
                                    onChange={handleEditorChange}
                                /> */}
                                <textarea placeholder="description" value={editorData} onChange={(e)=>handleEditorChange(e)}/>
                            </div>
                            {/* this div is for open and closed tickets for last 6 months */}

                            {/* lets transfer warrenty and additional info at bottom */}
                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                {/* warranty */}
                                <div>
                                    <label>warranty</label>
                                    <select value={quotinfo.quotwarranty} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotwarranty:e.target.value
                                    }))}>
                                        <option value='' selected>Select Warranty</option>
                                        <option value='1'>1 YEAR</option>
                                        <option value='2'>2 YEARS</option>
                                        <option value='3'>3 YEARS</option>
                                        <option value='4'>4 YEARS</option>
                                        <option value='5'>5 YEARS</option>
                                    </select>
                                </div>
                                
                                {/* additional info */}
                                <div>
                                    <label>Additional info</label>
                                    <textarea type='text' value={quotinfo.quotaddinfo} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotaddinfo:e.target.value
                                    }))}/>
                                </div>
                            </div>
                            
                            <button className="creatquotation-final-button" onClick={()=>handlesubmitdata()}>
                                Update quote
                            </button>
                        </div>
                        {/* form ends here */}
                    </div>
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

export default Updatequotation;