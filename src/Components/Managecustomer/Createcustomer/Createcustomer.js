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
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
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
                        "managerid":''
                    }}); // need to update backend with new fields
                    await batch.commit();
                }
                await signOut(secondauth)
                loginsuccess();
                setformdetails({
                    cname:'',
                    name:'',
                    email:'',
                    password:'',
                    cnfpassword:'',
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
                    <div className="createmanager-innner-form-con">
                        <div className="createmanager-innner-form">
                            <div className="create-manager-form-header">
                                <h1>create Company profile</h1>
                                <p>enter email and password to create profile</p>
                            </div>

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
                            {/* <div>
                                <label>contact Number<span>*</span></label>
                                <input type='numnber' value={formdetails.cNum} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    cNum:e.target.value
                                }))}/>
                            </div> */}
                            <div>
                                <label>contact email<span>*</span></label>
                                <input type='email' value={formdetails.email} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    email:e.target.value
                                }))}/>
                            </div>
                            {/* <div>
                                    <label>Machine Type</label>
                                    <select value={formdetails.cmachinetype} onChange={(e)=>setformdetails(prev=>({
                                        ...prev,
                                        cmachinetype:e.target.value
                                    }))}>
                                        <option value='' selected>Select Machine Type</option>
                                        <option value='ULTIMA'>ULTIMA</option>
                                        <option value='ULTRA-S'>ULTRA-S</option>
                                        <option value='RGB'>RGB</option>
                                        <option value='FALCON'>FALCON</option>
                                    </select>
                            </div> */}
                            {/* <div>
                                <label>Manufacture date</label>
                                <input type='date' value={formdetails.cMdate} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    cMdate:e.target.value
                                }))}/>
                            </div> */}
                            {/* <div>
                                <label>Serial Number</label>
                                <input type='number' value={formdetails.cSnum} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    cSnum:e.target.value
                                }))}/>
                            </div> */}
                            {/* <div>
                                <label>Installation Date</label>
                                <input type='date' value={formdetails.cIdate} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    cIdate:e.target.value
                                }))}/>
                            </div> */}
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
                            <button onClick={()=>handleregistration()}>Create Company profile</button>
                            {/* all fields ends here */}
                        </div>
                        {/* form completed here */}
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