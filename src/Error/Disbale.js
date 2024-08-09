import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";

function Disable(){
    const navigate = useNavigate();
    //function for signout
    async function handlesignout(){
        try{
            await signOut(auth).then(() => {
                alert('successfully signed out');
              }).catch((error) => {
                console.error(error);
              });
              navigate('/');
              window.location.reload();
        }
        catch(e){
            console.log('you got an error when sign out',e);
        }
    }
    return(
        <>
            <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10}}>
                    <p>Your account has been blocked. Please contact support for assistance.</p>
                    <p 
                    style={{padding:5,borderRadius:5,backgroundColor:'green',width:'fit-content',color:'white',cursor:'pointer'}}
                    onClick={()=>handlesignout()}
                    >back to login page</p>
                </div>
            </div>
        </>
    );
}

export default Disable;