import React,{useContext, useState , useEffect} from "react";
import './UpdateSpare.css';

import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import { useNavigate, useParams } from "react-router-dom";
import MyContext from "../../../MyContext";
import { counrtycode } from "../../../Data/countrycode";

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { onSnapshot , writeBatch } from "firebase/firestore";
import { sparequotationid } from "../../../Data/Docs";
import { db } from "../../../Firebase";
import { doc , setDoc } from "firebase/firestore";

import { v4 as uuidv4 } from 'uuid';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Error from "../../../Error/Error";

function UpdateSpare(){
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);
    const navigate = useNavigate();
    const [showloading,setshowloading] = useState(false);
    const {spareid} = useParams();
    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Created the spare Quotation');
    const loginerror = () =>toast.error('Getting Error while Creating spare Quotation');
    const loginformerror = () => toast.info('please fill the all Required Fields');
    const invalidmail = () => toast.warn('unique id was not generating!!!');
    //array of spare parts data
    const [spares,setspares] = useState([{
        id:0,
        sparepart:'',
        qty:0,
        unitprice:0,
    }]);

    //add element to an array
    function handleaddelement(e){
        e.preventDefault();
        setspares(prev=>([
            ...prev,
            {
                id:spares.length,
                sparepart:'',
                qty:0,
                unitprice:0,
            }

        ]))
    }

    //delete the element
    function handleDeleteElement(id){
        const temparr = spares.filter((item)=>item.id!==id);
        setspares(temparr);
    }

    //chnage the elements data
    function handleEachElementData(e,idx,field){
        e.preventDefault();
        const { value } = e.target;
        setspares(prevSpares => {
            const updatedItem = { ...prevSpares[idx], [field]: value };
            return [...prevSpares.slice(0, idx), updatedItem, ...prevSpares.slice(idx + 1)];
        });

    }
    
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
    const fetchsparequotationid = async()=>{
        try{
            return new Promise((resolve,reject)=>{
                onSnapshot(sparequotationid,(doc)=>{
                    const temptexpid = doc.data();
                    resolve({
                        ...temptexpid,
                        count:temptexpid.count+1,
                        id:temptexpid.id+1
                    });
                })
            })
        }catch(err){
            console.log('you got an error while fetching the spare quotation id : ',err);
            invalidmail();
        }
    }
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
                sparequotedata.sparereqmachine!==''
            ){
            const result = await fetchsparequotationid();
            if(result && result.id!==0){
                if(result.count<=500){
                    await batch.update(doc(db,"sparequotation",`${result.docid}`),{
                        [result.id]:{
                            sparequottype:sparequotedata.sparequottype,
                            companyname:sparequotedata.companyname,
                            othercompanyname:sparequotedata.othercompanyname,
                            sparecountry:sparequotedata.sparecountry,
                            sparestate:sparequotedata.sparestate,
                            sparedist:sparequotedata.sparedist,
                            sparecity:sparequotedata.sparecity,
                            sparereqmachine:sparequotedata.sparereqmachine,
                            spares:spares,
                            docid:result.docid,
                            sparecreatedby:sharedvalue.uid,
                            sparestatus:'open',
                            spareadmincommt:''
                        }
                    })
                    await batch.update(sparequotationid,{
                        ...result
                    })
                    await batch.commit();
                    window.scrollTo({top:0,behavior:'smooth'});
                    loginsuccess();
                    setsparequotedata(prev=>({
                        ...prev,
                        sparequottype:'',
                        companyname:'',
                        othercompanyname:'',
                        sparecountry:'India',
                        sparestate:'',
                        sparedist:'',
                        sparecity:'',
                        sparereqmachine:'',
                    }));
                    setspares([{
                        id:0,
                        sparepart:'',
                        qty:0,
                        unitprice:0,
                        totalprice:0
                    }]);
                }else{
                    const id = uuidv4();
                    await setDoc(doc(db,'sparequotation',`${id}`),{
                        [result.id]:{
                            sparequottype:sparequotedata.sparequottype,
                            companyname:sparequotedata.companyname,
                            othercompanyname:sparequotedata.othercompanyname,
                            sparecountry:sparequotedata.sparecountry,
                            sparestate:sparequotedata.sparestate,
                            sparedist:sparequotedata.sparedist,
                            sparecity:sparequotedata.sparecity,
                            sparereqmachine:sparequotedata.sparereqmachine,
                            spares:spares,
                            docid:id,
                            sparecreatedby:sharedvalue.uid,
                            sparestatus:'open',
                            spareadmincommt:''
                        }
                    });
                    await batch.update(sparequotationid,{
                        ...result,
                        count:0,
                        docid:id
                    })
                    await batch.commit();
                    window.scrollTo({top:0,behavior:'smooth'});
                    loginsuccess();
                    setsparequotedata(prev=>({
                        ...prev,
                        sparequottype:'',
                        companyname:'',
                        othercompanyname:'',
                        sparecountry:'India',
                        sparestate:'',
                        sparedist:'',
                        sparecity:'',
                        sparereqmachine:'',
                    }));
                    setspares([{
                        id:0,
                        sparepart:'',
                        qty:0,
                        unitprice:0,
                        totalprice:0
                    }]);
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
        {(sharedvalue.spareskeys.length>0 && sharedvalue.spareskeys.includes(spareid)===true && sharedvalue.sparesdata[spareid].sparecreatedby===sharedvalue.uid && (sharedvalue.sparesdata[spareid].sparestatus==='open' || sharedvalue.sparesdata[spareid].sparestatus==='rework'))===true?
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
                            <h1>Create Spare Quotation</h1>
                        </div>
                        {/* form starts here */}
                        <div className="create-quotation-form-starts-here">
                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                {/* quotation type */}
                                <div>
                                    <label>Performa Invoice or Quotation<span style={{color:'red'}}>*</span></label>
                                    <select value={sparequotedata.sparequottype} onChange={(e)=>setsparequotedata(prev=>({
                                        ...prev,
                                        sparequottype:e.target.value
                                    }))}>
                                        <option value=''>Select Quotation Type</option>
                                        <option value='Performa Invoice'>Performa Invoice</option>
                                        <option value='Quotation'>Quotation</option>
                                    </select>
                                </div>
                                {/* company name */}
                                <div>
                                    <label>Company Name<span style={{color:'red'}}>*</span></label>
                                    <select value={sparequotedata.companyname} onChange={(e)=>setsparequotedata(prev=>({
                                        ...prev,
                                        companyname:e.target.value
                                    }))}>
                                        <option value=''>Choose Company Name</option>
                                        {sharedvalue.leadskeys.map((lead,idx)=>(
                                            <option key={idx} value={sharedvalue.leadsdata[lead].custcompanyname}>{sharedvalue.leadsdata[lead].custcompanyname}</option>
                                        ))}
                                        <option value='other'>Other</option>
                                    </select>
                                </div>
                                {/*enter your company name */}
                                {
                                    sparequotedata.companyname==='other' && 
                                    <div>
                                        <label>Enter your Company Name<span style={{color:'red'}}>*</span></label>
                                        <input type="text" value={sparequotedata.othercompanyname} onChange={(e)=>setsparequotedata(prev=>({
                                            ...prev,
                                            othercompanyname:e.target.value
                                        }))}/>
                                    </div>
                                }
                                
                                {/*select the country */}
                                <div>
                                    <label>country<span style={{color:'red'}}>*</span></label>
                                    <select value={sparequotedata.sparecountry} onChange={(e)=>setsparequotedata(prev=>({
                                        ...prev,
                                        sparecountry:e.target.value
                                    }))}>
                                        <option value=''>Choose Company Name</option>
                                        {counrtycode.map((item,idx)=>(
                                            ((item.name==='India' || item.name==='Sri Lanka' || item.name==='Indonesia' ||
                                            item.name==='Pakistan' || item.name==='Nepal' || item.name==='Ghana') &&<option key={idx} value={item.name}>{item.name}</option>)
                                        ))}
                                    </select>
                                </div>
                                {/*enter your state */}
                                <div>
                                    <label>state<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={sparequotedata.sparestate} onChange={(e)=>setsparequotedata(prev=>({
                                        ...prev,
                                        sparestate:e.target.value
                                    }))}/>
                                </div>
                                {/*enter your district */}
                                <div>
                                    <label>district<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={sparequotedata.sparedist} onChange={(e)=>setsparequotedata(prev=>({
                                        ...prev,
                                        sparedist:e.target.value
                                    }))}/>
                                </div>
                                {/*enter your city/town/village */}
                                <div>
                                    <label>enter city/town/village name<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={sparequotedata.sparecity} onChange={(e)=>setsparequotedata(prev=>({
                                        ...prev,
                                        sparecity:e.target.value
                                    }))}/>
                                </div>
                                {/*spares required of which machine */}
                                <div>
                                    <label>Machine<span style={{color:'red'}}>*</span></label>
                                    <select value={sparequotedata.sparereqmachine} onChange={(e)=>setsparequotedata(prev=>({
                                        ...prev,
                                        sparereqmachine:e.target.value
                                    }))}>
                                        <option value='' disabled>Choose Spare parts for machine</option>
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
                                                {Number(idx)>0 && <DeleteOutlineIcon sx={{color:'red' , fontSize:20 , cursor:'pointer'}} onClick={()=>handleDeleteElement(item.id)}/>}
                                            </div>
                        
                                            <div  className='create-lead-requirements-all-fields creatquotation-forms'>
                                                {/* quotation type */}
                                                <div>
                                                    <label>Enter required spare<span style={{color:'red'}}>*</span></label>
                                                    <input type="text" value={item.sparepart} onChange={(e)=>handleEachElementData(e,idx,'sparepart')}/>
                                                </div>
                                                <div>
                                                    <label>quantity<span style={{color:'red'}}>*</span></label>
                                                    <input type="number" value={item.qty} onChange={(e)=>handleEachElementData(e,idx,'qty')}/>
                                                </div>
                                                <div>
                                                    <label>unit price<span style={{color:'red'}}>*</span></label>
                                                    <input type="number" value={item.unitprice} onChange={(e)=>handleEachElementData(e,idx,'unitprice')}/>
                                                </div>
                                                <div>
                                                    <label>totalprice<span style={{color:'red'}}>*</span></label>
                                                    <input type="number" value={Number(item.unitprice)*Number(item.qty)} readOnly/>
                                                </div>
                                            </div>
                                        </div>
                                ))
                            }
                            {spares.length<5 && <div className="create-spare-add-one-more-btn">
                                <button onClick={(e)=>handleaddelement(e)}>+add another</button>
                            </div>}
                            
                            <button className="creatquotation-final-button" onClick={(e)=>handlesubmitdata(e)}>
                                create Spare quotation
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

export default UpdateSpare;