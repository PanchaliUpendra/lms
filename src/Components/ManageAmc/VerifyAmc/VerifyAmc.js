import React,{useContext, useEffect, useState} from "react";
import './VerifyAmc.css';

import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import { useNavigate, useParams } from "react-router-dom";
import MyContext from "../../../MyContext";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {  writeBatch } from "firebase/firestore";
// import { amcquotesid } from "../../../Data/Docs";
import { db } from "../../../Firebase";
import { doc} from "firebase/firestore";
// import { v4 as uuidv4 } from 'uuid';
import Error from "../../../Error/Error";


function VerifyAmc(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    const [showloading,setshowloading] = useState(false);
    const batch = writeBatch(db);
    const {amcid} = useParams();

    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Updated the amc Quotation');
    const loginerror = () =>toast.error('Getting Error while Creating amc Quotation');
    const loginformerror = () => toast.info('please fill the all Required Fields');
    // const invalidmail = () => toast.warn('unique id was not generating!!!');

    const[amcdata,setamcdata] = useState({
        amcquottype:'',
        amccompanyname:'',
        amccountry:'',
        amcstate:'',
        amcdistrict:'',
        amccity:'',
        amcmachine:'',
        amcperiod:'',
        amcunitprice:'',
        amcqty:'',
        amcvisit:'',
        amcstatus:'open',
        amcadmincommt:''
    })
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }

    //function to fetch the amc quote id
    // const fetchamcquotesid = async() =>{
    //     try{
    //         return new Promise((resolve,reject)=>{
    //             onSnapshot(amcquotesid,(doc)=>{
    //                 const temptexpid = doc.data();
    //                 resolve({
    //                     ...temptexpid,
    //                     count:temptexpid.count+1,
    //                     id:temptexpid.id+1
    //                 });
    //             })
    //         })

    //     }catch(err){
    //         console.log("you got an error while  fetching the amc quotation id: ",err);
    //         invalidmail();
    //     }
    // }

    //function handle the submit data
    async function handlesubmitdata(event){
        event.preventDefault();
        setshowloading(true);
        try{
            if(
                amcdata.amcquottype!=='' &&
                amcdata.amccompanyname!=='' &&
                amcdata.amccountry!=='' &&
                amcdata.amcstate!=='' &&
                amcdata.amcdistrict!=='' &&
                amcdata.amcmachine!=='' &&
                amcdata.amcperiod!=='' &&
                amcdata.amcunitprice!=='' &&
                amcdata.amcqty!=='' &&
                amcdata.amcvisit!=='' &&
                amcdata.amcstatus!==''
            ){
            // const result = await fetchamcquotesid();
            // if(result && result.id!==0){
                // if(result.count<=500){
                    await batch.update(doc(db,"amcdoc",`${sharedvalue.amcdata[amcid].docid}`),{
                        [amcid]:{
                            ...sharedvalue.amcdata[amcid],
                            amcstatus:amcdata.amcstatus,
                            amcadmincommt:amcdata.amcadmincommt
                        }
                    })
                    // await batch.update(amcquotesid,{
                    //     ...result
                    // })
                    await batch.commit();
                    window.scrollTo({top:0,behavior:'smooth'});
                    loginsuccess();
                    // setamcdata(prev=>({
                    //     ...prev,
                    //     amcquottype:'',
                    //     amccompanyname:'',
                    //     amccountry:'',
                    //     amcstate:'',
                    //     amcdistrict:'',
                    //     amccity:'',
                    //     amcmachine:'',
                    //     amcperiod:'',
                    //     amcunitprice:'',
                    //     amcqty:'',
                    //     amcvisit:''
                    // }))
            //     }
            //     else{
            //         const id = uuidv4();
            //         await setDoc(doc(db,"amcdoc",`${id}`),{
            //             [result.id]:{
            //                 amcquottype:amcdata.amcquottype,
            //                 amccompanyname:amcdata.amccompanyname,
            //                 amccountry:amcdata.amccountry,
            //                 amcstate:amcdata.amcstate,
            //                 amcdistrict:amcdata.amcdistrict,
            //                 amccity:amcdata.amccity,
            //                 amcmachine:amcdata.amcmachine,
            //                 amcperiod:amcdata.amcperiod,
            //                 amcunitprice:amcdata.amcunitprice,
            //                 amcqty:amcdata.amcqty,
            //                 amcvisit:amcdata.amcvisit,
            //                 // ....below are most import for every creating quotation
            //                 docid:id,
            //                 amccreatedby:sharedvalue.uid,
            //                 amcstatus:'open',
            //                 amcadmincommt:''
            //             }
            //         })
    
            //         await batch.update(amcquotesid,{
            //             ...result,
            //             count:0,
            //             docid:id
            //         })
    
            //         await batch.commit();
            //         window.scrollTo({top:0,behavior:'smooth'});
            //         loginsuccess();
    
            //         setamcdata(prev=>({
            //             ...prev,
            //             amcquottype:'',
            //             amccompanyname:'',
            //             amccountry:'',
            //             amcstate:'',
            //             amcdistrict:'',
            //             amccity:'',
            //             amcmachine:'',
            //             amcperiod:'',
            //             amcunitprice:'',
            //             amcqty:'',
            //             amcvisit:''
            //         }))
            //     }
            // }
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
        if(sharedvalue.amckeys.length>0 && sharedvalue.amckeys.includes(amcid)){
            setamcdata(prev=>({
                ...prev,
                amcquottype:sharedvalue.amcdata[amcid].amcquottype,
                amccompanyname:sharedvalue.amcdata[amcid].amccompanyname,
                amccountry:sharedvalue.amcdata[amcid].amccountry,
                amcstate:sharedvalue.amcdata[amcid].amcstate,
                amcdistrict:sharedvalue.amcdata[amcid].amcdistrict,
                amccity:sharedvalue.amcdata[amcid].amccity,
                amcmachine:sharedvalue.amcdata[amcid].amcmachine,
                amcperiod:sharedvalue.amcdata[amcid].amcperiod,
                amcunitprice:sharedvalue.amcdata[amcid].amcunitprice,
                amcqty:sharedvalue.amcdata[amcid].amcqty,
                amcvisit:sharedvalue.amcdata[amcid].amcvisit,
                // ....below are most import for every creating quotation
                docid:sharedvalue.amcdata[amcid].docid,
                amccreatedby:sharedvalue.amcdata[amcid].amccreatedby,
                amcstatus:sharedvalue.amcdata[amcid].amcstatus,
                amcadmincommt:sharedvalue.amcdata[amcid].amcadmincommt
            }))
        }
    },[sharedvalue.amckeys,sharedvalue.amcdata,amcid])
    return(
        <>
            {(sharedvalue.amckeys.length>0 && sharedvalue.amckeys.includes(amcid)===true && sharedvalue.role==='admin' && sharedvalue.amcdata[amcid].amcstatus!=='closed')===true?
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
                    <form className='create-lead-con'>
                        <div className='create-lead-head'>
                            <h1>Verify AMC</h1>
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
                        <div className="create-quotation-form-starts-here">
                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                {/* quotation type */}
                                <div>
                                    <label>Performa Invoice or Quotation<span style={{color:'red'}}>*</span></label>
                                    <input value={amcdata.amcquottype} readOnly/>
                                        
                                </div>
                                {/*enter your company name */}
                                <div>
                                    <label>Enter your Company Name<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amccompanyname} readOnly/>
                                </div>
                                {/*enter your country */}
                                <div>
                                    <label>country<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amccountry} readOnly/>
                                </div>
                                {/*enter your state */}
                                <div>
                                    <label>state<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amcstate} readOnly/>
                                </div>
                                {/*enter your district */}
                                <div>
                                    <label>district<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amcdistrict} readOnly/>
                                </div>
                                {/*enter your city/town/village */}
                                <div>
                                    <label>enter city/town/village name<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amccity} readOnly/>
                                </div>
                                {/*spares required of which machine */}
                                <div>
                                    <label>Machine<span style={{color:'red'}}>*</span></label>
                                    <input value={amcdata.amcmachine} readOnly/>
                                        
                                </div>
                                {/*AMC Period */}
                                <div>
                                    <label>AMC Period(months)<span style={{color:'red'}}>*</span></label>
                                    <input type="number" value={amcdata.amcperiod} readOnly/>
                                </div>
                                {/*price per unit */}
                                <div>
                                    <label>price per unit<span style={{color:'red'}}>*</span></label>
                                    <input type="number" value={amcdata.amcunitprice} readOnly/>
                                </div>
                                {/* qty */}
                                <div>
                                    <label>quantity<span style={{color:'red'}}>*</span></label>
                                    <input type="number" value={amcdata.amcqty} readOnly/>
                                </div>
                                {/* visits */}
                                <div>
                                    <label>visits<span style={{color:'red'}}>*</span></label>
                                    <input type="number" value={amcdata.amcvisit} readOnly/>
                                </div>

                            </div>
                            <div className='create-lead-requirements-head spare-req-head'>
                                <h1>Verify the quotation here</h1>
                            </div>
                            <div  className='create-lead-requirements-all-fields creatquotation-forms'>
                                <div>
                                    <label>status*</label>
                                    <select value={amcdata.amcstatus} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcstatus:e.target.value
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
                                    <textarea  placeholder="write at least one comment" value={amcdata.amcadmincommt} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcadmincommt:e.target.value
                                    }))}/>
                                </div>
                            </div>
                            <button className="creatquotation-final-button" onClick={(e)=>handlesubmitdata(e)}>
                                Verify AMC
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            :<Error/>}
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

export default VerifyAmc;