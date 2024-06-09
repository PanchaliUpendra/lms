import React,{useContext, useEffect, useState} from "react";
import './VerifySpare.css';

import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import { useNavigate, useParams } from "react-router-dom";
import MyContext from "../../../MyContext";
// import { counrtycode } from "../../../Data/countrycode";

// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {  writeBatch } from "firebase/firestore";
// import { sparequotationid } from "../../../Data/Docs";
import { db } from "../../../Firebase";
import { doc} from "firebase/firestore";

// import { v4 as uuidv4 } from 'uuid';

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
    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Updated the spare Quotation');
    const loginerror = () =>toast.error('Getting Error while Creating spare Quotation');
    const loginformerror = () => toast.info('please fill the all Required Fields');
    // const invalidmail = () => toast.warn('unique id was not generating!!!');
    //array of spare parts data
    const [spares,setspares] = useState([{
        id:0,
        sparepart:'',
        qty:0,
        unitprice:0,
    }]);

    //add element to an array
    // function handleaddelement(e){
    //     e.preventDefault();
    //     setspares(prev=>([
    //         ...prev,
    //         {
    //             id:spares.length,
    //             sparepart:'',
    //             qty:0,
    //             unitprice:0,
    //         }

    //     ]))
    // }

    //delete the element
    // function handleDeleteElement(id){
    //     const temparr = spares.filter((item)=>item.id!==id);
    //     setspares(temparr);
    // }

    //chnage the elements data
    // function handleEachElementData(e,idx,field){
    //     e.preventDefault();
    //     const { value } = e.target;
    //     setspares(prevSpares => {
    //         const updatedItem = { ...prevSpares[idx], [field]: value };
    //         return [...prevSpares.slice(0, idx), updatedItem, ...prevSpares.slice(idx + 1)];
    //     });

    // }
    
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

    //function  to fetch the spare quotation id
    // const fetchsparequotationid = async()=>{
    //     try{
    //         return new Promise((resolve,reject)=>{
    //             onSnapshot(sparequotationid,(doc)=>{
    //                 const temptexpid = doc.data();
    //                 resolve({
    //                     ...temptexpid,
    //                     count:temptexpid.count+1,
    //                     id:temptexpid.id+1
    //                 });
    //             })
    //         })
    //     }catch(err){
    //         console.log('you got an error while fetching the spare quotation id : ',err);
    //         invalidmail();
    //     }
    // }
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
            // const result = await fetchsparequotationid();
            // if(result && result.id!==0){
            //     if(result.count<=500){
                    await batch.update(doc(db,"sparequotation",`${sharedvalue.sparesdata[spareid].docid}`),{
                        [spareid]:{
                            ...sharedvalue.sparesdata[spareid],
                            sparestatus:sparequotedata.sparestatus,
                            spareadmincommt:sparequotedata.spareadmincommt
                        }
                    })
                    // await batch.update(sparequotationid,{
                    //     ...result
                    // })
                    await batch.commit();
                    window.scrollTo({top:0,behavior:'smooth'});
                    loginsuccess();
                    // setsparequotedata(prev=>({
                    //     ...prev,
                    //     sparequottype:'',
                    //     companyname:'',
                    //     othercompanyname:'',
                    //     sparecountry:'India',
                    //     sparestate:'',
                    //     sparedist:'',
                    //     sparecity:'',
                    //     sparereqmachine:'',
                    // }));
                    // setspares([{
                    //     id:0,
                    //     sparepart:'',
                    //     qty:0,
                    //     unitprice:0,
                    //     totalprice:0
                    // }]);
            //     }else{
            //         const id = uuidv4();
            //         await setDoc(doc(db,'sparequotation',`${id}`),{
            //             [result.id]:{
            //                 sparequottype:sparequotedata.sparequottype,
            //                 companyname:sparequotedata.companyname,
            //                 othercompanyname:sparequotedata.othercompanyname,
            //                 sparecountry:sparequotedata.sparecountry,
            //                 sparestate:sparequotedata.sparestate,
            //                 sparedist:sparequotedata.sparedist,
            //                 sparecity:sparequotedata.sparecity,
            //                 sparereqmachine:sparequotedata.sparereqmachine,
            //                 spares:spares,
            //                 docid:id,
            //                 sparecreatedby:sharedvalue.uid,
            //                 sparestatus:'open',
            //                 spareadmincommt:''
            //             }
            //         });
            //         await batch.update(sparequotationid,{
            //             ...result,
            //             count:0,
            //             docid:id
            //         })
            //         await batch.commit();
            //         window.scrollTo({top:0,behavior:'smooth'});
            //         loginsuccess();
            //         setsparequotedata(prev=>({
            //             ...prev,
            //             sparequottype:'',
            //             companyname:'',
            //             othercompanyname:'',
            //             sparecountry:'India',
            //             sparestate:'',
            //             sparedist:'',
            //             sparecity:'',
            //             sparereqmachine:'',
            //         }));
            //         setspares([{
            //             id:0,
            //             sparepart:'',
            //             qty:0,
            //             unitprice:0,
            //             totalprice:0
            //         }]);
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
                            <SearchIcon onClick={()=>navigate('/search')}/>
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
                                                <h1>spare part_{Number(idx)+1}</h1>
                                                
                                            </div>
                        
                                            <div  className='create-lead-requirements-all-fields creatquotation-forms'>
                                                {/* quotation type */}
                                                <div>
                                                    <label>Enter required spare<span style={{color:'red'}}>*</span></label>
                                                    <input type="text" value={item.sparepart} readOnly/>
                                                </div>
                                                <div>
                                                    <label>quantity<span style={{color:'red'}}>*</span></label>
                                                    <input type="number" value={item.qty} readOnly/>
                                                </div>
                                                <div>
                                                    <label>unit price<span style={{color:'red'}}>*</span></label>
                                                    <input type="number" value={item.unitprice} readOnly/>
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