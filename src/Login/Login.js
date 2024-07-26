import React, { useState } from 'react';
import './Login.css';

//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

//importing from material ui
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
//firebase login import stuff
import {signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Firebase';

import { useNavigate } from 'react-router-dom';
import { messaging } from '../Firebase';
import { getToken } from '../Firebase';
import { db } from '../Firebase';
import { doc,writeBatch } from 'firebase/firestore';


function Login(){
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [showpassword,setshowpassword] = useState(false);
    const [usrdtl,setusrdtl] = useState({
        email:'',
        password:''
    })

    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Logged In');
    const loginerror = () =>toast.error('please check your credientials');
    const loginformerror = () => toast.info('please fill the form correctly');

    async function requestPermission(useruid){
        const permission = await Notification.requestPermission();
        if(permission === 'granted'){
          try{
              // Check if the existing token is the same as the new token
            //   const existingToken = temp_workers_data[uid].token;
              const newToken = await getToken(messaging, {vapidKey: 'BB6UCV85cN-An7EfH2WSLhiLirOs7JEh3yur2_QlF9Z-ISP4yvCJTj1MgobxOhgYTqfZBSKb3Jf8bsjdTxyH_z0'});
          
              if(newToken){
                console.log('New Token Generated', newToken);
                
                const batch = writeBatch(db); // Get a new write batch
                batch.update(doc(db, "notifications", `${useruid}`), {
                    token:newToken
                });
                await batch.commit();
            
                } else {
                  console.log('token was not generated when user login');
                }
              }catch(err){
                console.log('you getting an error while uploading the token :',err);
              }
          } else if(permission === 'denied'){
            alert("You denied the notification permission");
          }
      }

    
    const invalidmail = () => toast.warn('Invalid Mail')

    async  function handleloginform(){
        setOpen(true);
        try{
            if(usrdtl.email.trim()!=='' && usrdtl.password.trim()!==''){
                await signInWithEmailAndPassword(auth, usrdtl.email, usrdtl.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    if(user){
                        requestPermission(user.uid);
                        // console.log('here is the user id: ',user)
                        loginsuccess();
                        
                    }
                    navigate('/');
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    if(errorCode==='auth/invalid-credential'){
                        loginerror();
                    }
                    else if(errorCode === 'auth/invalid-email') {
                        invalidmail();
                    }
                    else{
                        alert('You Got An Error While Sign In');
                    }
                });
            }else{
                loginformerror();
            }
            
        }catch(e){
            alert('you got an error')
        }
        setOpen(false);
    }
    
    return(
        <>
            <div className='login-con'>
                <div className='login-con-inner'>
                    <h1>Sign In</h1>
                    <div className='login-form-each'>
                        <PersonOutlineRoundedIcon/>
                        <input type='email' placeholder='Email' onChange={(e)=>setusrdtl(prev=>({
                            ...prev,
                            email:e.target.value
                        }))}/>
                    </div>
                    <div className='login-form-each'>
                        <LockOutlinedIcon/>
                        <input type={showpassword?'text':'password'} placeholder='Password' onChange={(e)=>setusrdtl(prev=>({
                            ...prev,
                            password:e.target.value
                        }))} />
                        {showpassword?<VisibilityOutlinedIcon onClick={()=>setshowpassword(prev=>!prev)}/>:<VisibilityOffOutlinedIcon onClick={()=>setshowpassword(prev=>!prev)}/>}
                    </div>
                    <button onClick={()=>handleloginform()}>Sign In</button>
                    <h3>Forgot Password?</h3>
                </div>
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
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

export default Login;