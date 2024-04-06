import React, {useContext, useState } from "react";
import './Viewticket.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
//imported material ui 
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { createtickets, ticketsgraphdoc,API_ONE_TO_ONE} from "../../../Data/Docs";
import { writeBatch} from "firebase/firestore";
import { db } from "../../../Firebase";
import { months } from "../../../Data/Months";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {  ref, deleteObject } from "firebase/storage";
import { storage } from "../../../Firebase";
import { updateDoc, deleteField } from "firebase/firestore";

import {differenceInHours} from 'date-fns';

function Viewticket(){
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);//get a new write batch
    //backdrop loading toggle
    const[showloading,setshowloading] = useState(false);
    //time difference
    // const[tkttimediff,settkttimediff] = useState('-')

    const[statusfilter,setstatusfilter] = useState('');//state to take the status input

    const navigate = useNavigate();
        //feedback state handling
        const[feedbackform,setfeedbackform] = useState({
            active:false,
            content:'',
            tktid:'',
            techspt:'Excellent',
            res:'Excellent'
        })
        
     // search bar input 
     const [searchworker,setsearchworker]=useState('');
    //code only for toggle the menu bar
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
    // send msg to admin
    async function handleSendMsgToAdmin(data){
        try{
            // console.log('response is here...');
            const response = await fetch(`${API_ONE_TO_ONE}/v1`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            });
            console.log(await response.json());

        }catch(e){
            console.log('you got an error while send msg to adim..',e);
        }
    }
    //handling the submit data and closing the ticket
    async function handlingsubmitclose(){
        try{
            if( feedbackform.tktid!==''){
                if(feedbackform.tktid!==''){
                    await batch.update(createtickets,{
                        [feedbackform.tktid]:{
                            ...sharedvalue.ticketsdata[feedbackform.tktid],
                            status:'close',
                            workingstatus:`Tech-${feedbackform.techspt} , Res-${feedbackform.res} , ${feedbackform.content}`
                        }
                    });
                    const message = `${sharedvalue.workersdata[sharedvalue.uid].name} changed the status of ticket [tkt.id ${feedbackform.tktid}] to close state`;
                    const phone = `9440000815`;//here we have to give the admin number
                    const data={
                            message:message,
                            phone:phone
                        }
                    await handleSendMsgToAdmin(data);
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
    //deleting the tickets starts here
    async function handledeleteticket(tktid){
        setshowloading(true)
        try{

            if(sharedvalue.ticketsdata[tktid].fileurl!==''){
                const desertRef = ref(storage,sharedvalue.ticketsdata[tktid].fileurl);
                deleteObject(desertRef).then(() => {
                    console.log('deleted the imae storage url');
                }).catch((error) => {
                    console.log("you got an error while deleting the storage",error);
                });
            }
            
            if(Object.prototype.hasOwnProperty.call(sharedvalue.ticketsdata[tktid],"ctktmodedata") && sharedvalue.ticketsdata[tktid].ctktmodedata!==''){
                const desertRef = ref(storage,sharedvalue.ticketsdata[tktid].ctktmodedata);
                deleteObject(desertRef).then(() => {
                    console.log('deleted the imae storage url');
                }).catch((error) => {
                    console.log("you got an error while deleting the storage",error);
                });
            }
            if(Object.prototype.hasOwnProperty.call(sharedvalue.ticketsdata[tktid],"ctktservicereport") && sharedvalue.ticketsdata[tktid].ctktservicereport!==''){
                const desertRef = ref(storage,sharedvalue.ticketsdata[tktid].ctktservicereport);
                    deleteObject(desertRef).then(() => {
                        console.log('deleted the imae storage url');
                    }).catch((error) => {
                        console.log("you got an error while deleting the storage",error);
                    });
                
            }


            await updateDoc(createtickets,{
                [tktid]:deleteField()
            });
            await batch.commit();

        }catch(e){
            console.log('you getting an error while deleting the ticket ',e);
        }
        setshowloading(false);
    }
    //deleting the tickets end here
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
                            <SearchIcon onClick={()=>navigate('/search')}/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your view ticket  starts from here */}
                    <div className='create-lead-con'>
                        <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>Recent Tickets</h1>
                            </div>
                        </div>
                        {/* list starts from here */}
                        <div className="view-manager-list-con">
                            <div className="view-list-of-all-search view-list-of-all-status-viewticket">
                                <div>
                                    <label>Status:</label>
                                    <select value={statusfilter} onChange={(e)=>setstatusfilter(e.target.value)}>
                                        <option value=''>All</option>
                                        <option value='open'>Open</option>
                                        <option value='resolved'>Resolved</option>
                                        <option value='close'>Closed</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Customer/TktID" onChange={(e)=>setsearchworker(e.target.value)}/>
                                </div>
                                
                            </div>
                            {/* table starts from here */}
                            <div className="view-list-table-con">
                                <table>
                                    <thead>
                                        <tr className="table-head-row">
                                            <th>status</th>
                                            <th>action</th>
                                            <th>employee</th>
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
                                            <th>file</th>
                                            <th>mode data</th>
                                            <th>service report</th>
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
                                            (sharedvalue.ticketsdata[item].ctktcustname==='other' &&sharedvalue.uid===sharedvalue.ticketsdata[item].createdbyid)))
                                            .filter(item=>sharedvalue.ticketsdata[item].status.includes(statusfilter))
                                            .filter(item=>(JSON.stringify(item).includes(searchworker)||sharedvalue.ticketsdata[item].ctktcustname.includes(searchworker))).map((ticket,idx)=>(
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
                                                    {/* ctktemployee */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                        {sharedvalue.ticketsdata[ticket].ctktemployee!==''?sharedvalue.workersdata[sharedvalue.ticketsdata[ticket].ctktemployee].name:'-'}
                                                        </p>
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
                                                    
                                                     {/* view file */}
                                                    <td>
                                                        <div className='view-manager-list-acttion-icon'>
                                                            {sharedvalue.ticketsdata[ticket].fileurl!==''? <a href={sharedvalue.ticketsdata[ticket].fileurl} rel="noreferrer" target="_blank">
                                                            <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} fontSize="small"/>
                                                            </a>:'-'}
                                                        </div>
                                                    </td>
                                                    {/* mode data */}
                                                    <td>
                                                        <div className='view-manager-list-acttion-icon'>
                                                            {
                                                                Object.prototype.hasOwnProperty.call(sharedvalue.ticketsdata[ticket],"ctktmodedata")?
                                                                (sharedvalue.ticketsdata[ticket].ctktmodedata!==''?
                                                                <a href={sharedvalue.ticketsdata[ticket].ctktmodedata} rel="noreferrer" target="_blank">
                                                                    <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} fontSize="small"/>
                                                                </a>
                                                                :'-'):'-'
                                                            }
                                                        </div>
                                                    </td>
                                                    {/* service report */}
                                                    <td>
                                                        <div className='view-manager-list-acttion-icon'>
                                                            {
                                                                Object.prototype.hasOwnProperty.call(sharedvalue.ticketsdata[ticket],"ctktservicereport")?
                                                                (sharedvalue.ticketsdata[ticket].ctktservicereport!==''?
                                                                <a href={sharedvalue.ticketsdata[ticket].ctktservicereport} rel="noreferrer" target="_blank">
                                                                    <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} fontSize="small"/>
                                                                </a>
                                                                :'-'):'-'
                                                            }
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
                    {/* your view ticket ends here */}
                </div>
            </div>
            {/* popup to delete an item */}
            {/* <div className={`view-manager-list-popup-delete ${workerdelete.active===true?'active-delete-popup':''}`}>
                <p>Are You Sure You want to delete the user <span>{workerdelete.uid?workerdelete.uid:''}</span></p>
                <div>
                    <button onClick={()=>deleteUserByUID(workerdelete.uid)}>Yes</button>
                    <button onClick={()=>setworkerdelete(prev=>({
                        ...prev,
                        active:false,
                        uid:''
                    }))}>No</button>
                </div>
            </div> */}
            {/* feed back pop to close the ticket */}
            <div  className={`view-ticket-list-popup-feedback ${feedbackform.active===true?'active-delete-popup-feedback':''}`} >
                <div className="viewticket-closeicon-comes-here">
                    <CloseIcon fontSize="small" onClick={()=>setfeedbackform(prev=>({
                        ...prev,
                        active:false
                    }))} sx={{cursor:'pointer'}}/>
                </div>
                <div className="viewticket-feedback-select">
                    <p>Technical Support</p>
                    <select value={feedbackform.techspt} onChange={(e)=>setfeedbackform(prev=>({
                        ...prev,
                        techspt:e.target.value
                    }))}>
                        <option value='Excellent'>Excellent</option>
                        <option value='Good'>Good</option>
                        <option value='Satisfied'>Satisfied</option>
                        <option value='Poor'>Poor</option>
                    </select>
                </div>
                <div className="viewticket-feedback-select">
                    <p>Response</p>
                    <select value={feedbackform.res} onChange={(e)=>setfeedbackform(prev=>({
                        ...prev,
                        res:e.target.value
                    }))}>
                        <option value='Excellent'>Excellent</option>
                        <option value='Good'>Good</option>
                        <option value='Satisfied'>Satisfied</option>
                        <option value='Poor'>Poor</option>
                    </select>
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

export default Viewticket;