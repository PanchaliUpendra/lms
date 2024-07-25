import React,{useContext, useState} from "react";
import './CreateAmc.css';

// import SearchIcon from '@mui/icons-material/Search';
import Notify from "../../Notifications/Notify";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
// import { useNavigate } from "react-router-dom";
import MyContext from "../../../MyContext";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { onSnapshot, writeBatch } from "firebase/firestore";
import { amcquotesid } from "../../../Data/Docs";
import { db } from "../../../Firebase";
import { doc , setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

function CreateAmc(){
    const sharedvalue = useContext(MyContext);
    // const navigate = useNavigate();
    const [showloading,setshowloading] = useState(false);
    const batch = writeBatch(db);

    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Created the amc Quotation');
    const loginerror = () =>toast.error('Getting Error while Creating amc Quotation');
    const loginformerror = () => toast.info('please fill the all Required Fields');
    const invalidmail = () => toast.warn('unique id was not generating!!!');

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
        amcvisit:''
    })
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }

    //function to fetch the amc quote id
    const fetchamcquotesid = async() =>{
        try{
            return new Promise((resolve,reject)=>{
                onSnapshot(amcquotesid,(doc)=>{
                    const temptexpid = doc.data();
                    resolve({
                        ...temptexpid,
                        count:temptexpid.count+1,
                        id:temptexpid.id+1
                    });
                })
            })

        }catch(err){
            console.log("you got an error while  fetching the amc quotation id: ",err);
            invalidmail();
        }
    }

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
                amcdata.amcvisit!==''
            ){
            const result = await fetchamcquotesid();
            if(result && result.id!==0){
                if(result.count<=340){
                    await batch.update(doc(db,"amcdoc",`${result.docid}`),{
                        [result.id]:{
                            amcquottype:amcdata.amcquottype,
                            amccompanyname:amcdata.amccompanyname,
                            amccountry:amcdata.amccountry,
                            amcstate:amcdata.amcstate,
                            amcdistrict:amcdata.amcdistrict,
                            amccity:amcdata.amccity,
                            amcmachine:amcdata.amcmachine,
                            amcperiod:amcdata.amcperiod,
                            amcunitprice:amcdata.amcunitprice,
                            amcqty:amcdata.amcqty,
                            amcvisit:amcdata.amcvisit,
                            // ....below are most import for every creating quotation
                            docid:result.docid,
                            amccreatedby:sharedvalue.uid,
                            amcstatus:'open',
                            amcadmincommt:''
                        }
                    })
                    await batch.update(amcquotesid,{
                        ...result
                    })
                    await batch.commit();
                    window.scrollTo({top:0,behavior:'smooth'});
                    loginsuccess();
                    setamcdata(prev=>({
                        ...prev,
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
                        amcvisit:''
                    }))
                }
                else{
                    const id = uuidv4();
                    await setDoc(doc(db,"amcdoc",`${id}`),{
                        [result.id]:{
                            amcquottype:amcdata.amcquottype,
                            amccompanyname:amcdata.amccompanyname,
                            amccountry:amcdata.amccountry,
                            amcstate:amcdata.amcstate,
                            amcdistrict:amcdata.amcdistrict,
                            amccity:amcdata.amccity,
                            amcmachine:amcdata.amcmachine,
                            amcperiod:amcdata.amcperiod,
                            amcunitprice:amcdata.amcunitprice,
                            amcqty:amcdata.amcqty,
                            amcvisit:amcdata.amcvisit,
                            // ....below are most import for every creating quotation
                            docid:id,
                            amccreatedby:sharedvalue.uid,
                            amcstatus:'open',
                            amcadmincommt:''
                        }
                    })
    
                    await batch.update(amcquotesid,{
                        ...result,
                        count:0,
                        docid:id
                    })
    
                    await batch.commit();
                    window.scrollTo({top:0,behavior:'smooth'});
                    loginsuccess();
    
                    setamcdata(prev=>({
                        ...prev,
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
                        amcvisit:''
                    }))
                }
            }
        }else{
            loginformerror();
        }
            
        }catch(err){
            console.log('you got an error while adding the spare quotation',err);
            loginerror();
        }
        setshowloading(false);
    }
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
                            {/* <SearchIcon onClick={()=>navigate('/search')}/> */}
                            <Notify/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createmanager starts from here */}
                    <form className='create-lead-con'>
                        <div className='create-lead-head'>
                            <h1>Create AMC</h1>
                        </div>
                        <div className="create-quotation-form-starts-here">
                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                {/* quotation type */}
                                <div>
                                    <label>Performa Invoice or Quotation<span style={{color:'red'}}>*</span></label>
                                    <select value={amcdata.amcquottype} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcquottype:e.target.value
                                    }))}>
                                        <option value=''>Select Quotation Type</option>
                                        <option value='Performa Invoice'>Performa Invoice</option>
                                        <option value='Quotation'>Quotation</option>
                                    </select>
                                </div>
                                {/*enter your company name */}
                                <div>
                                    <label>Enter your Company Name<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amccompanyname} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amccompanyname:e.target.value
                                    }))}/>
                                </div>
                                {/*enter your country */}
                                <div>
                                    <label>country<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amccountry} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amccountry:e.target.value
                                    }))}/>
                                </div>
                                {/*enter your state */}
                                <div>
                                    <label>state<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amcstate} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcstate:e.target.value
                                    }))}/>
                                </div>
                                {/*enter your district */}
                                <div>
                                    <label>district<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amcdistrict} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcdistrict:e.target.value
                                    }))}/>
                                </div>
                                {/*enter your city/town/village */}
                                <div>
                                    <label>enter city/town/village name<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amccity} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amccity:e.target.value
                                    }))}/>
                                </div>
                                {/*spares required of which machine */}
                                <div>
                                    <label>Machine<span style={{color:'red'}}>*</span></label>
                                    <select value={amcdata.amcmachine} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcmachine:e.target.value
                                    }))}>
                                        <option value=''>Choose machine</option>
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
                                {/*AMC Period */}
                                <div>
                                    <label>AMC Period(months)<span style={{color:'red'}}>*</span></label>
                                    <input type="number" value={amcdata.amcperiod} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcperiod:e.target.value
                                    }))}/>
                                </div>
                                {/*price per unit */}
                                <div>
                                    <label>price per unit<span style={{color:'red'}}>*</span></label>
                                    <input type="number" value={amcdata.amcunitprice} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcunitprice:e.target.value
                                    }))}/>
                                </div>
                                {/* qty */}
                                <div>
                                    <label>quantity<span style={{color:'red'}}>*</span></label>
                                    <input type="number" value={amcdata.amcqty} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcqty:e.target.value
                                    }))}/>
                                </div>
                                {/* visits */}
                                <div>
                                    <label>visits<span style={{color:'red'}}>*</span></label>
                                    <input type="number" value={amcdata.amcvisit} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcvisit:e.target.value
                                    }))}/>
                                </div>

                            </div>
                            <button className="creatquotation-final-button" onClick={(e)=>handlesubmitdata(e)}>
                                create AMC
                            </button>
                        </div>
                    </form>
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

export default CreateAmc;