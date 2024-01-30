import React, { useEffect, useState } from "react";
import MyContext from "./MyContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./Firebase";
import { createtickets, leaddoc,createexpense} from "./Data/Docs";

function MyProvider({children}){

    const [user,setuser] = useState({
        isAuthed:false,
        uid:'',
        userdtl:'',
        role:''
    })
    const [workersdata,setworkersdata]=useState({});//workerdsata storage
    const [workerskeys,setworkerskeys]=useState([]);//workers keys storage
    const [leadsdata,setleadsdata]=useState({});//leads data storage
    const [leadskeys,setleadskeys]=useState([]);//leads keys storage
    const [ticketsdata,setticketsdata]=useState({});//tickets data
    const [ticketskeys , setticketskeys] = useState([]);//all ticket keys
    const [expensesdata,setexpensesdata] = useState({});//expenses data
    const [expenseskeys,setexpenseskeys] = useState([]);//expenses keys
   
    
    const sharedvalue ={
        isAuthed:user.isAuthed,
        uid:user.uid,
        userdtl:user.userdtl,
        workersdata:workersdata,
        workerskeys:workerskeys,
        leadsdata:leadsdata,
        leadskeys:leadskeys,
        ticketskeys:ticketskeys,
        ticketsdata:ticketsdata,
        expensesdata:expensesdata,
        expenseskeys:expenseskeys,
        role:user.role
    }

    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, (userd) => {
            if (userd) {
              const uid = userd.uid;

              //setting that user is authed
              setuser(prev=>({
                ...prev,
                isAuthed:true,
                uid:uid,
                userdtl:userd
              }))
              //fetching the expenses
              const fetchexpensesdata = async() =>{
                try{
                  await onSnapshot(createexpense,(doc)=>{
                    const tempexpensesdata = doc.data();
                    setexpensesdata(tempexpensesdata);
                    const tempexpenseskeys = Object.keys(tempexpensesdata);
                    const sorttempexpenseskeys = [...tempexpenseskeys].sort((a,b)=>b-a);
                    setexpenseskeys(sorttempexpenseskeys);
                  })
                }catch(e){
                  console.log('you got an error while fetching the expenses data',e);
                }
              }
              fetchexpensesdata();//fetching the expenses data
              //fetching tickets data
              const fetchticketsdata = async() =>{
                try{
                  await onSnapshot(createtickets,(doc)=>{
                    const tempticketsdata = doc.data();
                    setticketsdata(tempticketsdata);
                    const tempticketskeys = Object.keys(tempticketsdata);
                    const sorttempticketskeys = [...tempticketskeys].sort((a,b)=>b-a);
                    setticketskeys(sorttempticketskeys);

                  })
                }catch(e){
                  console.error('you geting an error while fetching the tickets data ',e);
                }
              }
             
              fetchticketsdata();//calling the function to fetch the tickets data
              //fetching leads data
              const fetchleadsdata = async() =>{
                try{
                  await onSnapshot(leaddoc,(doc)=>{
                    const leadsdata = doc.data();
                    setleadsdata(leadsdata);
                    const leadskeyarray = Object.keys(leadsdata);
                    const sortleadskeyarray = [...leadskeyarray].sort((a,b)=>b-a);
                    setleadskeys(sortleadskeyarray);

                  })
                }catch(e){
                  console.log('you got an error while fetching the leads data');
                }
              }
              fetchleadsdata()//fetching the leads data -->function calling
              //fetching the workers data
              const unsubsec = doc(db,'workers','yWXH2DQO8DlAbkmQEQU4');
              const fetchworkerdata = async() =>{
                try{
                  await onSnapshot(unsubsec,(doc)=>{
                    const workerdata = doc.data();
                    setworkersdata(workerdata);
                    setuser(prev=>({
                      ...prev,
                      role:workerdata[uid].role
                    }))
                    const keysarray = Object.keys(workerdata);
                    setworkerskeys(keysarray);
                  })
                }catch(e){
                  console.log('you got an error while fetching the users data');
                }
              }
              fetchworkerdata()//fetching the workers data-->function calling
            } else {

                //removing the user
              setuser(prev=>({
                ...prev,
                isAuthed:false,
                uid:'',
                user:'',
                role:''
              }))
              setworkersdata({});//removing the data when user exists
            }
          });

        
        return ()=>{
            unSubscribe();
        }
    },[]);

    return(
        <MyContext.Provider value={sharedvalue}>
            {children}
        </MyContext.Provider>
    );
}

export default MyProvider;