import React, {useContext, useState } from "react";
import './Viewlead.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
//imported material ui 
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";

function Viewlead(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    // console.log('leads all data: ',sharedvalue.leadsdata);
     //deleting lead
     const [workerdelete,setworkerdelete] = useState({
        active:false,
        uid:''
    });
    const deleteUserByUID = async (uidToDelete) => {
        
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
                                            sharedvalue.leadskeys
                                            .filter(item =>((sharedvalue.role==='employee' && sharedvalue.leadsdata[item].employeeid===sharedvalue.uid)||(sharedvalue.role==='admin')||(sharedvalue.role==='manager' && sharedvalue.leadsdata[item].managerid===sharedvalue.uid)))
                                            .filter(item=>(JSON.stringify(item).includes(searchworker)||sharedvalue.leadsdata[item].contperson.includes(searchworker))).map((lead,idx)=>(
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
                                                            onClick={()=>setworkerdelete(prev=>({
                                                                ...prev,
                                                                active:true,
                                                                uid:lead
                                                            }))} 
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
                    {/* your view lead ends here */}
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

export default Viewlead;