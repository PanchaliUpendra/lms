import React,{useContext, useState} from "react";
import './CreateSpare.css';

// import SearchIcon from '@mui/icons-material/Search';
import Notify from "../../Notifications/Notify";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
// import { useNavigate } from "react-router-dom";
import MyContext from "../../../MyContext";
import { counrtycode } from "../../../Data/countrycode";

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { onSnapshot , runTransaction, writeBatch } from "firebase/firestore";
import { sparequotationid } from "../../../Data/Docs";
import { db } from "../../../Firebase";
import { doc , setDoc } from "firebase/firestore";

import { v4 as uuidv4 } from 'uuid';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { GCP_API_ONE_TO_ONE } from "../../../Data/Docs";
// import {v4 as uuidv4} from 'uuid';

function CreateSpare(){
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);
    // const navigate = useNavigate();
    const [showloading,setshowloading] = useState(false);
    const [token,setToken] = useState('');
    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Created the spare Quotation');
    const loginerror = () =>toast.error('Getting Error while Creating spare Quotation');
    const loginformerror = () => toast.info('please fill all the Required Fields');
    const invalidmail = () => toast.warn('unique id was not generating!!!');
    //array of spare parts data
    const [spares,setspares] = useState([{//here spares means both machines and spares
        id:0,
        reqtype:'spare',
        sparepart:'',
        machinepart:'',
        qty:0,
        sparemodel:'',
        sparesubtype:'',
        machineproduct:'',
        machinecap:'',
        machinespecification:'',
        unitprice:0,
    }]);

    //add element to an array
    function handleaddelement(e){
        e.preventDefault();
        setspares(prev=>([
            ...prev,
            {
                id:spares.length,
                reqtype:'spare',
                sparepart:'',
                machinepart:'',
                qty:0,
                sparemodel:'',
                sparesubtype:'',
                machineproduct:'',
                machinecap:'',
                machinespecification:'',
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
            const updatedItem = field==='reqtype'?
            {
                ...prevSpares[idx],
                reqtype:'spare',
                sparepart:'',
                machinepart:'',
                qty:0,
                sparemodel:'',
                sparesubtype:'',
                machineproduct:'',
                machinecap:'',
                machinespecification:'',
                unitprice:0,
                [field]:value
            }:{ ...prevSpares[idx], [field]: value };
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
    //function to send the price
    // function calculateSpareTotal(sparepart,sparemodel,sparesubtype){
    //     return sharedvalue.machinesArray.filter((item)=>(item.sparepart===sparepart && item.sparemodel===sparemodel && item.sparesubtype===sparesubtype)).length>0?
    //     sharedvalue.machinesArray.filter((item)=>(item.sparepart===sparepart && item.sparemodel===sparemodel && item.sparesubtype===sparesubtype))[0].price:0;
    // }
    //function to handle the notification
    async function handleSendMsgToAdmin(data , notifyID , notmsg){
        try{
            
            await runTransaction(db,async(transaction)=>{
                const notifyDoc = await transaction.get(doc(db,"notifications",notifyID));
                if(!notifyDoc.exists()){
                    return "Document does not exist!!";
                }
                const dataset = notifyDoc.data();
                const newNotify = notifyDoc.data().notify;
                if(Object.prototype.hasOwnProperty.call(dataset,'token')){
                    setToken(dataset.token);
                }
                const now = new Date();
                const options ={
                    timeZone:'Asia/Kolkata',
                    day:'2-digit',
                    month:'2-digit',
                    year:'numeric'
                }
                const formattedDate = now.toLocaleDateString('en-GB',options).split('/').join('-');
                const options2 = {
                    timeZone:'Asia/Kolkata',
                    hour:'2-digit',
                    minute:'2-digit',
                    second:'2-digit',
                    hour12:false
                }
                const formattedTime = now.toLocaleTimeString('en-GB',options2);
                const nuid = uuidv4();
                // console.log(newNotify);
                transaction.update(doc(db,"notifications",notifyID),{
                    notify:[
                        {
                            time:formattedTime,
                            date:formattedDate,
                            title:notmsg,
                            body:data.msg.body,
                            nid:nuid,
                            seen:false
                        },
                        ...newNotify
                        ]
                    })
                })
            // console.log('updated the lead',data);
            if(token!==''){
                const newData={
                    ...data,
                    regToken:token
                }
                const response = await fetch(`${GCP_API_ONE_TO_ONE}/send-single-notification`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(newData)
                });
                console.log(await response.json());
            }

        }catch(e){
            console.log('you got an error while send msg to adim..',e);
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

                const data = {
                    regToken:'',
                    msg:{
                        title: `${sharedvalue.role} created the new Spare Quotation`,
                        body: `${sharedvalue.workersdata[sharedvalue.uid].name} created the new Spare Quotation.[ID${result.id}]`,
                        image: "your-image-url" // Optional
                    } 
                }
                const notmsg = "new Spare Quotation Created";
                await handleSendMsgToAdmin(data,'uEZqZKjorFWUmEQuBW5icGmfMrH3',notmsg);

                if(result.count<=340){
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
                            spares:spares,//here spares means both machines and spares
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
                        sparecountry:'',
                        sparestate:'',
                        sparedist:'',
                        sparecity:'',
                        sparereqmachine:'',
                    }));
                    setspares([{
                        id:0,
                        reqtype:'spare',
                        sparepart:'',
                        machinepart:'',
                        qty:0,
                        sparemodel:'',
                        sparesubtype:'',
                        machineproduct:'',
                        machinecap:'',
                        machinespecification:'',
                        unitprice:0,
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
                            spares:spares,//here spares means both machines and spares
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
                        sparecountry:'',
                        sparestate:'',
                        sparedist:'',
                        sparecity:'',
                        sparereqmachine:'',
                    }));
                    setspares([{
                        id:0,
                        reqtype:'spare',
                        sparepart:'',
                        machinepart:'',
                        qty:0,
                        sparemodel:'',
                        sparesubtype:'',
                        machineproduct:'',
                        machinecap:'',
                        machinespecification:'',
                        unitprice:0,
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
                                    <input value={sparequotedata.companyname} onChange={(e)=>setsparequotedata(prev=>({
                                        ...prev,
                                        companyname:e.target.value
                                    }))}/>
                                        
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
                                        <option value=''>Choose Country Name</option>
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
                                                <h1>{item.reqtype} part_{Number(idx)+1}</h1>
                                                {Number(idx)>0 && <DeleteOutlineIcon sx={{color:'red' , fontSize:20 , cursor:'pointer'}} onClick={()=>handleDeleteElement(item.id)}/>}
                                            </div>
                        
                                            <div  className='create-lead-requirements-all-fields creatquotation-forms'>
                                                {/* quotation type */}
                                                <div>
                                                    <label>required type</label>
                                                    <select value={item.reqtype} onChange={(e)=>handleEachElementData(e,idx,'reqtype')}>
                                                        <option value='spare'>spare</option>
                                                        <option value='machine'>machine</option>
                                                    </select>
                                                </div>
                                                {item.reqtype==='spare' && 
                                                <>
                                                    <div>
                                                        <label>Enter required spare<span style={{color:'red'}}>*</span></label>
                                                        <select value={item.sparepart} onChange={(e)=>{
                                                            handleEachElementData(e,idx,'sparepart');
                                                            }}>
                                                            <option value=''>Choose the Spare part</option>
                                                            {
                                                                Array.from(new Set(sharedvalue.sparesArray.map((item)=>{
                                                                    return item.item;
                                                                }))).map((values)=>(
                                                                    <option value={values}>{values}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                    
                                                    <div>
                                                        <label>model</label>
                                                        <select value={item.sparemodel} onChange={(e)=>handleEachElementData(e,idx,'sparemodel')}>
                                                            <option value=''>choose model</option>
                                                            {
                                                                Array.from(new Set(sharedvalue.sparesArray.filter((val)=>(val.item===item.sparepart && val.model!=='')).map((prod)=>{
                                                                    return prod.model;
                                                                }))).map((values)=>{
                                                                    return <option value={values}>{values}</option>
                                                                })
                                                            }
                                                        </select>
                                                    </div>

                                                    
                                                    <div>
                                                        <label>sub type</label>
                                                        <select value={item.sparesubtype} onChange={(e)=>handleEachElementData(e,idx,'sparesubtype')}>
                                                            <option value=''>choose sub type</option>
                                                            {
                                                                Array.from(new Set(sharedvalue.sparesArray.filter((val)=>(val.item===item.sparepart && val.model===item.sparemodel && val.subtype!=='')).map((prod)=>{
                                                                    return prod.subtype;
                                                                }))).map((values)=>(
                                                                    <option value={values}>{values}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </>}
                                                {
                                                item.reqtype==='machine' &&
                                                <>
                                                    <div>
                                                        <label>Enter required machine<span style={{color:'red'}}>*</span></label>
                                                        <select value={item.machinepart} onChange={(e)=>handleEachElementData(e,idx,'machinepart')}>
                                                            <option value=''>choose machine</option>
                                                            {
                                                                Array.from(new Set(sharedvalue.machinesArray.filter((val)=>val.discreption!=='').map((prod)=>{
                                                                    return prod.discreption;
                                                                }))).map((values)=>(
                                                                    <option value={values}>{values}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                    {item.machinepart!=='' && 
                                                    <div>
                                                        <label>product</label>
                                                        <select value={item.machineproduct} onChange={(e)=>handleEachElementData(e,idx,'machineproduct')}>
                                                            <option value=''>choose product</option>
                                                            {
                                                                Array.from(new Set(sharedvalue.machinesArray.filter((val)=>val.discreption.includes(item.machinepart)).map((prod)=>{
                                                                    return prod.product;
                                                                }))).map((values)=>(
                                                                    <option value={values}>{values}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>}
                                                    <div>
                                                        <label>capacity</label>
                                                        <select value={item.machinecap} onChange={(e)=>handleEachElementData(e,idx,'machinecap')}>
                                                            <option value=''>choose capacity</option>
                                                            {
                                                                Array.from(new Set(sharedvalue.machinesArray.filter((val)=>(val.discreption.includes(item.machinepart) && val.product.includes(item.machineproduct))).map((prod)=>{
                                                                    return prod.capacity;
                                                                }))).map((values)=>(
                                                                    <option value={values}>{values}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label>specification</label>
                                                        <select value={item.machinespecification} onChange={(e)=>handleEachElementData(e,idx,'machinespecification')}>
                                                            <option value=''>choose specification</option>
                                                            {
                                                                Array.from(new Set(sharedvalue.machinesArray.filter((val)=>(val.discreption.includes(item.machinepart) && val.product.includes(item.machineproduct) && val.capacity.includes(item.machinecap) && val.specification!=='')).map((prod)=>{
                                                                    return prod.specification;
                                                                }))).map((values)=>(
                                                                    <option value={values}>{values}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </>
                                                }
                                                <div>
                                                    <label>quantity<span style={{color:'red'}}>*</span></label>
                                                    <input type="number" value={item.qty} onChange={(e)=>handleEachElementData(e,idx,'qty')}/>
                                                </div>
                                                <div>
                                                    <label>unit price<span style={{color:'red'}}>*</span></label>
                                                    <select value={item.unitprice} onChange={(e)=>handleEachElementData(e,idx,'unitprice')}>
                                                            <option value=''>choose price</option>
                                                            {item.reqtype==='spare' &&
                                                                
                                                                Array.from(new Set(sharedvalue.sparesArray.filter((val)=>(val.item===item.sparepart && val.model.includes(item.sparemodel) && val.subtype.includes(item.sparesubtype))).map((prod)=>{
                                                                    return prod.price;
                                                                }))).map((values)=>(
                                                                    <option value={values}>{values}</option>
                                                                ))
                                                            }
                                                            {
                                                                item.reqtype==='machine' &&
                                                                
                                                                Array.from(new Set(sharedvalue.machinesArray.filter((val)=>(val.discreption.includes(item.machinepart) && val.product.includes(item.machineproduct) && val.capacity.includes(item.machinecap) && val.specification.includes(item.machinespecification))).map((prod)=>{
                                                                    return prod.price;
                                                                }))).map((values)=>(
                                                                    <option value={values}>{values}</option>
                                                                ))
                                                            
                                                            }
                                                    </select>
                                                    {/* {item.reqtype==='spare' &&
                                                    <input type="number" value={item.unitprice} readOnly/>} */}
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

export default CreateSpare;