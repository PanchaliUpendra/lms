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

function Viewticket(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
        //deleting user input
        const [workerdelete,setworkerdelete] = useState({
            active:false,
            uid:''
        });
        const deleteUserByUID = async () => {
            
            setworkerdelete({
                active:false,
                uid:''
            })
          };
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
            <div className={`manlead-con ${workerdelete.active===true?'manlead-con-inactive':''}`}>
                <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                <div className='manage-con-inner'>

                    {/* inner navbar container */}
                    <div className='top-bar'>
                        <div className='top-nav-tog'>
                            <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                        </div>
                        <div className='search-icon-top-nav'>
                            <SearchIcon />
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
                            <div className="view-list-of-all-search">
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
                                            sharedvalue.ticketskeys.length>0 &&
                                            sharedvalue.ticketskeys.filter(item=>(JSON.stringify(item).includes(searchworker)||sharedvalue.ticketsdata[item].ctktcustname.includes(searchworker))).map((ticket,idx)=>(
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
                                                            {sharedvalue.ticketsdata[ticket].ctktmanager}
                                                        </p>
                                                    </td>
                                                    {/* ctktemployee */}
                                                    <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.ticketsdata[ticket].ctktemployee}
                                                        </p>
                                                    </td>
                                                     {/* status */}
                                                     <td onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}>
                                                        <p className="view-manager-list-role">
                                                            {sharedvalue.ticketsdata[ticket].status===true?'Active':'Close'}
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
                                                            <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} fontSize="small" onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}/>
                                                            <DeleteOutlineRoundedIcon sx={{color:'red',cursor:'pointer'}} fontSize="small"
                                                            onClick={()=>setworkerdelete(prev=>({
                                                                ...prev,
                                                                active:true,
                                                                uid:ticket
                                                            }))}
                                                            />
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
                    {/* your view ticket ends here */}
                </div>
            </div>
            {/* popup to delete an item */}
            <div className={`view-manager-list-popup-delete ${workerdelete.active===true?'active-delete-popup':''}`}>
                <p>Are You Sure You want to delete the user <span>{workerdelete.uid?workerdelete.uid:''}</span></p>
                <div>
                    <button onClick={()=>deleteUserByUID(workerdelete.uid)}>Yes</button>
                    <button onClick={()=>setworkerdelete(prev=>({
                        ...prev,
                        active:false,
                        uid:''
                    }))}>No</button>
                </div>
            </div>
        </>
    );
}

export default Viewticket;