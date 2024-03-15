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
import { useNavigate } from "react-router-dom";
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
        role:'customer'
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
                        "cdist":formdetails.cdist
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
                    role:'customer'
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
                                    cIdate:e.target.value
                                }))}/>
                            </div>

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