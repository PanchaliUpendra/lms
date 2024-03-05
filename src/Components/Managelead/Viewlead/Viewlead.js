import React, {useContext, useState } from "react";
import './Viewlead.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
//imported material ui 
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";

function Viewlead(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    // console.log('leads all data: ',sharedvalue.leadsdata);
     //deleting lead
     
    // search bar input 
    const [searchworker,setsearchworker]=useState('');
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    return(
        <>
            <div className={`manlead-con`}>
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
                    {/* your view leads  starts from here */}
                    <div className='create-lead-con'>
                        <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>All Leads</h1>
                            </div>
                        </div>
                        {/* list starts from here */}
                        <div className="view-manager-list-con">
                            <div className="view-list-of-all-search">
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Name/RegID" onChange={(e)=>setsearchworker(e.target.value)}/>
                                </div>
                            </div>
                            {/* search bar complet6ed here */}
                            <div className="view-list-table-con">
                                <table>
                                    <thead>
                                        <tr className="table-head-row">
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
                                            .filter(item=>(JSON.stringify(item).includes(searchworker)||sharedvalue.leadsdata[item].contperson.includes(searchworker))).map((lead,idx)=>(
                                                <tr key={idx} className="each-table-row-view" >
                                                    {/* action */}
                                                    <td >
                                                        <div className='view-manager-list-acttion-icon'>
                                                            {(sharedvalue.leadsdata[lead].custstatus==='Lost' || sharedvalue.leadsdata[lead].custstatus==='Closed' )===false && <EditIcon fontSize="small" sx={{color:'green',cursor:'pointer'}} onClick={()=>navigate(`/managelead/updatelead/${lead}`)}/>}
                                                            <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} onClick={()=>navigate(`/managelead/viewlead/${lead}`)} fontSize="small"/>
                                                        </div>
                                                    </td>
                                                    {/* company name */}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        {/* <p className="view-manager-list-name"> */}
                                                            {/* {sharedvalue.leadsdata[lead].custcompanyname} */}
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].custcompanyname} |
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
                                                        <p className="view-manager-list-email">
                                                            {sharedvalue.leadsdata[lead].machinetype} - {sharedvalue.leadsdata[lead].chutes}
                                                        </p>
                                                    </td>
                                                    {/* no.of chutes */}
                                                    {/* <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].chutes}
                                                        </p>
                                                    </td> */}
                                                    
                                                    {/* next meeting date*/}
                                                    <td onClick={()=>navigate(`/managelead/viewlead/${lead}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.leadsdata[lead].custnextdate}
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
                    {/* your view lead ends here */}
                </div>
            </div>
            
        </>
    );
}

export default Viewlead;