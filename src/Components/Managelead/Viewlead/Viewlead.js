import React, {useContext, useEffect, useState } from "react";
import './Viewlead.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
//imported material ui 
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate ,useLocation} from "react-router-dom";
import { counrtycode } from "../../../Data/countrycode";
import { states } from "../../../Data/states";

import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';

import ExcelDocDownload from "../../DownloadDocs/ExcelDocDownload";

function Viewlead(){
    const location  = useLocation();
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    const [topleads,settopleads] = useState(30);
    const queryParams = new URLSearchParams(location.search);
    // console.log('leads all data: ',sharedvalue.leadsdata);
     //deleting lead
     
    // search bar input 
    const [searchworker,setsearchworker]=useState('');
    //filter data
    const [filterdataset,setfilterdataset] = useState({
        status:queryParams.get('status')||'Active',
        manager:queryParams.get('manager')||'',
        employee:queryParams.get('employee')||'',
        country:queryParams.get('country')||'India',
        state:queryParams.get('state')||'',
        district:queryParams.get('district')||'',
        machine:queryParams.get('machine')||''
    });
    const [tempfilterdataset,settempfilterdataset] = useState({
       status:queryParams.get('status')||'Active',
        manager:queryParams.get('manager')||'',
        employee:queryParams.get('employee')||'',
        country:queryParams.get('country')||'India',
        state:queryParams.get('state')||'',
        district:queryParams.get('district')||'',
        machine:queryParams.get('machine')||''
    });
    //crossbtn function
    const [crossbtn,setcrossbtn] = useState(false);
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here


    //const bupdate url
    const updateURL =()=>{
        setcrossbtn(false);
        const params = new URLSearchParams();
        if(tempfilterdataset.status) params.append('status',tempfilterdataset.status);
        if(tempfilterdataset.manager) params.append('manager',tempfilterdataset.manager);
        if(tempfilterdataset.employee) params.append('employee',tempfilterdataset.employee);
        if(tempfilterdataset.country) params.append('country',tempfilterdataset.country);
        if(tempfilterdataset.state) params.append('state',tempfilterdataset.state);
        if(tempfilterdataset.district) params.append('district',tempfilterdataset.district);
        if(tempfilterdataset.machine) params.append('machine',tempfilterdataset.machine);
        navigate(`/managelead/viewlead?${params.toString()}`)
    }

    //function to download the excel sheet
    const downloadExcel =(e)=>{
        e.preventDefault();
        if(sharedvalue.leadskeys.length>0 && sharedvalue.workerskeys.length>0){
            const exceldata = sharedvalue.leadskeys
            .filter(item =>((sharedvalue.role==='employee' && sharedvalue.leadsdata[item].employeeid===sharedvalue.uid)||(sharedvalue.role==='admin')||(sharedvalue.role==='manager' && sharedvalue.leadsdata[item].managerid===sharedvalue.uid) || sharedvalue.uid===sharedvalue.leadsdata[item].createdbyid))
            .filter(item=>(JSON.stringify(item).includes(searchworker)||sharedvalue.leadsdata[item].contperson.includes(searchworker)))
            .sort((a, b) => {
                const dateA = new Date(sharedvalue.leadsdata[a].custnextdate);
                const dateB = new Date(sharedvalue.leadsdata[b].custnextdate);
                return dateA - dateB;
            })
            .filter(item=>(sharedvalue.leadsdata[item].custstatus.includes(filterdataset.status)))
            .filter(item=>(sharedvalue.leadsdata[item].ofdcountry.includes(filterdataset.country)))
            .filter(item=>(sharedvalue.leadsdata[item].ofdst.includes(filterdataset.state)))
            .filter(item=>(sharedvalue.leadsdata[item].ofddst.includes(filterdataset.district)))
            .filter(item=>(sharedvalue.leadsdata[item].machinereq.includes(filterdataset.machine)))
            .filter(item=>(filterdataset.manager!=='none'?sharedvalue.leadsdata[item].managerid.includes(filterdataset.manager):sharedvalue.leadsdata[item].managerid===''))
            .filter(item=>(sharedvalue.leadsdata[item].employeeid.includes(filterdataset.employee)))
            .map((lead)=>({
                status:sharedvalue.leadsdata[lead].custstatus,
                company:sharedvalue.leadsdata[lead].custcompanyname,
                contactPerson:sharedvalue.leadsdata[lead].contperson,
                phoneNumber:sharedvalue.leadsdata[lead].contcountrycode+"-"+ sharedvalue.leadsdata[lead].contmobilenum,
                country:sharedvalue.leadsdata[lead].ofdcountry,
                state:sharedvalue.leadsdata[lead].ofdst,
                district:sharedvalue.leadsdata[lead].ofddst,
                machineRequire:sharedvalue.leadsdata[lead].machinereq,
                machineType:sharedvalue.leadsdata[lead].machinetype,
                numberOfChutes:sharedvalue.leadsdata[lead].chutes,
                nextMeetingDate:sharedvalue.leadsdata[lead].custnextdate,
                manager:sharedvalue.leadsdata[lead].managerid!==''?sharedvalue.workersdata[sharedvalue.leadsdata[lead].managerid].name:'-',
                employee:sharedvalue.leadsdata[lead].employeeid!==''?sharedvalue.workersdata[sharedvalue.leadsdata[lead].employeeid].name:'-',
                createdBy:sharedvalue.leadsdata[lead].createdbyid!==''?sharedvalue.workersdata[sharedvalue.leadsdata[lead].createdbyid].name:'-',
                regId:lead,
            }))

            // console.log('here is the data: ',exceldata);
            ExcelDocDownload(exceldata,`${sharedvalue.workersdata[sharedvalue.uid].name} Leads`);
        }
    }
    //Update filters when URL parameters change
    useEffect(()=>{
        const queryParams = new URLSearchParams(location.search);
        const newFilters={
            status:queryParams.get('status')||'Active',
            manager:queryParams.get('manager')||'',
            employee:queryParams.get('employee')||'',
            country:queryParams.get('country')||'India',
            state:queryParams.get('state')||'',
            district:queryParams.get('district')||'',
            machine:queryParams.get('machine')||''
        };
        setfilterdataset(newFilters);
        settempfilterdataset(newFilters);
    },[location.search])
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
                            <div className="viewlead-display-search-filter">
                                <div onClick={()=>setcrossbtn(true)}>
                                    <FilterListIcon sx={{fontWeight:"500",cursor:'pointer'}}/>
                                    <label style={{fontWeight:"500",cursor:'pointer',color:'black'}}>Filter</label>
                                </div>
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Name/RegID" onChange={(e)=>setsearchworker(e.target.value)}/>
                                </div>
                            </div>
                            {/* download data only for admin */}
                            {sharedvalue.role==='admin' && 
                            <div className="view-lead-DownloadExcelBtn">
                                <button onClick={(e)=>downloadExcel(e)}>download data</button>
                            </div>}
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
                                                <p>machine require |</p>
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
                                            .filter(item=>(JSON.stringify(item).includes(searchworker)||sharedvalue.leadsdata[item].contperson.includes(searchworker)))
                                            .slice(0,topleads)
                                            .sort((a, b) => {
                                                const dateA = new Date(sharedvalue.leadsdata[a].custnextdate);
                                                const dateB = new Date(sharedvalue.leadsdata[b].custnextdate);
                                                return dateA - dateB;
                                            })
                                            .filter(item=>(sharedvalue.leadsdata[item].custstatus.includes(filterdataset.status)))
                                            .filter(item=>(sharedvalue.leadsdata[item].ofdcountry.includes(filterdataset.country)))
                                            .filter(item=>(sharedvalue.leadsdata[item].ofdst.includes(filterdataset.state)))
                                            .filter(item=>(sharedvalue.leadsdata[item].ofddst.includes(filterdataset.district)))
                                            .filter(item=>(sharedvalue.leadsdata[item].machinereq.includes(filterdataset.machine)))
                                            .filter(item=>(filterdataset.manager!=='none'?sharedvalue.leadsdata[item].managerid.includes(filterdataset.manager):sharedvalue.leadsdata[item].managerid===''))
                                            .filter(item=>(sharedvalue.leadsdata[item].employeeid.includes(filterdataset.employee)))
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
                                                        <p className="view-manager-list-name">{sharedvalue.leadsdata[lead].machinereq} |</p>
                                                        <p className="view-manager-list-name">
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
                            <div className="veiw-leads-top-display-btn">
                                <p>top {topleads} leads</p>
                                <button onClick={()=>settopleads(prev=>prev+30)}>+</button>
                            </div>
                        </div>
                    </div>
                    
                    {/* your view lead ends here */}
                </div>
            </div>
            <div className={crossbtn?"viewlead-filter-menubar":"viewlead-filter-menubar-inactive"}>
                <div className="viewlead-filter-manubar-cross-btn">
                    <CancelIcon sx={{cursor:'pointer'}} onClick={()=>setcrossbtn(false)}/>
                </div>
                <div className="viewlead-filter-menu-nav">
                    <div className="viewlead-filter-header">
                        <h1>Filter By</h1>
                    </div>
                    {/* status */}
                    <div className="viewlead-filter-status-box">
                        <h2>Status</h2>
                        <select value={tempfilterdataset.status} onChange={(e)=>settempfilterdataset(prev=>({
                            ...prev,
                            status:e.target.value
                        }))}>
                            <option value='Active'>Active</option>
                            <option value='Closed'>Closed</option>
                            <option value='Lost'>Lost</option>
                            <option value='Cold'>Cold</option>
                            <option value=''>All</option>
                        </select>
                    </div>
                    {/* machine require */}
                    <div className="viewlead-filter-status-box">
                        <h2>machine require</h2>
                        <select value={tempfilterdataset.machine} onChange={(e)=>settempfilterdataset(prev=>({
                            ...prev,
                            machine:e.target.value
                        }))}>
                                        <option value=''>All</option>
                                        <option value='Sorter'>Sorter</option>
                                        <option value='Packing Machine'>Packing Machine</option>
                                        <option value='Classifer'>Classifer</option>
                                        <option value='Destoner'>Destoner</option>
                                        <option value='Cyclone'>Cyclone</option>
                                        <option value='Airlock'>Airlock</option>
                                        <option value='Elevator'>Elevator</option>
                                        <option value='Rubber Rolls'>Rubber Rolls</option>
                                        <option value='Emery stoner'>Emery stoner</option>
                                        <option value='Air Compressor'>Air Compressor</option>
                                        <option value='UPS'>UPS</option>
                                        <option value='Complete Projects'>Complete Projects</option>
                                        <option value='Grain Dryers'>Grain Dryers</option>
                                        <option value='Silos'>Silos</option>
                                        <option value='Rice Plant'>Rice Plant</option>
                                        <option value='Dall Plant'>Dall Plant</option>
                                        <option value='Seeding Machines'>Seeding Machines</option>
                        </select>
                    </div>
                    {/* manager */}
                    {sharedvalue.role==='admin' && 
                        <div className="viewlead-filter-status-box">
                            <h2>Manager</h2>
                                    
                            <select value={tempfilterdataset.manager} onChange={(e)=>settempfilterdataset(prev=>({
                                ...prev,
                                employee:'',
                                manager:e.target.value
                            }))}>
                                <option value=''>All</option>
                                {
                                    sharedvalue.workerskeys.filter((item)=>sharedvalue.workersdata[item].role==='manager').map((manager,idx)=>(
                                    <option value={manager} key={idx}>{sharedvalue.workersdata[manager].name}</option>
                                    ))
                                }
                                <option value='none'>None</option>
                            </select>
                                    
                        </div>
                    }
                    {/* employee */}
                    {(sharedvalue.role==='admin' || sharedvalue.role==='manager' ) &&
                    <div className="viewlead-filter-status-box">
                        <h2>Employee</h2>
                            <select value={tempfilterdataset.employee} onChange={(e)=>settempfilterdataset(prev=>({
                                ...prev,
                                employee:e.target.value
                            }))}>
                                <option value=''>All</option>
                                {
                                sharedvalue.workerskeys.filter((item)=>sharedvalue.workersdata[item].role==='employee' && (sharedvalue.workersdata[item].managerid===tempfilterdataset.manager||
                                (sharedvalue.role==='manager' && sharedvalue.workersdata[item].managerid===sharedvalue.uid))).map((employee,idx)=>(
                                <option value={employee} key={idx}>{sharedvalue.workersdata[employee].name}</option>
                                ))
                                }
                            </select>
                        </div>
                    }
                    {/* country */}
                    <div className="viewlead-filter-status-box">
                        <h2>country</h2>
                        <select value={tempfilterdataset.country} onChange={(e)=>settempfilterdataset(prev=>({
                            ...prev,
                            country:e.target.value,
                            state:'',
                            district:''
                        }))}>
                            <option value=''>All</option>
                            {
                                counrtycode.map((item,idx)=>(
                                    <option key={idx} value={item.name}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    {/* state */}
                    
                        {
                            tempfilterdataset.country==='India' &&
                        <div className="viewlead-filter-status-box">
                            <h2>state</h2>
                            <select value={tempfilterdataset.state} onChange={(e)=>settempfilterdataset(prev=>({
                                ...prev,
                                state:e.target.value,
                                district:''
                            }))} required>
                                <option value=''>All</option>
                                    {states.map((item,idx)=>(
                                    <option key={idx} value={item.state}>{item.state}</option>
                                    ))}
                            </select>
                        </div>
                        }
                        {
                            tempfilterdataset.country!=='India' &&
                        <div className="viewlead-filter-status-box">
                            <h2>state</h2>
                            <input type="text" value={tempfilterdataset.state} onChange={(e)=>settempfilterdataset(prev=>({
                                ...prev,
                                state:e.target.value
                            }))} placeholder="enter the your state.."/>
                               
                        </div>
                        }

                        {
                            tempfilterdataset.country==='India' && tempfilterdataset.state!=='' &&
                            <div className="viewlead-filter-status-box">
                                <h2>district</h2>
                                <select value={tempfilterdataset.district} onChange={(e)=>settempfilterdataset(prev=>({
                                    ...prev,
                                    district:e.target.value
                                }))}>
                                    <option value=''>All</option>
                                    {states.filter(item=>item.state===tempfilterdataset.state)[0].districts.map((prod,idx)=>(
                                        <option key={idx} value={prod}>{prod}</option>
                                    ))}
                                </select>
                            </div>
                        }
                        
                    
                </div>
                {/* remove filter */}
                <div className="viewlead-filter-bottom-btn">
                    <button onClick={()=>updateURL()}>Apply All Filters</button>
                </div>
            </div>
            
        </>
    );
}

export default Viewlead;