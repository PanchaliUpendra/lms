import React, {useContext, useState } from "react";
import './Dashboard.css';
import Sidenav from "../Sidenav/Sidenav";
import SearchIcon from '@mui/icons-material/Search';
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

function Dashboard(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    const [countleads,setcountleads] = useState(5);
    const [counttickets,setcounttickets] = useState(5);
    //code only for toggle the menu bar
    // const [searchworker,setsearchworker]=useState('');
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    
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
                                <p>{sharedvalue.leadskeys.length}</p>
                            </div>
                        </div>
                        {/* div five */}
                        <div>
                            <div className="dashboard-each-profile-div">
                                <ReceiptIcon sx={{color:'white'}}/>
                            </div>
                            <div className="dashboard-each-profile-content-div">
                                <p>total tickets</p>
                                <p>{sharedvalue.ticketskeys.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="leads-graph-con-outer">
                        <div className="leads-graph-con">
                            leads graph
                        </div>
                        <Leadsgraph/>
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
                                            <th>REG.ID</th>
                                            <th>customer</th>
                                            <th>country</th>
                                            <th>state</th>
                                            <th>district</th>
                                            <th>machine model</th>
                                            <th>number of chutes</th>
                                            <th>created by</th>
                                            <th>next meeting date</th>
                                            <th>latest title</th>
                                            <th>latest sub-title</th>
                                            <th>latest comment</th>
                                            <th>manager</th>
                                            <th>employee</th>
                                            <th>action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sharedvalue.leadskeys.length>0 && sharedvalue.workerskeys.length>0 &&
                                            sharedvalue.leadskeys.slice(0,countleads)
                                            .filter(item =>((sharedvalue.role==='employee' && sharedvalue.leadsdata[item].employeeid===sharedvalue.uid)||(sharedvalue.role==='admin')||(sharedvalue.role==='manager' && sharedvalue.leadsdata[item].managerid===sharedvalue.uid)))
                                            .map((lead,idx)=>(
                                                <tr key={idx} className="each-table-row-view" >
                                                    {/* REGID */}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {lead}
                                                        </p>
                                                    </td>
                                                    {/* customer */}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].contperson}
                                                        </p>
                                                    </td>
                                                    {/* country */}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">{sharedvalue.leadsdata[lead].ofdcountry}</p>
                                                    </td>
                                                    {/* state */}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        {/* <p className="view-manager-list-email">
                                                            {sharedvalue.workersdata[worker].email}
                                                        </p> */}
                                                        
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].ofdst}
                                                        </p>
                                                    </td>
                                                    {/* district */}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].ofddst}
                                                        </p>
                                                    </td>
                                                    {/* machine model */}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-email">
                                                            {sharedvalue.leadsdata[lead].machinereq}
                                                        </p>
                                                    </td>
                                                    {/* no.of chutes */}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].chutes}
                                                        </p>
                                                    </td>
                                                    {/* created by*/}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].createdbyid!==''?sharedvalue.workersdata[sharedvalue.leadsdata[lead].createdbyid].name:'-'}
                                                        </p>
                                                    </td>
                                                    {/* next meeting date*/}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].custnextdate}
                                                        </p>
                                                    </td>
                                                    {/* latest title*/}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].latesttitle[0]}
                                                        </p>
                                                    </td>
                                                    {/* latest sub-title*/}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].latestsubtitle[0]}
                                                        </p>
                                                    </td>
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
                                                    {/* action */}
                                                    <td >
                                                        <div className='view-manager-list-acttion-icon'>
                                                            <EditIcon fontSize="small" sx={{color:'green',cursor:'pointer'}} onClick={()=>navigate(`/managelead/updatelead/${lead}`)}/>
                                                            <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} onClick={()=>navigate(`/managelead/viewlead/${lead}`)} fontSize="small"/>
                                                            <DeleteOutlineRoundedIcon sx={{color:'red',cursor:'pointer'}}
                                                            fontSize="small"
                                                            />
                                                        </div>
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
                    {/* graphs starts here */}
                    <div className="leads-graph-con-outer">
                        <div className="leads-graph-con">
                            tickets graph
                        </div>
                        <Ticketsgraph/>
                    </div>
                    

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
                                <table>
                                    <thead>
                                        <tr className="table-head-row">
                                            <th>Tkt.ID</th>
                                            <th>country</th>
                                            <th>state</th>
                                            <th>district</th>
                                            <th>customer</th>
                                            <th>call type</th>
                                            <th>category</th>
                                            <th>priority</th>
                                            <th>file</th>
                                            <th>manager</th>
                                            <th>employee</th>
                                            <th>status</th>
                                            <th>working status</th>
                                            <th>action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sharedvalue.ticketskeys.length>0 && sharedvalue.workerskeys.length>0 &&
                                            sharedvalue.ticketskeys.slice(0,counttickets)
                                            .filter(item=>(sharedvalue.role==='admin' ||(sharedvalue.role==='employee' && sharedvalue.ticketsdata[item].ctktemployee===sharedvalue.uid)||(sharedvalue.role==='manager' && sharedvalue.ticketsdata[item].ctktmanager===sharedvalue.uid)))
                                            .map((ticket,idx)=>(
                                                <tr key={idx}>
                                                    {/* Tkt ID */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {ticket}
                                                        </p>
                                                    </td>
                                                    {/* country */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktcountry}
                                                        </p>
                                                    </td>
                                                    {/* state */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktstate}
                                                        </p>
                                                    </td>
                                                    {/* district */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktdist}
                                                        </p>
                                                    </td>
                                                    {/* customer */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktcustname}
                                                        </p>
                                                    </td>
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
                                                    {/* view file */}
                                                    <td>
                                                        <div className='view-manager-list-acttion-icon'>
                                                            <a href={sharedvalue.ticketsdata[ticket].fileurl} rel="noreferrer" target="_blank">
                                                            <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} fontSize="small"/>
                                                            </a>
                                                        </div>
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
                                                     {/* status */}
                                                     <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className={`${(sharedvalue.ticketsdata[ticket].status===true || sharedvalue.ticketsdata[ticket].status==="true")?'active-ticket-view-condition':'inactive-ticket-view-condition'}`}>
                                                            {(sharedvalue.ticketsdata[ticket].status===true || sharedvalue.ticketsdata[ticket].status==="true")?'Active':'Close'}
                                                        </p>
                                                    </td>
                                                     {/* working status */}
                                                     <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].workingstatus}
                                                        </p>
                                                    </td>
                                                     {/* action */}
                                                     <td>
                                                        <div className='view-manager-list-acttion-icon'>
                                                            <EditIcon sx={{color:'green',cursor:'pointer'}} fontSize="small" onClick={()=>navigate(`/manageticket/updateticket/${ticket}`)}/>
                                                            <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} fontSize="small" onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}/>
                                                            <DeleteOutlineRoundedIcon sx={{color:'red',cursor:'pointer'}} fontSize="small"/>
                                                        </div>
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
                    {/* last 6 months graph  ends here*/}

                    {/* last div part */}
                    <div className="dashboard-last-div">

                    </div>
                    
                </div>
            </div>
            
        </>
    );
}

export default Dashboard;