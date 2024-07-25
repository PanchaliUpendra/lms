import React, {useContext, useState } from "react";
import './Createquotation.css';
// import SearchIcon from '@mui/icons-material/Search';
import Notify from "../../Notifications/Notify";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import { counrtycode } from "../../../Data/countrycode";
import { createquoteid ,GCP_API_ONE_TO_ONE} from "../../../Data/Docs";
import { doc, onSnapshot ,setDoc,writeBatch,runTransaction} from "firebase/firestore";
import { db } from "../../../Firebase";
import { v4 as uuidv4 } from 'uuid';
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
// import { useNavigate } from "react-router-dom";


function Createquotation(){
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);//get a new write batch
    // const navigate = useNavigate();
    const [errors,setErrors]=useState({});
     //backdrop loading toggle
     const[showloading,setshowloading] = useState(false);
     // adding notifications 
     const loginsuccess = () =>toast.success('Successfully Created the Quotation');
     const loginerror = () =>toast.error('Getting Error while Creating Quotation');
     const loginformerror = () => toast.info('please fill the all Required Fields');
     const invalidmail = () => toast.warn('unique id was not generating!!!');
    //create quotation all required fields comes here
    const [quotinfo,setquotinfo] = useState({
        quotcountry:'',
        quotstate:'',
        quotcustname:'',
        // quotlead:'',
        quottype:'',
        quotcompanyname:'Sruthi Technologies',
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
    //function handle to submit the data
    const fetchquotationid = async() =>{
        try{
            return new Promise((resolve,reject)=>{
                onSnapshot(createquoteid,(doc)=>{
                    const temptexpid = doc.data();
                    resolve({
                        ...temptexpid,
                        count:temptexpid.count+1,
                        id:temptexpid.id+1
                    });
                })
            })
        }catch(e){
            console.log('you got an error while fetching the expense id:',e);
            invalidmail();//error message notification
        }
    }

    //ck editor is completed, lest get data from it , thats it!!!
    const [editorData,setEditorData] = useState(''); //ck editor data

    // const handleEditorChange = debounce((e) => {
    //     const data = e.target.value;
    //     console.log(data);
    //     setEditorData(data);
        
    //   },300);}
    const handleEditorChange =(e)=>{
        e.preventDefault();
        // console.log('data:',e.target.value);
        setEditorData(e.target.value);
    }
    //function handle notification
    async function handlenotification(data){
        try{
             await runTransaction(db,async(transaction)=>{
                const notifyDoc = await transaction.get(doc(db,"notifications",'uEZqZKjorFWUmEQuBW5icGmfMrH3'));
                if(!notifyDoc.exists()){
                    return "Document does not exist!!";
                }

                const newNotify = notifyDoc.data().notify;
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
                console.log(newNotify);
                transaction.update(doc(db,"notifications",'uEZqZKjorFWUmEQuBW5icGmfMrH3'),{
                    notify:[{
                        time:formattedTime,
                        date:formattedDate,
                        title:'new quotation created',
                        body:data.msg.body,
                        nid:nuid,
                        seen:false
                    },
                    ...newNotify
                ]})
            });
            console.log('transaction successfully committed!!');
        }catch(err){
            console.log('you got an error while uploading the notifications in  create lead: ',err);
        }
    }

    // send msg to admin
    async function handleSendMsgToAdmin(data){
        try{
            // console.log('response is here...');
            const response = await fetch(`${GCP_API_ONE_TO_ONE}/send-single-notification`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            });
            console.log(await response.json());
            await handlenotification(data);

        }catch(e){
            console.log('you got an error while send msg to adim in quotation..',e);
        }
    }
    
    // here handling the submitdata
    async function handlesubmitdata(event){
        event.preventDefault();
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
                quotinfo.withgstornot!=='' &&
                quotinfo.quottype!=='' &&
                (quotinfo.quottype==='USD'?(quotinfo.ofdcty!=='' && quotinfo.contperson!=='' && quotinfo.businesstype!=='')
                :(quotinfo.ofdcty!=='' && quotinfo.contperson!=='' && quotinfo.businesstype!=='' && quotinfo.ofddst!=='' && quotinfo.ofdpinc!=='' && quotinfo.contmobilenum!==''))
            ){
            const result = await fetchquotationid();
            if(result.id!==0 && Object.prototype.hasOwnProperty.call(sharedvalue.workersdata['uEZqZKjorFWUmEQuBW5icGmfMrH3'],'token')){
                const data={
                    regToken:sharedvalue.workersdata['uEZqZKjorFWUmEQuBW5icGmfMrH3'].token,
                    msg:{
                        title: `${sharedvalue.role} created the new quotation`,
                        body: `${sharedvalue.workersdata[sharedvalue.uid].name} created the quotation.[ID${result.id}]`,
                        image: "your-image-url" // Optional
                    }
                }
                await handleSendMsgToAdmin(data);
             }
            if(result && result.id!==0){

                if(result.count<=330){
                await batch.update(doc(db,"quotes",`${result.docid}`),{
                    [result.id]:{
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
                        quotstatus:quotinfo.quotstatus,
                        quotcreatedby:sharedvalue.uid,
                        quotperfomaiorquot:quotinfo.quotperfomaiorquot,
                        withgstornot:quotinfo.withgstornot,
                        //__________________________________________________________
                        //common for both usd and gst
                        // custcompanyname:quotinfo.custcompanyname,
                        ofdcty:quotinfo.ofdcty,
                        contperson:quotinfo.contperson,
                        businesstype:quotinfo.businesstype,
                        //extra fields for gst
                        ofddst:quotinfo.ofddst,//district
                        // ofdst:quotinfo.ofdst,//state
                        ofdpinc:quotinfo.ofdpinc,//pincode
                        contmobilenum:quotinfo.contmobilenum,//mobile number
                        altcontmobile:quotinfo.altcontmobile,//alternative mobile number
                        //_________________________________________________________
                        quotadmincommt:'',
                        docid:result.docid
                    }
                })
            
                await batch.update(createquoteid,{
                    ...result
                })
                await batch.commit();//commit all baches
                window.scrollTo({top:0,behavior:'smooth'});
                loginsuccess();//success notification
                setquotinfo(prev=>({
                    ...prev,
                    quotcountry:'',
                    quotstate:'',
                    quotcustname:'',
                    // quotlead:'',
                    quottype:'',
                    quotcompanyname:'',
                    quotmachinetype:'',
                    quotprodtype:'',
                    quotcap:'',
                    quotprice:'',
                    quotdim:'',
                    quotcon:'',
                    quotunits:'',
                    quotpayment:'',
                    quotclearing:'',
                    quotdestination:'',
                    quotwarranty:'',
                    quotaddinfo:'',
                    quotperfomaiorquot:'',
                    withgstornot:''
                }));
                setEditorData('');
                setErrors({});
            }
            }else{
                const id = uuidv4();
                await setDoc(doc(db,"quotes",`${id}`),{
                    [result.id]:{
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
                        quotstatus:quotinfo.quotstatus,
                        quotcreatedby:sharedvalue.uid,
                        quotperfomaiorquot:quotinfo.quotperfomaiorquot,
                        withgstornot:quotinfo.withgstornot,
                        //__________________________________________________________
                        //common for both usd and gst
                        // custcompanyname:quotinfo.custcompanyname,
                        ofdcty:quotinfo.ofdcty,
                        contperson:quotinfo.contperson,
                        businesstype:quotinfo.businesstype,
                        //extra fields for gst
                        ofddst:quotinfo.ofddst,//district
                        // ofdst:quotinfo.ofdst,//state
                        ofdpinc:quotinfo.ofdpinc,//pincode
                        contmobilenum:quotinfo.contmobilenum,//mobile number
                        altcontmobile:quotinfo.altcontmobile,//alternative mobile number
                        //_________________________________________________________
                        quotadmincommt:'',
                        docid:id
                    }
                })
            
                await batch.update(createquoteid,{
                    ...result,
                        count:0,
                        docid:id
                })
                await batch.commit();//commit all baches
                window.scrollTo({top:0,behavior:'smooth'});
                loginsuccess();//success notification
                setquotinfo(prev=>({
                    ...prev,
                    quotcountry:'',
                    quotstate:'',
                    quotcustname:'',
                    // quotlead:'',
                    quottype:'',
                    quotcompanyname:'',
                    quotmachinetype:'',
                    quotprodtype:'',
                    quotcap:'',
                    quotprice:'',
                    quotdim:'',
                    quotcon:'',
                    quotunits:'',
                    quotpayment:'',
                    quotclearing:'',
                    quotdestination:'',
                    quotwarranty:'',
                    quotaddinfo:'',
                    quotperfomaiorquot:'',
                    withgstornot:''
                }));
                setEditorData('');
                setErrors({});
            }
        }else{
                const newErrors ={};
                if(quotinfo.quotcountry==='') newErrors.quotcountry='Country Field is Required';
                if(quotinfo.quotstate==='') newErrors.quotstate='State Field Is Required';
                if(quotinfo.quotcustname==='') newErrors.quotcustname='Customer Name Is Required';
                // if(quotinfo.quotlead!=='') newErrors.quotlead='Please Choose The Lead';
                if(quotinfo.quotmachinetype==='') newErrors.quotmachinetype='Machine Type Is Required';
                if(quotinfo.quotprodtype==='') newErrors.quotprodtype='Product Type Is Required';
                if(quotinfo.quotcap==='') newErrors.quotcap='Chutes Field Is Required';
                if(quotinfo.quotprice==='') newErrors.quotprice='Price Field Is Required';
                if(quotinfo.quotpayment==='') newErrors.quotpayment='Payment Type Is Required';
                if(quotinfo.quotwarranty==='') newErrors.quotwarranty='Warrenty field is Required';
                if(quotinfo.quotperfomaiorquot==='') newErrors.quotperfomaiorquot='This Field is Required';
                if(quotinfo.withgstornot==='') newErrors.withgstornot='Choose gst field is Required';
                // _____ new modifications________
                if(quotinfo.quottype==='') newErrors.quottype='please select  the quotation type';
                if(quotinfo.ofdcty==='') newErrors.ofdcty='please enter the city name';
                if(quotinfo.contperson==='') newErrors.contperson='please enter the contact person name';
                if(quotinfo.businesstype==='') newErrors.businesstype='please fill the businesstype';
                if(quotinfo.ofddst==='') newErrors.ofddst='please enter the district name';
                if(quotinfo.ofdpinc==='') newErrors.ofdpinc='please enter the pincode';
                if(quotinfo.contmobilenum==='') newErrors.contmobilenum='please enter the mobile number';

                setErrors(newErrors);
                loginformerror();
        }
        }catch(e){
            console.log('you got an error while adding the quotation',e);
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
                            <h1>Create Quotation</h1>
                        </div>
                        {/* form starts here */}
                        <div className="create-quotation-form-starts-here">
                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                {/* quotation type */}
                                <div>
                                    <label>Performa Invoice or Quotation<span style={{color:'red'}}>*</span></label>
                                    <select value={quotinfo.quotperfomaiorquot} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        withgstornot:e.target.value==='Performa Invoice'?'GST':e.target.value==='Quotation'?'Without GST':'',
                                        quotperfomaiorquot:e.target.value
                                    }))} required>
                                        <option value='' disabled>Select Quotation Type</option>
                                        <option value='Performa Invoice'>Performa Invoice</option>
                                        <option value='Quotation'>Quotation</option>
                                    </select>
                                    {errors.quotperfomaiorquot && <small style={{color:'red'}}>{errors.quotperfomaiorquot}</small>}
                                </div>
                                {/* With Gst Or Without GST */}
                                <div>
                                    <label>GST or Not<span style={{color:'red'}}>*</span></label>
                                    {quotinfo.quotperfomaiorquot==='Quotation'?
                                    <select value={quotinfo.withgstornot} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        withgstornot:e.target.value
                                    }))} required>
                                        <option value='' disabled>Select with GST or Not</option>
                                        <option value='GST'>GST</option>
                                        <option value='Without GST'>Without GST</option>
                                    </select>
                                    :
                                    <input type='text' value={quotinfo.withgstornot} readOnly/>
                                    }
                                    {errors.withgstorno && <small style={{color:'red'}}>{errors.withgstorno}</small>}
                                </div>
                                
                                {/* country */}
                                <div>
                                    <label>country<span style={{color:'red'}}>*</span></label>
                                    <select value={quotinfo.quotcountry} onChange={(e)=>handlestatesbycountries(e)} required>
                                        <option value=''>Select Country</option>
                                        {counrtycode.map((item,idx)=>(
                                            ((item.name==='India' || item.name==='Sri Lanka' || item.name==='Indonesia' ||
                                            item.name==='Pakistan' || item.name==='Nepal' || item.name==='Ghana') &&<option key={idx} value={item.name}>{item.name}</option>)
                                        ))}
                                    </select>
                                    {errors.quotcountry && <small style={{color:'red'}}>{errors.quotcountry}</small>}
                                </div>
                                {/* state */}
                                {quotinfo.quotcountry!=='' && 
                                <div>
                                    <label>state<span style={{color:'red'}}>*</span></label>
                                    <select value={quotinfo.quotstate} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotstate:e.target.value
                                    }))} required>
                                        <option>Select State</option>
                                        {allstates.map((item,idx)=>(
                                            <option key={idx} value={item}>{item}</option>
                                        ))}
                                    </select>
                                    {errors.quotstate && <small style={{color:'red'}}>{errors.quotstate}</small>}
                                </div>
                                }
                                
                                {/* customer name */}
                                {quotinfo.quotcountry!=='' && quotinfo.quotstate!=='' && 
                                <div>
                                    <label>customer name<span style={{color:'red'}}>*</span></label>
                                    <select value={quotinfo.quotcustname} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotcustname:e.target.value
                                    }))} required>
                                        <option value='' >Select Customer</option>
                                        {sharedvalue.leadskeys.filter(item=>sharedvalue.leadsdata[item].ofdcountry===quotinfo.quotcountry && sharedvalue.leadsdata[item].ofdst===quotinfo.quotstate).map((lead,idx)=>(
                                            <option key={idx} value={sharedvalue.leadsdata[lead].custcompanyname}>{sharedvalue.leadsdata[lead].custcompanyname}</option>
                                        ))}
                                    </select>
                                    {errors.quotcustname && <small style={{color:'red'}}>{errors.quotcustname}</small>}
                                </div>
                                }
                                {/* lead id */}
                                {/* {quotinfo.quotcountry!=='' && quotinfo.quotstate!=='' && quotinfo.quotcustname!=='' && 
                                    <div>
                                        <label>lead<span style={{color:'red'}}>*</span></label>
                                        <select value={quotinfo.quotlead} onChange={(e)=>setquotinfo(prev=>({
                                            ...prev,
                                            quotlead:e.target.value
                                        }))} required>
                                            <option value='' >Select LeadID</option>
                                            {sharedvalue.leadskeys.filter(item=>sharedvalue.leadsdata[item].ofdcountry===quotinfo.quotcountry && sharedvalue.leadsdata[item].ofdst===quotinfo.quotstate && sharedvalue.leadsdata[item].custcompanyname===quotinfo.quotcustname).map((lead,idx)=>(
                                                <option key={idx} value={lead}>{lead}</option>
                                            ))}
                                        </select>
                                        {errors.quotlead && <small style={{color:'red'}}>{errors.quotlead}</small>}
                                    </div>
                                } */}
                                {/* quotation type */}
                                <div>
                                    <label>quotation type</label>
                                    <select value={quotinfo.quottype} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quottype:e.target.value
                                    }))}>
                                        <option value='' >Select Quotation Type<span style={{color:'red'}}>*</span></option>
                                        <option value='USD'>USD</option>
                                        <option value='HSS'>HSS</option>
                                        <option value='GST'>GST</option>
                                    </select>
                                    {errors.quottype && <small style={{color:'red'}}>{errors.quottype}</small>}
                                </div>
                                {/* city and district */}
                                {quotinfo.quottype==='GST' &&
                                <div>
                                    <label>district<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={quotinfo.ofddst} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        ofddst:e.target.value
                                    }))}/>
                                    {errors.ofddst && <small style={{color:'red'}}>{errors.ofddst}</small>}
                                </div>
                                }

                                {(quotinfo.quottype==='USD'||quotinfo.quottype==='GST')===true &&<>
                                <div>
                                    <label>city<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={quotinfo.ofdcty} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        ofdcty:e.target.value
                                    }))}/>
                                    {errors.ofddst && <small style={{color:'red'}}>{errors.ofddst}</small>}
                                </div>
                                <div>
                                    <label>contact person name<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={quotinfo.contperson} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        contperson:e.target.value
                                    }))} />
                                    {errors.contperson && <small style={{color:'red'}}>{errors.contperson}</small>}
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
                                    {errors.businesstype && <small style={{color:'red'}}>{errors.businesstype}</small>}
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
                                            {errors.ofdpinc && <small style={{color:'red'}}>{errors.ofdpinc}</small>}
                                        </div>
                                        <div>
                                            <label>mobile number<span style={{color:'red'}}>*</span></label>
                                            <input type="number" value={quotinfo.contmobilenum} onChange={(e)=>setquotinfo(prev=>({
                                                ...prev,
                                                contmobilenum:e.target.value
                                            }))}/>
                                            {errors.contmobilenum && <small style={{color:'red'}}>{errors.contmobilenum}</small>}
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
                                        <option value='' disabled>Select Company Name</option>
                                        <option value='Sruthi Technologies'>Sruthi Technologies-ST</option>
                                        {/* <option value='Srinivas Mill Stores'>Srinivas Mill Stores-SMS</option>
                                        <option value='Swathi Enterprises'>Swathi Enterprises-SE</option> */}
                                        <option value='Comaas India Pvt Ltd'>Comaas India Pvt Ltd-COMAAS</option>
                                    </select>
                                </div>
                                }
                                {/* select machine type */}
                                <div>
                                    <label>Machine Type<span style={{color:'red'}}>*</span></label>
                                    <select value={quotinfo.quotmachinetype} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotmachinetype:e.target.value
                                    }))} required>
                                        <option value='' disabled>Select Machine Type</option>
                                        <option value='ULTIMA'>ULTIMA</option>
                                        <option value='ULTRA-S'>ULTRA-S</option>
                                        <option value='RGBS'>RGBS</option>
                                        <option value='FALCON'>FALCON</option>
                                    </select>
                                    {errors.quotmachinetype && <small style={{color:'red'}}>{errors.quotmachinetype}</small>}
                                </div>
                                {/* product type */}
                                <div>
                                    <label>product type<span style={{color:'red'}}>*</span></label>
                                    <select value={quotinfo.quotprodtype} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotprodtype:e.target.value
                                    }))} required>
                                        <option value='' >Select Product Type</option>
                                        <option value='STD'>STD</option>
                                        <option value='EXP'>EXP</option>
                                    </select>
                                    {errors.quotprodtype && <small style={{color:'red'}}>{errors.quotprodtype}</small>}
                                </div>
                                {/* capacity here it is also known as chutes*/}
                                <div>
                                    <label>No.of Chutes<span style={{color:'red'}}>*</span></label>
                                    <select value={quotinfo.quotcap} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotcap:e.target.value
                                    }))} required>
                                        <option value='' >Select Capacity</option>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='8'>8</option>}
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='9'>9</option>}
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='10'>10</option>}
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='11'>11</option>}
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='12'>12</option>}
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='13'>13</option>}
                                        {(quotinfo.quotmachinetype==='ULTRA-S'||quotinfo.quotmachinetype==='FALCON') && <option value='14'>14</option>}
                                    </select>
                                    {errors.quotcap && <small style={{color:'red'}}>{errors.quotcap}</small>}
                                </div>
                                {/* price */}
                                <div>
                                    <label>Price in USD<span style={{color:'red'}}>*</span></label>
                                    <input type='number' value={quotinfo.quotprice} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotprice:e.target.value
                                    }))} required/>
                                    {errors.quotprice && <small style={{color:'red'}}>{errors.quotprice}</small>}
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
                                    <label>Payment<span style={{color:'red'}}>*</span></label>
                                    <select value={quotinfo.quotpayment} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotpayment:e.target.value
                                    }))} required>
                                        <option value='' >Select Payment</option>
                                        <option value='LC'>LC</option>
                                        <option value='TT'>TT</option>
                                        <option value='EMI'>EMI</option>
                                    </select>
                                    {errors.quotpayment && <small style={{color:'red'}}>{errors.quotpayment}</small>}
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
                                    data={editorData}
                                    // onReady={(editor) => {
                                    //     // You can store the "editor" and use it when needed.
                                    //     console.log('Editor is ready to use!', editor);
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
                                    <label>warranty<span style={{color:'red'}}>*</span></label>
                                    <select value={quotinfo.quotwarranty} onChange={(e)=>setquotinfo(prev=>({
                                        ...prev,
                                        quotwarranty:e.target.value
                                    }))} required>
                                        <option value='' >Select Warranty</option>
                                        <option value='1'>1 YEAR</option>
                                        <option value='2'>2 YEARS</option>
                                        <option value='3'>3 YEARS</option>
                                        <option value='4'>4 YEARS</option>
                                        <option value='5'>5 YEARS</option>
                                    </select>
                                    {errors.quotwarranty && <small style={{color:'red'}}>{errors.quotwarranty}</small>}
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
                            
                            <button className="creatquotation-final-button" onClick={(e)=>handlesubmitdata(e)}>
                                create quote
                            </button>
                        </div>
                        {/* form ends here */}
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

export default Createquotation;