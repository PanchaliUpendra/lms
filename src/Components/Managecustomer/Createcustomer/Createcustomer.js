import React, {useContext, useState } from "react";
import './Createcustomer.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
//import from here on words for other components
import {createUserWithEmailAndPassword,signOut} from "firebase/auth";
import { secondauth } from "../../../Firebase";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { writeBatch, doc } from "firebase/firestore"; 
import { db } from "../../../Firebase";
//toastify importing
import { counrtycode } from "../../../Data/countrycode";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {  useNavigate } from "react-router-dom";
import { states } from "../../../Data/states";
function Createcustomer(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();


    const batch = writeBatch(db);// Get a new write batch
    const [showprogress,setshowprogress]=useState(false);
    const [formdetails,setformdetails]=useState({//form details will take here
        cname:'',
        name:'',
        cNum:'',
        email:'',
        cMdate:'',
        cmachinetype:'',        
        cSnum:'',   
        cIdate:'', 
        password:'',
        cnfpassword:'',
        ccountry:'India',
        cstate:'',
        cdist:'',
        role:'customer',
        // amc inputs starts from here
        woramc:'',
        amcsrtdate:'',
        amcdur:0,
        amcvisits:0,
        wtydur:0,
        amcenddate:'',
        wtyenddate:''



    })
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Created The Company');
    const loginerror = () =>toast.error('please check your credientials');
    const loginformerror = () => toast.warn('please fill the form correctly');
    const invalidmail = () => toast.error('Invalid Mail');
    const emailalreadyexists = () =>toast.error('email already exists');
    const notcreated = () => toast.error('you got an error while creating the customer');

    //form registration start's here
    async function handleregistration(){
        setshowprogress(true);
        try{
            if(formdetails.email.trim()!=='' && formdetails.name.trim()!=='' && formdetails.password.trim()!=='' && formdetails.cnfpassword.trim()!=='' && formdetails.password===formdetails.cnfpassword){
                //const userCredential = await createUserWithEmailAndPassword(auth, formdetails.email, formdetails.password);
                const secondusercredential = await createUserWithEmailAndPassword(secondauth, formdetails.email, formdetails.password)
                // Signed up
                const user = secondusercredential.user;
                //we have to take user.email,user.uid
                // Update the workers of 'lms'
                if(user){
                    const sfRef = doc(db,'workers','yWXH2DQO8DlAbkmQEQU4');
                    batch.update(sfRef, {[user.uid]:{
                        "uid":user.uid,
                        "cname":formdetails.cname,
                        "name":formdetails.name,
                        "email":formdetails.email,
                        "role":formdetails.role,
                        "password":formdetails.password,
                        "disable":false,
                        "managerid":'',
                        "cNum":formdetails.cNum,
                        "cMdate":formdetails.cMdate,
                        "cmachinetype":formdetails.cmachinetype,
                        "cSnum":formdetails.cSnum,
                        "cIdate":formdetails.cIdate,
                        "ccountry":formdetails.ccountry,
                        "cstate":formdetails.cstate,
                        "cdist":formdetails.cdist,
                        // amc inputs starts from here
                        "woramc":formdetails.woramc,
                        "amcsrtdate":formdetails.amcsrtdate,
                        "amcdur":formdetails.amcdur,
                        "amcvisits":formdetails.amcvisits,
                        "wtydur":formdetails.wtydur,
                        "amcenddate":formdetails.amcenddate,
                        "wtyenddate":formdetails.wtyenddate
                    }}); // need to update backend with new fields
                    await batch.commit();
                }
                await signOut(secondauth)
                loginsuccess();
                setformdetails({
                    cname:'',
                    name:'',
                    cNum:'',
                    email:'',
                    cMdate:'',
                    cmachinetype:'',        
                    cSnum:'',   
                    cIdate:'', 
                    password:'',
                    cnfpassword:'',
                    ccountry:'India',
                    cstate:'',
                    cdist:'',
                    role:'customer',
                     // amc inputs starts from here
                    woramc:'',
                    amcsrtdate:'',
                    amcdur:0,
                    amcvisits:0,
                    wtydur:0,
                    amcenddate:'',
                    wtyenddate:''
                });
            }else{
                loginformerror();
            }
        }
        catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            if(errorCode==='auth/email-already-exists'){
                emailalreadyexists();
            }else if(errorCode==='auth/invalid-credential'){
                loginerror();
            }else if(errorCode==='invalid-email'){
                invalidmail();
            }else if(errorCode==='auth/email-already-in-use'){
                emailalreadyexists();
            }
            else{
                notcreated();
            }
        }
        setshowprogress(false);
    }
    //form registyration completed here

    //function to handle the warranty end date
    async function handlewty(e){
        try{
            const currentDate = new Date(formdetails.cIdate);
            const futureEndDate = new Date(currentDate);
            // console.log(typeof Number(e.target.value));
            const curvalue = e.target.value;
            futureEndDate.setFullYear(currentDate.getFullYear()+Number(curvalue));
            const formatDateString = (date) => date.toISOString().split('T')[0];
            setformdetails(prev=>({
                ...prev,
                wtyenddate:formatDateString(futureEndDate)
            }));
            // return formatDateString(futureEndDate);
        }catch(e){
            console.log('you got an error while fetching the date',e);
        }
    }

    //function to handle the amc end date
    async function handleamcenddate(e){
        try{
            const currentDate = new Date(formdetails.amcsrtdate);
            const futureEndDate = new Date(currentDate);
            const curvalue = e.target.value;
            futureEndDate.setMonth(currentDate.getMonth()+Number(curvalue));
            const formatDateString = (date) => date.toISOString().split('T')[0];
            setformdetails(prev=>({
                ...prev,
                amcenddate:formatDateString(futureEndDate)
            }))
        }catch(e){
            console.log('you got an error while fetching the date',e);
        }
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
                            <SearchIcon onClick={()=>navigate('/search')}/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createcustomer starts from here */}
                    <div className="createcustomer-page-con">
                    <div className="createcompanyprofile-innner-form-con">
                            <div className="createcompany-profile-header">
                                <h1>create Company profile</h1>
                                <p>enter email and password to create profile</p>
                            </div>
                        <div className="create-company-profile-form">
                            

                            {/* all fields starts from here */}
                            <div>
                                <label>company name<span>*</span></label>
                                <input type='text' value={formdetails.cname} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    cname:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>contact name<span>*</span></label>
                                <input type='text' value={formdetails.name} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    name:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>contact Number<span>*</span></label>
                                <input type='numnber' value={formdetails.cNum} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    cNum:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>contact email<span>*</span></label>
                                <input type='email' value={formdetails.email} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    email:e.target.value
                                }))}/>
                            </div>
                            <div>
                                    <label>Machine Type</label>
                                    <select value={formdetails.cmachinetype} onChange={(e)=>setformdetails(prev=>({
                                        ...prev,
                                        cmachinetype:e.target.value
                                    }))}>
                                        <option value=''>Select Machine Type</option>
                                        <option value='ULTIMA'>ULTIMA</option>
                                        <option value='ULTRA-S'>ULTRA-S</option>
                                        <option value='RGB'>RGB</option>
                                        <option value='FALCON'>FALCON</option>
                                    </select>
                            </div>
                            <div>
                                <label>Manufacture date</label>
                                <input type='date' value={formdetails.cMdate} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    cMdate:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>Serial Number</label>
                                <input type='number' value={formdetails.cSnum} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    cSnum:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>Installation Date</label>
                                <input type='date' value={formdetails.cIdate} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    cIdate:e.target.value,
                                    wtydur:0
                                }))}/>
                            </div>
                            <div>
                                <label>Warranty Or AMC</label>
                                <select value={formdetails.woramc} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    woramc:e.target.value
                                }))}>
                                    <option value=''>Select Type</option>
                                    <option value='AMC'>AMC</option>
                                    <option value='warranty'>Warranty</option>
                                </select>
                            </div>
                            {
                                formdetails.woramc==='AMC' &&
                                <div>
                                <label>AMC start date</label>
                                <input type='date' value={formdetails.amcsrtdate} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    amcsrtdate:e.target.value
                                }))}/>
                            </div>
                            }
                            
                            {
                                formdetails.woramc==='AMC' && formdetails.amcsrtdate!=='' && 
                                <div>
                                    <label>AMC Duration</label>
                                    <select value={formdetails.amcdur} onChange={(e)=>{
                                        setformdetails(prev=>({
                                            ...prev,
                                            amcdur:e.target.value
                                        }));
                                        handleamcenddate(e);
                                    }}>
                                        <option value={0}>choose the duration</option>
                                        <option value={6}>6 months</option>
                                        <option value={12}>12 months</option>
                                    </select>
                                </div>
                            }
                            
                            {formdetails.woramc==='warranty' &&  formdetails.cIdate!=='' && 
                            <div>
                                <label>Warranty Duration</label>
                                <select value={formdetails.wtydur} onChange={(e)=>{
                                    setformdetails(prev=>({
                                    ...prev,
                                    wtydur:e.target.value
                                    }));
                                    handlewty(e);
                                }}>
                                    <option value={0}>Choose warranty</option>
                                    <option value={1}>1 YEAR</option>
                                    <option value={2}>2 YEARS</option>
                                    <option value={3}>3 YEARS</option>
                                    <option value={4}>4 YEARS</option>
                                    <option value={5}>5 YEARS</option>
                                </select>
                            </div>
                            }
                            
                            {
                                formdetails.woramc==='AMC' && formdetails.amcsrtdate!=='' && formdetails.amcdur!==0 &&
                                <div>
                                    <label>Visits</label>
                                    <select value={formdetails.amcvisits} onChange={(e)=>setformdetails(prev=>({
                                        ...prev,
                                        amcvisits:e.target.value
                                    }))}>
                                        <option value={0}>choose visits</option>
                                        <option value={12}>12 visits</option>
                                        <option value={6}>6 visits</option>
                                    </select>
                                </div>
                            }
                            
                            {
                                formdetails.woramc==='AMC' && formdetails.amcsrtdate!=='' && formdetails.amcdur!==0 &&
                                <div>
                                    <label>AMC End Date</label>
                                    <input type='date' value={formdetails.amcenddate} readOnly/>
                                </div>
                            }
                            

                            {
                                formdetails.woramc==='warranty' && formdetails.wtydur!==0 && formdetails.cIdate!=='' &&
                                <div>
                                    <label>Warranty End Date</label>
                                    <input type='date' value={formdetails.wtyenddate} readOnly/>
                                </div>
                            }
                            
                            <div>
                                    <label>Country</label>
                                    <select value={formdetails.ccountry} onChange={(e)=>setformdetails(prev=>({
                                        ...prev,
                                        cstate:'',
                                        cdist:'',
                                        ccountry:e.target.value
                                    }))}>
                                        <option value=''>Select country</option>
                                        {
                                            counrtycode.map((item,idx)=>(
                                                <option key={idx} value={item.name}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                {formdetails.ccountry==='India' && 
                                <div>
                                    <label>State</label>
                                    <select value={formdetails.cstate} onChange={(e)=>setformdetails(prev=>({
                                        ...prev,
                                        cdist:'',
                                        cstate:e.target.value
                                    }))}>
                                    <option value=''>Select State</option>
                                        {states.map((item,idx)=>(
                                            <option key={idx} value={item.state}>{item.state}</option>
                                        ))}
                                    </select>
                                </div>
                                }
                                {formdetails.ccountry!=='India' && 
                                <div>
                                    <label>State</label>
                                    <input value={formdetails.cstate} type="text" onChange={(e)=>setformdetails(prev=>({
                                        ...prev,
                                        cstate:e.target.value
                                    }))}/>
                                </div>
                                }

                                {formdetails.ccountry==='India' && formdetails.cstate!=='' &&
                                    <div>
                                        <label>district</label>
                                        <select value={formdetails.cdist} onChange={(e)=>setformdetails(prev=>({
                                            ...prev,
                                            cdist:e.target.value
                                        }))}>
                                        <option value='' >Select District</option>
                                                {states.filter(item=>item.state===formdetails.cstate)[0].districts.map((prod,idx)=>(
                                                    <option key={idx} value={prod}>{prod}</option>
                                                ))}
                                        </select>
                                    </div>
                                }

                                {formdetails.ccountry!=='India' && formdetails.cstate!=='' &&
                                    <div>
                                        <label>district</label>
                                        <input type='text' value={formdetails.cdist} onChange={(e)=>setformdetails(prev=>({
                                            ...prev,
                                            cdist:e.target.value
                                        }))}/>
                                        
                                    </div>
                                }
                            

                            <div>
                                <label>password<span>*</span></label>
                                <input type='password' value={formdetails.password} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    password:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>confirm password<span>*</span></label>
                                <input type='password' value={formdetails.cnfpassword} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    cnfpassword:e.target.value
                                }))}/>
                            </div>
                            
                            {/* all fields ends here */}
                        </div>
                        <button onClick={()=>handleregistration()}>Create Company profile</button>
                        {/* form completed here */}
                    </div>
                    </div>
                </div>
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showprogress}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* adding the notifications */}
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

export default Createcustomer;