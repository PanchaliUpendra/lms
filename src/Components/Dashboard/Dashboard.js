import React, {useContext, useState } from "react";
import './Dashboard.css';
import Sidenav from "../Sidenav/Sidenav";
// import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import MyContext from "../../MyContext";
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from "react-router-dom";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

import Leadsgraph from "./Leadsgraph/Leadsgraph";
import Ticketsgraph from "./Leadsgraph/Ticketsgraph";

import {  ref, deleteObject } from "firebase/storage";
import { storage } from "../../Firebase";

import { updateDoc, deleteField } from "firebase/firestore";
import { writeBatch } from "firebase/firestore";
import { db } from "../../Firebase";
import { months } from "../../Data/Months";
import { createtickets , ticketsgraphdoc } from "../../Data/Docs";

import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {differenceInHours} from 'date-fns';
import Notify from "../Notifications/Notify";

function Dashboard(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    const batch = writeBatch(db);//get a new write batch
    const [countleads,setcountleads] = useState(5);
    const [counttickets,setcounttickets] = useState(5);
    //backdrop loading toggle
    const[showloading,setshowloading] = useState(false);
    //code only for toggle the menu bar
    // const [searchworker,setsearchworker]=useState('');
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here

    //handle time difference
    function handletimedifference(ticket){
        if(Object.prototype.hasOwnProperty.call(sharedvalue.ticketsdata[ticket], "ctktdatetime")){
            const lastDate = new Date(sharedvalue.ticketsdata[ticket].ctktdatetime);
            const presenttime = new Date();
            const currenttime = presenttime.toISOString();
            const hoursDifference = differenceInHours(new Date(currenttime),lastDate);
            return hoursDifference;
        }
        return '-';
    }

    //tickets flow in dashboard
     //feedback state handling
     const[feedbackform,setfeedbackform] = useState({
        active:false,
        content:'',
        tktid:'',
    })
     //handling the submit data and closing the ticket
     async function handlingsubmitclose(){
        try{
            if(feedbackform.content!=='' && feedbackform.tktid!==''){
                if(feedbackform.tktid!==''){
                    await batch.update(createtickets,{
                        [feedbackform.tktid]:{
                            ...sharedvalue.ticketsdata[feedbackform.tktid],
                            status:'close',
                            workingstatus:feedbackform.content
                        }
                    });
                    //updating the tickets graph data
                    let currentDate = new Date();
                    let year = currentDate.getFullYear();
                    let month = (currentDate.getMonth()+1).toString().padStart(2,'0');
                    let yearMonth = year + month;
                    let yearMonthNumber = Number(yearMonth);
                    
                    if(sharedvalue.ticketsgraphkeys.includes(yearMonth)){
                        
                        await batch.update(ticketsgraphdoc,{
                            [yearMonthNumber]:{
                                ...sharedvalue.ticketsgraphdata[yearMonthNumber],
                                tc:Number(sharedvalue.ticketsgraphdata[yearMonthNumber].tc)+1
                            }
                        })
                    }else{
                        
                        await batch.update(ticketsgraphdoc,{
                            [yearMonthNumber]:{
                                to:0,
                                tc:1,
                                month:months[month]
                            }
                        })
                    }
                    //updating the the tickets ends here
                    await batch.commit();
                }
                setfeedbackform(prev=>({
                    ...prev,
                    content:'',
                    active:false,
                    tktid:''
                }))
            }else{
                alert('pleaser provide the content..')
            }
        }catch(e){
           console.log('you got an error while submitting the data',e);
        }
    }
    async function handledeleteticket(tktid){
        setshowloading(true)
        try{
            const desertRef = ref(storage,sharedvalue.ticketsdata[tktid].fileurl);
            deleteObject(desertRef).then(() => {
                console.log('deleted the imae storage url');
              }).catch((error) => {
                console.log("you got an error while deleting the storage",error);
              });
            await updateDoc(createtickets,{
                [tktid]:deleteField()
            });
            await batch.commit();

        }catch(e){
            console.log('you getting an error while deleting the ticket ',e);
        }
        setshowloading(false);
    }
    //tickets flow eendds here
    
    return(
        <>
            <div className={`manlead-con ${feedbackform.active===true?'manlead-con-inactive':''}`}>
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
                    {/* Dashboard starts from here */}

                    <div className="dashboard-show-all-workers">
                        {/* div one */}
                        {sharedvalue.role==='admin' &&
                        <div>
                            <div className="dashboard-each-profile-div">
                                <PersonIcon sx={{color:'white'}}/>
                            </div>
                            <div className="dashboard-each-profile-content-div">
                                <p>total managers</p>
                                <p>{sharedvalue.workerskeys.filter(item=>sharedvalue.workersdata[item].role==='manager').length}</p>
                            </div>
                        </div>
                        }
                        {/* div two */}
                        {(sharedvalue.role==='admin' || sharedvalue.role==='manager' ) &&
                        <div>
                            <div className="dashboard-each-profile-div">
                                <PersonIcon sx={{color:'white'}}/>
                            </div>
                            <div className="dashboard-each-profile-content-div">
                                <p>total employees</p>
                                <p>{sharedvalue.workerskeys.filter(item=>sharedvalue.workersdata[item].role==='employee').length}</p>
                            </div>
                        </div>
                        }
                        {/* div three  */}
                        {(sharedvalue.role==='admin' || sharedvalue.role==='manager' ) &&
                        <div>
                            <div className="dashboard-each-profile-div">
                                <PersonIcon sx={{color:'white'}}/>
                            </div>
                            <div className="dashboard-each-profile-content-div">
                                <p>total customers</p>
                                <p>{sharedvalue.workerskeys.filter(item=>sharedvalue.workersdata[item].role==='customer').length}</p>
                            </div>
                        </div>
                        }
                        {/* div four */}
                        <div>
                            <div className="dashboard-each-profile-div">
                                <PersonIcon sx={{color:'white'}}/>
                            </div>
                            <div className="dashboard-each-profile-content-div">
                                <p>total leads</p>
                                <p>{sharedvalue.leadskeys.length>0 && sharedvalue.workerskeys.length>0 &&
                                    sharedvalue.leadskeys
                                    .filter(item =>((sharedvalue.role==='employee' && sharedvalue.leadsdata[item].employeeid===sharedvalue.uid)||(sharedvalue.role==='admin')||(sharedvalue.role==='manager' && sharedvalue.leadsdata[item].managerid===sharedvalue.uid) || sharedvalue.uid===sharedvalue.leadsdata[item].createdbyid))
                                    .length}</p>
                            </div>
                        </div>
                        {/* div five */}
                        <div>
                            <div className="dashboard-each-profile-div">
                                <ReceiptIcon sx={{color:'white'}}/>
                            </div>
                            <div className="dashboard-each-profile-content-div">
                                <p>total tickets</p>
                                <p>{sharedvalue.ticketskeys.length>0 && sharedvalue.workerskeys.length>0 &&
                                    sharedvalue.ticketskeys
                                    .filter(item=>(sharedvalue.role==='admin' ||(sharedvalue.role==='employee' && sharedvalue.ticketsdata[item].ctktemployee===sharedvalue.uid)||(sharedvalue.role==='manager' && sharedvalue.ticketsdata[item].ctktmanager===sharedvalue.uid)||
                                    (sharedvalue.ticketsdata[item].ctktcustname!=='other' && sharedvalue.uid===sharedvalue.workersdata[sharedvalue.ticketsdata[item].ctktcustname].uid)||
                                    (sharedvalue.ticketsdata[item].ctktcustname==='other' &&sharedvalue.uid===sharedvalue.ticketsdata[item].createdbyid)))
                                    .length}</p>
                            </div>
                        </div>
                    </div>

                                        {/* recent tickets starts here */}
                                        <div className="dashboard-display-leads">
                        <div className="dashboard-display-leads-header">
                            <h1>Recent Leads</h1>
                            <div>
                                
                                <label onClick={()=>navigate('/managelead/viewlead')}>Show All Leads</label>
                            </div>
                        </div>
                        {/* diplaying the count of the leads  starts here*/}
                        <div className="display-count-leads-tickets">
                            <p>Show Top </p>
                            <input type='number' value={countleads} onChange={(e)=>setcountleads(e.target.value)}/>
                            <p>Leads</p>
                        </div>
                        {/* displaying the couiint of tickets ends here */}
                        {/* list starts from here */}
                        <div className="view-manager-list-con-dashboard">
                            {/* <div className="view-list-of-all-search">
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Name/RegID" onChange={(e)=>setsearchworker(e.target.value)}/>
                                </div>
                            </div> */}
                            {/* search bar complet6ed here */}
                            <div className="view-list-table-con">
                                <table>
                                    <thead>
                                    <tr className="table-head-row">
                                            <th>status</th>
                                            <th>action</th>
                                            <th><p>Company | Contact Person| Mobile</p></th>
                                            {/* <th>Contact Person</th> */}
                                            <th>
                                                <p>country |</p>
                                                <p>State | district</p>
                                            </th>
                                            {/* <th>state</th>
                                            <th>district</th> */}
                                            <th>
                                                <p>Machine Require |</p>
                                                <p>machine Type |</p>
                                                <p>number of chutes</p>
                                            </th>
                                            {/* <th>number of chutes</th> */}
                                            
                                            <th>next meeting date</th>
                                            <th>
                                                <p>latest title |</p>
                                                <p>latest sub-title</p>
                                            </th>
                                            {/* <th>latest sub-title</th> */}
                                            <th>latest comment</th>
                                            <th>manager</th>
                                            <th>employee</th>
                                            <th>created by</th>
                                            <th>REG.ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sharedvalue.leadskeys.length>0 && sharedvalue.workerskeys.length>0 &&
                                            sharedvalue.leadskeys
                                            .filter(item =>((sharedvalue.role==='employee' && sharedvalue.leadsdata[item].employeeid===sharedvalue.uid)||(sharedvalue.role==='admin')||(sharedvalue.role==='manager' && sharedvalue.leadsdata[item].managerid===sharedvalue.uid) || sharedvalue.uid===sharedvalue.leadsdata[item].createdbyid))
                                            .slice(0,countleads)
                                            .sort((a, b) => {
                                                const dateA = new Date(sharedvalue.leadsdata[a].custnextdate);
                                                const dateB = new Date(sharedvalue.leadsdata[b].custnextdate);
                                                return dateA - dateB;
                                            })
                                            .map((lead,idx)=>(
                                                <tr key={idx} className="each-table-row-view" >
                                                    <td>
                                                        <p style={{fontWeight:'bold',color:`${sharedvalue.leadsdata[lead].custstatus==='Closed'?'red':'green'}`}}>{sharedvalue.leadsdata[lead].custstatus}</p>
                                                    </td>
                                                    {/* action */}
                                                    <td >
                                                        <div className='view-manager-list-acttion-icon'>
                                                            {(sharedvalue.leadsdata[lead].custstatus==='Lost' || sharedvalue.leadsdata[lead].custstatus==='Closed' )===false && <EditIcon fontSize="small" sx={{color:'green',cursor:'pointer'}} onClick={()=>navigate(`/managelead/updatelead/${lead}`)}/>}
                                                            <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} onClick={()=>navigate(`/managelead/viewlead/${lead}`)} fontSize="small"/>
                                                        </div>
                                                    </td>
                                                    {/* company name */}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                         <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].custcompanyname}|
                                                        </p>
                                                        
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].contperson}|
                                                           
                                                        </p>
                                                        
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].contcountrycode+"-"+ sharedvalue.leadsdata[lead].contmobilenum} 
                                                        </p>
                                                        
                                                    </td>
                                                    {/* contact person */}
                                                    {/* <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].contperson}
                                                        </p>
                                                    </td> */}
                                                    
                                                    {/* country */}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">{sharedvalue.leadsdata[lead].ofdcountry} |</p>
                                                        
                                                        <p className="view-manager-list-name">
                                                           
                                                            {sharedvalue.leadsdata[lead].ofdst} |
                                                        </p>
                                                         
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].ofddst}
                                                        </p>
                                                    </td>
                                                    {/* state */}
                                                    {/* <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        
                                                        
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].ofdst}
                                                        </p>
                                                    </td> */}
                                                    {/* district */}
                                                    {/* <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].ofddst}
                                                        </p>
                                                    </td> */}
                                                    {/* machine type */}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                         <p className="view-manager-list-name">{sharedvalue.leadsdata[lead].machinereq}</p>
                                                         
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].machinetype} - {sharedvalue.leadsdata[lead].chutes}
                                                        </p>
                                                    </td>
                                                    {/* no.of chutes */}
                                                    {/* <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].chutes}
                                                        </p>
                                                    </td>  */}
                                                    
                                                    {/* next meeting date*/}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                         <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].custnextdate.toString()}
                                                        </p>
                                                    </td>
                                                    {/* latest title*/}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].latesttitle[0]} |
                                                        </p>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].latestsubtitle[0]}
                                                        </p>
                                                    </td>
                                                    {/* latest sub-title*/}
                                                    {/* <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].latestsubtitle[0]}
                                                        </p>
                                                    </td> */}
                                                    {/* latest comment*/}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].latestcomment[0]}
                                                        </p>
                                                    </td>
                                                    {/* manager*/}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].managerid!==''?sharedvalue.workersdata[sharedvalue.leadsdata[lead].managerid].name:'-'}
                                                        </p>
                                                    </td>
                                                    {/* employee*/}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                        {sharedvalue.leadsdata[lead].employeeid!==''?sharedvalue.workersdata[sharedvalue.leadsdata[lead].employeeid].name:'-'}
                                                        </p>
                                                    </td>
                                                    {/* created by*/}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].createdbyid!==''?sharedvalue.workersdata[sharedvalue.leadsdata[lead].createdbyid].name:'-'}
                                                        </p>
                                                    </td>
                                                    {/* REGID */}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {lead}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {/* your table completes here */}
                           
                        </div>
                    </div>
                    {/* recent tickets ends here */}

                    {
                        sharedvalue.role==='admin' && 
                        <div className="leads-graph-con-outer">
                            <div className="leads-graph-con">
                                leads graph
                            </div>
                            <Leadsgraph leadsgraphlasttwelve={sharedvalue.leadsgraphlasttwelve}/>
                        </div>
                    }
                    
                    
                    
                        


                    
                    

                    {/* last 6 months graph */}
                    <div className="dashboard-display-leads">
                        <div className="dashboard-display-leads-header">
                            <h1>Recent Tickets</h1>
                            <div>
                                <label onClick={()=>navigate('/manageticket/viewticket')}>Show All Tickets</label>
                            </div>
                        </div>
                        {/* diplaying the count of the leads  starts here*/}
                        <div className="display-count-leads-tickets">
                            <p>Show Top </p>
                            <input type='number' value={counttickets} onChange={(e)=>setcounttickets(e.target.value)}/>
                            <p>Tickets</p>
                        </div>
                        {/* displaying the couiint of tickets ends here */}
                            {/* list starts from here */}
                            <div className="view-manager-list-con-dashboard">
                            {/* <div className="view-list-of-all-search">
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Customer/TktID" onChange={(e)=>setsearchworker(e.target.value)}/>
                                </div>
                            </div> */}
                            {/* table starts from here */}
                            <div className="view-list-table-con">
                                <table >
                                    <thead>
                                        <tr className="table-head-row">
                                            <th>status</th>
                                            <th>action</th>
                                            <th>Company Name</th>
                                            <th>time</th>
                                            <th>open date</th>
                                            <th>closed date</th>
                                            <th>
                                                <p>country |</p>
                                                <p>state | district</p>
                                            </th>
                                            
                                            <th>call type</th>
                                            <th>category</th>
                                            <th>priority</th>
                                            <th>manager</th>
                                            <th>employee</th>
                                            <th>file</th>
                                            <th>Comment</th>
                                            <th>Tkt.ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sharedvalue.ticketskeys.length>0 && sharedvalue.workerskeys.length>0 &&
                                            sharedvalue.ticketskeys
                                            .filter(item=>(sharedvalue.role==='admin' ||(sharedvalue.role==='employee' && sharedvalue.ticketsdata[item].ctktemployee===sharedvalue.uid)||(sharedvalue.role==='manager' && sharedvalue.ticketsdata[item].ctktmanager===sharedvalue.uid)||
                                            (sharedvalue.ticketsdata[item].ctktcustname!=='other' && sharedvalue.uid===sharedvalue.workersdata[sharedvalue.ticketsdata[item].ctktcustname].uid)||
                                            (sharedvalue.ticketsdata[item].ctktcustname==='other' && sharedvalue.uid===sharedvalue.ticketsdata[item].createdbyid)))
                                            .slice(0,counttickets)
                                            .map((ticket,idx)=>(
                                                <tr key={idx}>
                                                    {/* status */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className={`${(sharedvalue.ticketsdata[ticket].status==='open')?'active-ticket-view-condition':sharedvalue.ticketsdata[ticket].status==='close'?'inactive-ticket-view-condition':'resolve-ticket-view-condition'}`}>
                                                            {(sharedvalue.ticketsdata[ticket].status==='open')?'Active':sharedvalue.ticketsdata[ticket].status==='close'?'Closed':'Resolved'}
                                                        </p>
                                                    </td>
                                                    {/* action */}
                                                    <td>
                                                        <div className='view-manager-list-acttion-icon'>
                                                        {sharedvalue.ticketsdata[ticket].status==='open' && <EditIcon sx={{color:'green',cursor:'pointer'}} fontSize="small" onClick={()=>navigate(`/manageticket/updateticket/${ticket}`)}/>}
                                                        {sharedvalue.ticketsdata[ticket].status==='open' && <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} fontSize="small" onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}/>}
                                                        {sharedvalue.ticketsdata[ticket].status==='close' && sharedvalue.role==='admin' && <DeleteOutlineRoundedIcon sx={{color:'red',cursor:'pointer'}} fontSize="small" onClick={()=>handledeleteticket(ticket)}/>}
                                                            {sharedvalue.ticketsdata[ticket].status==='resolved' && ((sharedvalue.ticketsdata[ticket].ctktcustname!=='other' &&
                                                             sharedvalue.uid===sharedvalue.workersdata[sharedvalue.ticketsdata[ticket].ctktcustname].uid )||
                                                             (sharedvalue.ticketsdata[ticket].ctktcustname==='other' && sharedvalue.uid===sharedvalue.ticketsdata[ticket].createdbyid)) &&
                                                              <p className="feedback-button" onClick={()=>setfeedbackform(prev=>({
                                                                ...prev,
                                                                active:true,
                                                                tktid:ticket
                                                              }))}>feedback</p>}
                                                        </div>
                                                    </td>
                                                    {/* customer */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktcustname==='other'?
                                                            sharedvalue.ticketsdata[ticket].ctktothercustname
                                                            :
                                                            sharedvalue.workersdata[sharedvalue.ticketsdata[ticket].ctktcustname].cname
                                                            }
                                                        </p>
                                                    </td>
                                                    {/* time difference */}
                                                    {
                                                        <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                            <p className="view-manager-list-name">{sharedvalue.ticketsdata[ticket].status==='open'?handletimedifference(ticket):'-'} {sharedvalue.ticketsdata[ticket].status==='open' && handletimedifference(ticket)!=='-'?'h':''}</p>
                                                        </td>
                                                    }
                                                    {/* open date */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                        {(Object.prototype.hasOwnProperty.call(sharedvalue.ticketsdata[ticket], "ctktopen") && sharedvalue.ticketsdata[ticket].ctktopen!=='')?sharedvalue.ticketsdata[ticket].ctktopen:'-'}
                                                        </p>
                                                    </td>

                                                    {/* closed date */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                        {(Object.prototype.hasOwnProperty.call(sharedvalue.ticketsdata[ticket], "ctktclose") && sharedvalue.ticketsdata[ticket].ctktclose!=='' )?sharedvalue.ticketsdata[ticket].ctktclose:'-'}
                                                        </p>
                                                    </td>

                                                    {/* country */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktcountry} |
                                                        </p>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktstate} |
                                                        </p>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktdist}
                                                        </p>
                                                    </td>
                                                    
                                                    {/* state */}
                                                    {/* <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktstate}
                                                        </p>
                                                    </td> */}
                                                    {/* district */}
                                                    {/* <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktdist}
                                                        </p>
                                                    </td> */}
                                                    
                                                    {/* call type */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktcalltype}
                                                        </p>
                                                    </td>
                                                    {/* category */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktcate}
                                                        </p>
                                                    </td>
                                                    {/* priority */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktpriority}
                                                        </p>
                                                    </td>
                                                    
                                                    {/* manager */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktmanager!==''?sharedvalue.workersdata[sharedvalue.ticketsdata[ticket].ctktmanager].name:'-'}
                                                        </p>
                                                    </td>
                                                    {/* ctktemployee */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                        {sharedvalue.ticketsdata[ticket].ctktemployee!==''?sharedvalue.workersdata[sharedvalue.ticketsdata[ticket].ctktemployee].name:'-'}
                                                        </p>
                                                    </td>
                                                     {/* view file */}
                                                    <td>
                                                        <div className='view-manager-list-acttion-icon'>
                                                            <a href={sharedvalue.ticketsdata[ticket].fileurl} rel="noreferrer" target="_blank">
                                                            <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} fontSize="small"/>
                                                            </a>
                                                        </div>
                                                    </td>
                                                     {/* working status */}
                                                     <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].workingstatus}
                                                        </p>
                                                    </td>
                                                     
                                                    {/* Tkt ID */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {ticket}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {/* table ends here */}
                        </div>
                        {/* list ends here */}
                    </div>

                    {/* graphs starts here */}
                    {
                        sharedvalue.role==='admin' && 
                        <div className="leads-graph-con-outer">
                            <div className="leads-graph-con">
                                tickets graph
                            </div>
                            <Ticketsgraph ticketsgraphlasttwelve={sharedvalue.ticketsgraphlasttwelve}/>
                        </div>
                    }
                    
                    {/* last 6 months graph  ends here*/}

                    {/* last div part */}
                    <div className="dashboard-last-div">

                    </div>
                    
                </div>
            </div>

            {/* feed back popup */}

            <div  className={`view-ticket-list-popup-feedback ${feedbackform.active===true?'active-delete-popup-feedback':''}`} >
                <div className="viewticket-closeicon-comes-here">
                    <CloseIcon fontSize="small" onClick={()=>setfeedbackform(prev=>({
                        ...prev,
                        active:false
                    }))} sx={{cursor:'pointer'}}/>
                </div>
                <div className="viewticket-feedback-form-here">
                    <p>Feedback</p>
                    <textarea value={feedbackform.content} onChange={(e)=>setfeedbackform(prev=>({
                        ...prev,
                        content:e.target.value
                    }))} placeholder="write your feedback here...."/>
                    
                </div>
                <div className="viewticket-submit-button">
                    <button onClick={()=>handlingsubmitclose()}>Submit</button>
                </div>
                
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
        </>
    );
}

export default Dashboard;