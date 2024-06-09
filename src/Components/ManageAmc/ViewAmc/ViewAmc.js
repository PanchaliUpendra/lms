import React, {useContext, useState } from "react";
import './ViewAmc.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import { useNavigate } from "react-router-dom";
// import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
function ViewAmc(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();

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
            <div className={`manlead-con`} >
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
                    {/* your createmanager starts from here */}
                    <div className='create-lead-con'>
                        <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>View AMC Quotation</h1>
                            </div>
                        </div>
                        {/* list starts from here */}
                        <div className="view-manager-list-con">
                            <div className="view-list-of-all-search">
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Company/AMC-id" onChange={(e)=>setsearchworker(e.target.value)}/>
                                </div>
                            </div>
                            {/* search ends here */}
                            {/* table starts from here */}
                            <div className="view-list-table-con">
                                <table>
                                    <thead>
                                        <tr className="table-head-row">
                                            <th>status</th>
                                            <th>action</th>
                                            <th>Company</th>
                                            <th>
                                                <p>country |</p>
                                                <p>state |</p>
                                                <p>district</p>
                                            </th>
                                            <th>
                                            <p>machine</p>
                                            </th>
                                            <th>quotation type</th>
                                            <th>admin comment</th>
                                            <th>AMC.ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sharedvalue.amckeys.length>0 &&
                                            sharedvalue.amckeys
                                            .filter((item)=>(sharedvalue.amcdata[item].amccreatedby===sharedvalue.uid || sharedvalue.role==='admin'))
                                            .filter((item)=>JSON.stringify(item).includes(searchworker)||sharedvalue.amcdata[item].amccompanyname.toLowerCase().includes(searchworker.toLowerCase()))
                                            .map((amc,idx)=>(
                                                <tr key={idx}>
                                                    {/* status */}
                                                    <td>
                                                        <p className={`view-manager-list-name 
                                                            ${sharedvalue.amcdata[amc].amcstatus==='open'?'vmln-opended':sharedvalue.amcdata[amc].amcstatus==='rework'?'vmln-reworked':sharedvalue.amcdata[amc].amcstatus==='approved'?'vmln-approved':'vmln-closed'}`}
                                                        >
                                                            {sharedvalue.amcdata[amc].amcstatus}
                                                        </p>
                                                    </td>
                                                    {/* action */}
                                                    <td>
                                                        <p className='view-manager-list-acttion-icon'>
                                                        {/* { (sharedvalue.amcdata[amc].amcstatus==='open' || sharedvalue.amcdata[amc].amcstatus==='rework') && sharedvalue.uid===sharedvalue.amcdata[amc].amccreatedby && <EditIcon fontSize="small" sx={{color:'green',cursor:'pointer'}} onClick={()=>navigate(`/managequotation/updatequotation/${amc}`)} />} */}
                                                        {sharedvalue.amcdata[amc].amcstatus!=='closed' && sharedvalue.role==='admin' && <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}}  fontSize="small" onClick={()=>navigate(`/manageamc/verifyamc/${amc}`)}/>}
                                                        </p>
                                                    </td>
                                                    {/* company name */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.amcdata[amc].amccompanyname}
                                                        </p>
                                                    </td>
                                                    {/* address */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.amcdata[amc].amccountry} |
                                                        </p>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.amcdata[amc].amcstate} |
                                                        </p>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.amcdata[amc].amcdistrict}
                                                        </p>
                                                    </td>
                                                    {/* machine  */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.amcdata[amc].amcmachine}
                                                        </p>
                                                    </td>
                                                    {/* quotation type  */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.amcdata[amc].amcquottype}
                                                        </p>
                                                    </td>
                                                    {/*  admin comment */}
                                                    <td>
                                                        <p className={`view-manager-list-name`}>
                                                            {sharedvalue.amcdata[amc].amcadmincommt}
                                                        </p>
                                                    </td>
                                                    {/*  amc  id */}
                                                    <td>
                                                        <p className={`view-manager-list-name`}>
                                                            {amc}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ViewAmc;