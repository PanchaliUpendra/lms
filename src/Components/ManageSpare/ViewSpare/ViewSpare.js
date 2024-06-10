import React, {useContext, useState } from "react";
import './ViewSpare.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
function ViewSpare(){
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
                                <h1>View Sapre Quotation</h1>
                            </div>
                        </div>
                        {/* list starts from here */}
                        <div className="view-manager-list-con">
                            <div className="view-list-of-all-search">
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Company/SapreID" onChange={(e)=>setsearchworker(e.target.value)}/>
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
                                            <p>machine</p>
                                            </th>
                                            <th>quotation type</th>
                                            <th>admin comment</th>
                                            <th>Spare.ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sharedvalue.spareskeys.length>0 &&
                                            sharedvalue.spareskeys
                                            .filter((item)=>(sharedvalue.sparesdata[item].sparecreatedby===sharedvalue.uid || sharedvalue.role==='admin'))
                                            .filter((item)=>JSON.stringify(item).includes(searchworker)||sharedvalue.sparesdata[item].companyname.toLowerCase().includes(searchworker.toLowerCase())||sharedvalue.sparesdata[item].othercompanyname.toLowerCase().includes(searchworker.toLowerCase()))
                                            .map((spare,idx)=>(
                                                <tr key={idx}>
                                                    {/* status */}
                                                    <td>
                                                        <p className={`view-manager-list-name 
                                                            ${sharedvalue.sparesdata[spare].sparestatus==='open'?'vmln-opended':sharedvalue.sparesdata[spare].sparestatus==='rework'?'vmln-reworked':sharedvalue.sparesdata[spare].sparestatus==='approved'?'vmln-approved':'vmln-closed'}`}
                                                        >
                                                            {sharedvalue.sparesdata[spare].sparestatus}
                                                        </p>
                                                    </td>
                                                    {/* action */}
                                                    <td>
                                                        <p className='view-manager-list-acttion-icon'>
                                                        { (sharedvalue.sparesdata[spare].sparestatus==='open' || sharedvalue.sparesdata[spare].sparestatus==='rework') && sharedvalue.uid===sharedvalue.sparesdata[spare].sparecreatedby && <EditIcon fontSize="small" sx={{color:'green',cursor:'pointer'}} onClick={()=>navigate(`/manageamc/updatespare/${spare}`)} />}
                                                        {sharedvalue.sparesdata[spare].sparestatus!=='closed' && sharedvalue.role==='admin' && <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}}  fontSize="small" onClick={()=>navigate(`/managespare/verifyspare/${spare}`)}/>}
                                                        </p>
                                                    </td>
                                                    {/* company name */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.sparesdata[spare].companyname!==''?sharedvalue.sparesdata[spare].companyname:sharedvalue.sparesdata[spare].othercompanyname}
                                                        </p>
                                                    </td>
                                                    {/* machine  */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.sparesdata[spare].sparereqmachine}
                                                        </p>
                                                    </td>
                                                    {/* quotation type  */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.sparesdata[spare].sparequottype}
                                                        </p>
                                                    </td>
                                                    {/*  admin comment */}
                                                    <td>
                                                        <p className={`view-manager-list-name`}>
                                                            {sharedvalue.sparesdata[spare].spareadmincommt}
                                                        </p>
                                                    </td>
                                                    {/*  spare id */}
                                                    <td>
                                                        <p className={`view-manager-list-name`}>
                                                            {spare}
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

export default ViewSpare;