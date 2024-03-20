import React, {useContext, useEffect, useState } from "react";
import './Verifyquotation.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";

import {  createquotes } from "../../../Data/Docs";
import {writeBatch} from "firebase/firestore";
import { db } from "../../../Firebase";
//importing the notifications
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// just checking the ckeditor is working or not
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


import { useNavigate, useParams } from "react-router-dom";
import Error from "../../../Error/Error";

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


function Verifyquotation(){
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);//get a new write batch
    const navigate = useNavigate();
    const {quoteid} = useParams();
     //backdrop loading toggle
     const[showloading,setshowloading] = useState(false);
     const [temquot,settempquot] = useState({
        tempstatus:'',
        tempcomment:''
     })
     // adding notifications 
     const loginsuccess = () =>toast.success('Successfully updated the Quotation');
     const loginerror = () =>toast.error('Getting Error while updating Quotation');
     const loginformerror = () => toast.info('please fill the form correctly');
    //create quotation all required fields comes here
    const [quotinfo,setquotinfo] = useState({
        quotcountry:'',
        quotstate:'',
        quotcustname:'',
        quotlead:'',
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
        withgstornot:''
    })
    //create all states
    
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    //function to create the array of states
    

   
    

    //ck editor is completed, lest get data from it , thats it!!!
    // const [editorData,setEditorData] = useState(''); //ck editor data

    

    // here handling the submitdata
    async function handlesubmitdata(){
        setshowloading(true);
        try{
            if(
                quotinfo.quotcountry!=='' &&
                quotinfo.quotstate!=='' &&
                quotinfo.quotcustname!=='' &&
                quotinfo.quotlead!=='' &&
                quotinfo.quotmachinetype!=='' &&
                quotinfo.quotprodtype!=='' &&
                quotinfo.quotcap!=='' &&
                quotinfo.quotprice!=='' &&
                quotinfo.quotpayment!=='' &&
                quotinfo.quotwarranty!=='' &&
                temquot.tempcomment!==''
            ){
            if(quoteid!==0){
                await batch.update(createquotes,{
                    [quoteid]:{
                        ...sharedvalue.quotesdata[quoteid],
                        quotstatus:temquot.tempstatus,
                        quotadmincommt:temquot.tempcomment
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
                quotlead:sharedvalue.quotesdata[quoteid].quotlead,
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
                quotperfomaiorquot:Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "quotperfomaiorquot")?sharedvalue.quotesdata[quoteid].quotperfomaiorquot:'',
                withgstornot:Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "withgstornot")?sharedvalue.quotesdata[quoteid].withgstornot:'',
            }));
            settempquot(prev=>({
                ...prev,
                tempstatus:sharedvalue.quotesdata[quoteid].quotstatus,
                tempcomment:sharedvalue.quotesdata[quoteid].quotadmincommt
            }))
            
            
             //useffect states function call
            // function handleuseeffectstatesbycountries(country){
            //     setquotinfo(prev=>({
            //         ...prev,
            //         quotcountry:country
            //     }));
            //     var temparr = sharedvalue.leadskeys.filter(item=>sharedvalue.leadsdata[item].ofdcountry===country).map((item)=>sharedvalue.leadsdata[item].ofdst).filter((value, index, self) => {
            //         return self.indexOf(value) === index;
            //     });
            //     setallstates(temparr);
            // }
            // handleuseeffectstatesbycountries(sharedvalue.quotesdata[quoteid].quotcountry)
        }
    },[sharedvalue.quoteskeys , sharedvalue.quotesdata,quoteid ,sharedvalue.leadsdata ,sharedvalue.leadskeys ]);

    return(
        <>
        {(sharedvalue.quoteskeys.length>0 && sharedvalue.quoteskeys.includes(quoteid)===true && sharedvalue.role==='admin' && sharedvalue.quotesdata[quoteid].quotstatus!=='closed') ===true? 
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
                    {/* your createmanager starts from here */}
                    <div className='create-lead-con'>
                        
                        <div className='create-lead-head'>
                            <h1>Verify Quotation</h1>
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
                                <div>
                                    <label>Quotation Type</label>
                                    <input value={quotinfo.quotperfomaiorquot} readOnly/>
                                </div>
                                <div>
                                    <label>GST or Not</label>
                                    <input value={quotinfo.withgstornot} readOnly/>
                                </div>
                                {/* country */}
                                <div>
                                    <label>country</label>
                                    <input value={quotinfo.quotcountry} readOnly/>
                                </div>
                                {/* state */}
                                {quotinfo.quotcountry!=='' && 
                                <div>
                                    <label>state</label>
                                    <input value={quotinfo.quotstate} readOnly/>
                                </div>
                                }
                                
                                {/* customer name */}
                                {quotinfo.quotcountry!=='' && quotinfo.quotstate!=='' && 
                                <div>
                                    <label>customer name</label>
                                    <input value={quotinfo.quotcustname} readOnly/>
                                </div>
                                }
                                {/* lead id */}
                                {quotinfo.quotcountry!=='' && quotinfo.quotstate!=='' && quotinfo.quotcustname!=='' && 
                                    <div>
                                        <label>lead</label>
                                        <input value={quotinfo.quotlead} readOnly/>
                                        
                                    </div>
                                }
                                {/* quotation type */}
                                <div>
                                    <label>quotation type</label>
                                    <input value={quotinfo.quottype} readOnly/>
                                    
                                </div>
                                {/* company name */}
                                {(quotinfo.quottype==='GST' || quotinfo.quottype ==='HSS') && 
                                <div>
                                    <label>Company Name</label>
                                    <input value={quotinfo.quotcompanyname} readOnly/>
                                </div>
                                }
                                {/* select machine type */}
                                <div>
                                    <label>Machine Type</label>
                                    <input value={quotinfo.quotmachinetype} readOnly/>
                                </div>
                                {/* product type */}
                                <div>
                                    <label>product type</label>
                                    <input value={quotinfo.quotprodtype} readOnly/>
                                </div>
                                {/* capacity here it is also known as chutes*/}
                                <div>
                                    <label>No.of Chutes</label>
                                    <input value={quotinfo.quotcap} readOnly/>
                                </div>
                                {/* price */}
                                <div>
                                    <label>price</label>
                                    <input  value={quotinfo.quotprice} readOnly/>
                                </div>
                                {/* dimension */}
                                {quotinfo.quottype==='USD' && 
                                <div>
                                    <label>dimension</label>
                                    <input  value={quotinfo.quotdim} readOnly/>
                                </div>
                                }
                                {/* Conversion */}
                                {(quotinfo.quottype==='HSS'  || quotinfo.quottype==='GST') && 
                                <div>
                                    <label>conversion</label>
                                    <input  value={quotinfo.quotcon} readOnly/>
                                </div>
                                }
                                {/* units */}
                                {(quotinfo.quottype==='HSS'  || quotinfo.quottype==='GST') && 
                                <div>
                                    <label>units</label>
                                    <input  value={quotinfo.quotunits} readOnly/>
                                </div>
                                }
                                {/* payment */}
                                <div>
                                    <label>Payment</label>
                                    <input value={quotinfo.quotpayment} readOnly/>
                                </div>
                                {/* clearing expenses at port and transportation */}
                                {(quotinfo.quottype==='HSS'  || quotinfo.quottype==='GST') && 
                                <div>
                                    <label>clearing expenses at port and transportation</label>
                                    <input value={quotinfo.quotclearing} readOnly/>
                                </div>
                                }
                                {/* destination port */}
                                {(quotinfo.quottype==='HSS'  || quotinfo.quottype==='USD') && 
                                <div>
                                    <label>destination port</label>
                                    <input  value={quotinfo.quotdestination} readOnly/>
                                </div>
                                }
                                
                            </div>
                            {/* create lead requirements all fields ends here */}
                            {/* this div is for open and closed leads for last 6 months */}
                            <div className="create-quotation-payment-term-div">
                                <label>Payment Term</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={sharedvalue.quotesdata[quoteid].quotpayterm}
                                    // onReady={(editor) => {
                                    //     // You can store the "editor" and use it when needed.
                                    //     setEditorData(sharedvalue.quotesdata[quoteid].quotpayterm)
                                    // }}
                                />
                            </div>
                            {/* this div is for open and closed tickets for last 6 months */}

                            {/* lets transfer warrenty and additional info at bottom */}
                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                {/* warranty */}
                                <div>
                                    <label>warranty</label>
                                    <input value={quotinfo.quotwarranty} readOnly/>
                                </div>
                                
                                {/* additional info */}
                                <div>
                                    <label>Additional info</label>
                                    <textarea value={quotinfo.quotaddinfo} readOnly/>
                                </div>
                            </div>

                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                {/* warranty */}
                                <div>
                                    <label>status*</label>
                                    <select value={temquot.tempstatus} onChange={(e)=>settempquot(prev=>({
                                        ...prev,
                                        tempstatus:e.target.value
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
                                    <textarea value={temquot.tempcomment} placeholder="write at least one comment" onChange={(e)=>settempquot(prev=>({
                                        ...prev,
                                        tempcomment:e.target.value
                                    }))}/>
                                </div>
                            </div>
                            
                            <button className="creatquotation-final-button" onClick={()=>handlesubmitdata()}>
                                verify quote
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

export default Verifyquotation;