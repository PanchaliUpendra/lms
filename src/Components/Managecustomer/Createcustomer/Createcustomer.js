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
function Createcustomer(){
    const sharedvalue = useContext(MyContext);


    const batch = writeBatch(db);// Get a new write batch
    const [showprogress,setshowprogress]=useState(false);
    const [formdetails,setformdetails]=useState({//form details will take here
        name:'',
        email:'',
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
    const loginsuccess = () =>toast.success('Successfully Created The Customer');
    const loginerror = () =>toast.error('please check your credientials');
    const loginformerror = () => toast.warn('please fill the form correctly');
    const invalidmail = () => toast.error('Invalid Mail');
    const emailalreadyexists = () =>toast.error('email already exists');
    const notcreated = () => toast.error('you got an error while creating the manager');

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
                        "name":formdetails.name,
                        "email":formdetails.email,
                        "role":formdetails.role,
                        "password":formdetails.password,
                        "disable":false
                    }});
                    await batch.commit();
                }
                await signOut(secondauth)
                loginsuccess();
                setformdetails({
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
                            <SearchIcon />
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createcustomer starts from here */}
                    <div className="createmanager-innner-form-con">
                        <div className="createmanager-innner-form">
                            <div className="create-manager-form-header">
                                <h1>create Customer profile</h1>
                                <p>enter email and password to create profile</p>
                            </div>
                            <div>
                                <label>customer name<span>*</span></label>
                                <input type='text' value={formdetails.name} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    name:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>customer email<span>*</span></label>
                                <input type='email' value={formdetails.email} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    email:e.target.value
                                }))}/>
                            </div>
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
                            <button onClick={()=>handleregistration()}>Create Customer profile</button>

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