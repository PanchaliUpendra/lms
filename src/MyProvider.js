import React, { useEffect, useState } from "react";
import MyContext from "./MyContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
import { onSnapshot } from "firebase/firestore";
// import { db } from "./Firebase";
import { createtickets, leadsgraphdoc ,ticketsgraphdoc , 
  documentsdoc, sparequotation, amcquotes, leadcollection, expensecollection,
  spareAndMachineDoc,
  workerscollection} from "./Data/Docs";
import { createquotes } from "./Data/Docs";
import { messaging } from "./Firebase";
import {getToken} from 'firebase/messaging';
import { writeBatch } from "firebase/firestore";
import { db } from "./Firebase";
import {doc} from "firebase/firestore";
// ____________________________
// import { collection, onSnapshot } from "firebase/firestore";
// import { db } from "./firebase"; // Assuming you have initialized your Firestore connection

// // Reference to the collection
// const leadsCollection = collection(db, "leadsgraph");

// // Listen to changes in the entire collection
// const unsubscribe = onSnapshot(leadsCollection, (snapshot) => {
//   snapshot.forEach((doc) => {
//     // Access doc.id for the document ID
//     // Access doc.data() for the document data
//     console.log(doc.id, " => ", doc.data());
//   });
// });

// To stop listening to changes, you can call unsubscribe()
// unsubscribe();

//_____________________________

function MyProvider({children}){

    // const[basicToken,setbasicToken]=useState('');
    const [user,setuser] = useState({
        isAuthed:false,
        uid:'',
        userdtl:'',
        role:''
    })
    const [sideNavOnOff,setSideNavOnOff] = useState(false);
    const [workersdata,setworkersdata]=useState({});//workerdsata storage
    const [workerskeys,setworkerskeys]=useState([]);//workers keys storage
    const [leadsdata,setleadsdata]=useState({});//leads data storage
    const [leadskeys,setleadskeys]=useState([]);//leads keys storage
    const [ticketsdata,setticketsdata]=useState({});//tickets data
    const [ticketskeys , setticketskeys] = useState([]);//all ticket keys
    const [expensesdata,setexpensesdata] = useState({});//expenses data
    const [expenseskeys,setexpenseskeys] = useState([]);//expenses keys
    const [quoteskeys,setquoteskeys] = useState([]);//quote keys
    const [quotesdata,setquotesdata] = useState({});//quotes data
    const [leadsgraphkeys,setleadsgraphkeys]=useState([]);//leads graph keys
    const [leadsgraphdata,setleadsgraphdata] = useState({});//leads graph data
    const [leadsgraphlasttwelve,setleadsgraphlasttwelve] =  useState([]);//array of last twelve months
    const [ticketsgraphkeys,setticketsgraphkeys]= useState([]);//tickets graph keys
    const [ticketsgraphdata,setticketsgraphdata] = useState({});// tickets graph data
    const [ticketsgraphlasttwelve,setticketsgraphlasttwelve]=useState([]);//array of last twelve months
    const [documentsdata,setdocumentsdata] = useState({});//ADD DOCUMENTS DATA
    const [documentskeys,setdocumentskeys] = useState([]);// document keys
    const [sparesdata,setsparesdata] = useState({});//spares data
    const [spareskeys,setspareskeys] = useState([]);//spares keys
    const [amcdata,setamcdata] = useState({});//amc data
    const [amckeys,setamckeys] = useState([]);//amc keys


    const[sparesArray,setSparesArray] = useState([]);//spares data
    const[machinesArray,setmachinesArray] = useState([]);//spares data
   

    const updateSideNav = ()=>{
      setSideNavOnOff(prev=>!prev);
    }

    const DeleteQuoteElement = (quoteid)=>{//deleting the quoations
      const temp_quote_data = quotesdata;
      const temp_quote_key = quoteskeys.filter((item)=>item!==quoteid);
      setquoteskeys(temp_quote_key);
      if(quoteid in temp_quote_data){
        delete temp_quote_data[quoteid];
        setquotesdata(temp_quote_data);
      }
    }
    
    const delete_spare_quote = (spareid) =>{ //deleting the spare
      const temp_spare_data = sparesdata;
      const temp_spare_key = spareskeys.filter((item)=>item!==spareid);
      setspareskeys(temp_spare_key);
      if(spareid in temp_spare_data){
        delete temp_spare_data[spareid];
        setquotesdata(temp_spare_data);
      }
    }

    const Delete_amc_quote = (amcid) =>{ //deleting the amc
      const temp_amc_data = amcdata;
      const temp_amc_key = amckeys.filter((item)=>amcid!==item);
      setamckeys(temp_amc_key);
      if(amcid in temp_amc_data){
        delete temp_amc_data[amcid];
        setamcdata(temp_amc_data);
      }
    }

    const Delete_tickets = (tktid) =>{ // here we are deleting the tickets
      const temp_tkt_data = ticketsdata;
      const temp_tkt_keys = ticketskeys.filter((item)=>item!==tktid);
      setticketskeys(temp_tkt_keys);
      if(tktid in temp_tkt_data){
        delete temp_tkt_data[tktid];
        setticketsdata(temp_tkt_data);
      }
    }

    const Delete_Leads =(leadid) =>{// deleting the leads data
      const temp_leads_data = leadsdata;
      const temp_leads_keys = leadskeys.filter((item)=>item!==leadid);
      setleadskeys(temp_leads_keys);
      if(leadid in temp_leads_data){
        delete temp_leads_data[leadid];
        setleadsdata(temp_leads_data);
      }
    }

    const Delete_Expenses = (expid) =>{//deleting the expenses data
      const temp_expense_data = expensesdata;
      const temp_expense_keys = expenseskeys.filter((item)=>item!==expid);
      setexpenseskeys(temp_expense_keys);
      if(expid in temp_expense_data){
        delete temp_expense_data[expid];
        setexpensesdata(temp_expense_data);
      }
    }



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
        quotesdata:quotesdata,
        quoteskeys:quoteskeys,
        leadsgraphkeys:leadsgraphkeys,
        leadsgraphdata:leadsgraphdata,
        leadsgraphlasttwelve:leadsgraphlasttwelve,
        ticketsgraphkeys:ticketsgraphkeys,
        ticketsgraphdata:ticketsgraphdata,
        ticketsgraphlasttwelve:ticketsgraphlasttwelve,
        documentsdata:documentsdata,
        documentskeys:documentskeys,
        sparesdata:sparesdata,
        spareskeys:spareskeys,
        amcdata:amcdata,
        amckeys:amckeys,
        role:user.role,
        sideNavOnOff:sideNavOnOff,
        sparesArray:sparesArray,
        machinesArray:machinesArray,

        updateSideNav,
        DeleteQuoteElement,
        delete_spare_quote,
        Delete_amc_quote,
        Delete_tickets,
        Delete_Leads,
        Delete_Expenses,
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

              //spares and machines data fetching
              const fetch_spares_and_machine_data = async() =>{
                try{
                  await onSnapshot(spareAndMachineDoc,(docs)=>{
                    const sparesandmachinedata = docs.data();
                    setmachinesArray(sparesandmachinedata.machines);
                    setSparesArray(sparesandmachinedata.spares);
                  })
                }catch(err){
                  console.log('you got an error while fetching spares and machines data: ',err);
                }
              }
              fetch_spares_and_machine_data();
              //fetch amc data
              const fetch_amc_data = async()=>{
                try{
                  await onSnapshot(amcquotes,(snapshot)=>{
                    const tempamcdata = {};
                    snapshot.forEach((docs)=>{
                      Object.assign(tempamcdata,docs.data());
                    })
                      setamcdata(prev=>({
                        ...prev,
                        ...tempamcdata
                      }));
                      const tempamckeys = Object.keys(tempamcdata);
                      const sorttempamckeys = [...tempamckeys].sort((a,b)=>b-a);
                      setamckeys(prev=>Array.from(new Set([...prev,...sorttempamckeys])));
                    
                  })
                }catch(err){
                  console.error('you got an error while fetching amc data: ',err);
                }
              }
              fetch_amc_data();
              //fetching amc ends here

              //spare quotation fetching
              const fetchSpareData = async() =>{
                try{
                 
                  await onSnapshot(sparequotation,(snapshot)=>{
                    const tempsparedata = {};
                    snapshot.forEach((docs)=>{
                      Object.assign(tempsparedata,docs.data())
                    })
                      setsparesdata(prev=>({
                        ...prev,
                        ...tempsparedata
                      }));
                      const tempsparekeys = Object.keys(tempsparedata);
                      const sorttempsparekeys = [...tempsparekeys].sort((a,b)=>b-a);
                      setspareskeys(prev => Array.from(new Set([...prev, ...sorttempsparekeys])))
                  })
                }catch(err){
                  console.error('you got an error while fetching spare data: ',err);
                }
              }
              fetchSpareData();
              //spare quotation ending here


              //fetching the documents data
              const fetchdocumentsdata = async() =>{
                try{
                  await onSnapshot(documentsdoc,(doc)=>{
                    const tempdocdata = doc.data();
                    setdocumentsdata(tempdocdata);
                    const tempdockeys = Object.keys(tempdocdata);
                    setdocumentskeys(tempdockeys);
                  })
                }catch(e){
                  console.log('you got an error while fetching the documents data',e);
                }
              }
              fetchdocumentsdata();//fetching the documents data
              //fetching the tickets graph data
              const fetchticketsgraphdata = async() =>{
                try{
                  await onSnapshot(ticketsgraphdoc,(doc)=>{
                    const tempticketsgraphdata = doc.data();
                    setticketsgraphdata(tempticketsgraphdata);
                    const tempticketsgraphkeys = Object.keys(tempticketsgraphdata);
                    const sorttempticketgraphkeys = [...tempticketsgraphkeys].sort((a,b)=>a-b);
                    setticketsgraphkeys(sorttempticketgraphkeys);
                    
                    const templasttwelvetkt = sorttempticketgraphkeys.slice(-12);
                    const finaltkttwelve=[];
                    for(let i=0;i<templasttwelvetkt.length;i++){
                      finaltkttwelve.push({
                        ...tempticketsgraphdata[templasttwelvetkt[i]]
                      })
                    }
                    setticketsgraphlasttwelve(finaltkttwelve);
                  })
                }catch(e){
                  console.log('you got an error while fetching the tickets graph data',e);
                }
              }
              fetchticketsgraphdata();//fetching the tickets graph
              //fetching the leads graph data 
              const fetchleadsgraphdata = async()  =>{
                try{
                  await onSnapshot(leadsgraphdoc,(doc)=>{
                    const templeadsgraphdata = doc.data();
                    setleadsgraphdata(templeadsgraphdata);
                    const templeadsgraphkeys = Object.keys(templeadsgraphdata);
                    const sortleadsgraphkeys = [...templeadsgraphkeys].sort((a,b)=>a-b);
                    setleadsgraphkeys(sortleadsgraphkeys);
               
                    // if(sortleadsgraphkeys.length>0){
                      const templasttwelve = sortleadsgraphkeys.slice(-12);
                      const finallasttwelvedata=[];
                    
                      for(let i=0;i<templasttwelve.length;i++){
                        finallasttwelvedata.push({
                          ...templeadsgraphdata[templasttwelve[i]]
                        })
                      }
                      
                      setleadsgraphlasttwelve(finallasttwelvedata);
                    // }
                    
                  })
                }catch(e){
                  console.log('you got an error while fetching the leads gvraph data',e);
                }
              }
              fetchleadsgraphdata();//calling the leads graph data
              
              // __________________________________________Quotation_____________________________
              //fetching the quotes
              const fetchquotationsdata = async() =>{
                try{
                  await onSnapshot(createquotes,(snapshot)=>{
                    const tempquotesdata = {};
                    snapshot.forEach((docs)=>{
                      Object.assign(tempquotesdata,docs.data());
                    })
                      setquotesdata(prev=>({
                        ...prev,
                        ...tempquotesdata
                      }));
                      const tempquoteskeys = Object.keys(tempquotesdata);
                      const sorttempquoteskeys = [...tempquoteskeys].sort((a,b)=>b-a);
                      setquoteskeys(prev => Array.from(new Set([...prev, ...sorttempquoteskeys])))
                  })
                }catch(e){
                  console.log('you got an error while fetching the quotations data',e);
                }
              }
              fetchquotationsdata();//calling the function  to fetch quotation data
              // ________________________________________________________________________________


              //fetching the expenses
              const fetchexpensesdata = async() =>{
                try{
                  await onSnapshot(expensecollection,(snapshot)=>{
                    const temp_expenses_data={};
                    snapshot.forEach((docs)=>{
                      // const temp_expenses_data = docs.data();
                      Object.assign(temp_expenses_data,docs.data());
                    })
                      setexpensesdata(prev=>({
                        ...prev,
                        ...temp_expenses_data
                      }));
                      const temp_expenses_keys = Object.keys(temp_expenses_data);
                      const sort_temp_expenses_keys = [...temp_expenses_keys].sort((a,b)=>b-a);
                      setexpenseskeys(prev=>Array.from(new Set([...prev,...sort_temp_expenses_keys])));
                    
                    
                  })
                }catch(err){
                  console.log('you got an error while fetching the expenses data',err);
                }
              }
              fetchexpensesdata();//fetching the expenses data


              //fetching tickets data
              const fetchticketsdata = async() =>{
                try{
                  await onSnapshot(createtickets,(snapshot)=>{
                    const temp_tickets_data={};
                    snapshot.forEach((docs)=>{
                      // const temp_tickets_data = docs.data();
                      Object.assign(temp_tickets_data,docs.data());
                    })
                      setticketsdata(prev=>({
                        ...prev,
                        ...temp_tickets_data
                      }));
                      const temp_ticket_keys = Object.keys(temp_tickets_data);
                      const sort_temp_tkt_keys = [...temp_ticket_keys].sort((a,b)=>b-a);
                      setticketskeys(prev=>Array.from(new Set([...prev,...sort_temp_tkt_keys])));
                    
                  })
                }catch(err){
                  console.error('you geting an error while fetching the tickets data ',err);
                }
              }
             
              fetchticketsdata();//calling the function to fetch the tickets data

              
              //fetching leads data
              const fetchleadsdata = async() =>{
                try{
                  await onSnapshot(leadcollection,(snapshot)=>{
                    const temp_leads_data={};
                    snapshot.forEach((docs)=>{
                      // const temp_leads_data = docs.data();
                      Object.assign(temp_leads_data,docs.data());
                    })
                      setleadsdata(prev=>({
                        ...prev,
                        ...temp_leads_data
                      }));
                      const templeads_keys = Object.keys(temp_leads_data);
                      const sorttempleads = [...templeads_keys].sort((a,b)=>b-a);
                      setleadskeys(prev=>Array.from(new Set([...prev,...sorttempleads])));
                    
                    // const leadsdata = doc.data();

                    // // just checking the data size
                    // const jsonString = JSON.stringify(leadsdata);
                    // // Calculate the size of the JSON string in bytes
                    // const sizeInBytes = new Blob([jsonString]).size;
                    // console.log('Document size in bytes:', sizeInBytes);


                    // setleadsdata(leadsdata);
                    // const leadskeyarray = Object.keys(leadsdata);
                    // const sortleadskeyarray = [...leadskeyarray].sort((a,b)=>b-a);
                    // setleadskeys(sortleadskeyarray);

                  })
                }catch(e){
                  console.log('you got an error while fetching the leads data');
                }
              }
              fetchleadsdata()//fetching the leads data -->function calling
              //fetching the workers data
              // const unsubsec = doc(db,'workers','yWXH2DQO8DlAbkmQEQU4');
              async function requestPermission(temp_workers_data){
                const permission = await Notification.requestPermission();
                if(permission === 'granted'){
                  const batch = writeBatch(db);// Get a new write batch
                  // Generate Token
                  const token = await getToken(messaging,{vapidKey:'BB6UCV85cN-An7EfH2WSLhiLirOs7JEh3yur2_QlF9Z-ISP4yvCJTj1MgobxOhgYTqfZBSKb3Jf8bsjdTxyH_z0'});
                  console.log('Token Gen',token);
                  // setbasicToken(token);
                  batch.update(doc(db,"workers",`${temp_workers_data[uid].docid}`), {[uid]:{
                    ...temp_workers_data[uid],
                    token:token
                  }});
                  await batch.commit();
                }else if(permission === 'denied'){
                  alert("you denied for the notification");
            
                }
              }
              const fetchworkerdata = async() =>{
                try{
                  await onSnapshot(workerscollection, (snapshot) => {
                    const temp_workers_data = {};
                    snapshot.forEach((doc) => {
                      Object.assign(temp_workers_data, doc.data());
                    });
              
                    if (uid in temp_workers_data) {
                      // console.log(temp_workers_data[uid].role);
                      setuser((prev) => ({
                        ...prev,
                        role: temp_workers_data[uid].role,
                      }));

                    }
              
                    setworkersdata((prev) => ({
                      ...prev,
                      ...temp_workers_data,
                    }));
              
                    const temp_workers_keys = Object.keys(temp_workers_data);
                    const sortworkerskeys = [...temp_workers_keys].sort((a, b) => b - a);
                    setworkerskeys((prev) => Array.from(new Set([...prev, ...sortworkerskeys])));
                    uid in temp_workers_data && requestPermission(temp_workers_data);

                  });
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