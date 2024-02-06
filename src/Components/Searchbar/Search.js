import React, {useContext, useState } from "react";
import './Search.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../Sidenav/Sidenav";
import MyContext from "../../MyContext";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
function Search(){
    const sharedvalue = useContext(MyContext);
    const [searchltq,setsearchltq] = useState('');
    const navigate = useNavigate();
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
                            <SearchIcon />
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your search bar s starts from here */}
                    <div className='create-lead-con'>
                        <div className='create-lead-head'>
                            <h1>Search Lead / Ticket / Quotation</h1>
                        </div>
                        <div className="search-bar-input-con">
                            <input type='text' placeholder="Search Text" value={searchltq} onChange={(e)=>setsearchltq(e.target.value)}/>
                        </div>
                        <div className="search-bar-input-con">
                            <button>
                                Search
                            </button>
                        </div>
                        
                    </div>
                    {/* leads results starts here */}
                    { sharedvalue.leadskeys.length>0 && sharedvalue.leadskeys.filter(item=>(JSON.stringify(item).includes(searchltq)||sharedvalue.leadsdata[item].contperson.includes(searchltq))).length>0 &&  
                    <div className='create-lead-con'>
                        <div className="search-bar-each-lead-view">
                            <h1 className="search-bar-each-lead-view-head">Lead Results</h1>
                        {
                            sharedvalue.leadskeys.length>0 && sharedvalue.workerskeys.length>0 &&
                            sharedvalue.leadskeys.filter(item=>(JSON.stringify(item).includes(searchltq)||sharedvalue.leadsdata[item].contperson.includes(searchltq)))
                            .map((lead,idx)=>(
                                <div key={idx} className="searchbar-each-div">
                                    <div className="searchbar-each-div-inner">
                                        <h1>{sharedvalue.leadsdata[lead].contperson}</h1>
                                        <p>company: <span>{sharedvalue.leadsdata[lead].custcompanyname}</span></p>
                                        <p>Number: <span>{sharedvalue.leadsdata[lead].contmobilenum}</span></p>
                                        <p>Assigned Employee: <span>{sharedvalue.leadsdata[lead].employeeid!==''?sharedvalue.workersdata[sharedvalue.leadsdata[lead].employeeid].name:'-'}</span></p>
                                    </div>
                                    <div className="searchbar-each-div-inner-second">
                                        <EditIcon fontSize="small" sx={{color:'#344767',cursor:'pointer'}} onClick={()=>navigate(`/managelead/viewlead/${lead}`)} />
                                        <p onClick={()=>navigate(`/managelead/viewlead/${lead}`)} > View Lead</p>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    }
                    {/* leads data ends here */}

                    {/* tickets results starts here */}
                    { sharedvalue.ticketskeys.length>0 && sharedvalue.ticketskeys
                            .filter(item=>(JSON.stringify(item).includes(searchltq)||sharedvalue.ticketsdata[item].ctktcustname.includes(searchltq))).length>0 &&
                     
                    <div className='create-lead-con'>
                        <div className="search-bar-each-lead-view">
                            <h1 className="search-bar-each-lead-view-head">Ticket Results</h1>
                        {
                            sharedvalue.ticketskeys.length>0 && sharedvalue.workerskeys.length>0 &&
                            sharedvalue.ticketskeys
                            .filter(item=>(JSON.stringify(item).includes(searchltq)||sharedvalue.ticketsdata[item].ctktcustname.includes(searchltq))).map((ticket,idx)=>(
                                <div key={idx} className="searchbar-each-div">
                                    <div className="searchbar-each-div-inner">
                                        <h1>{sharedvalue.ticketsdata[ticket].ctktcustname}</h1>
                                        <p>Lead Code: <span>{sharedvalue.ticketsdata[ticket].ctktasslc}</span></p>
                                        
                                        <p>Assigned Employee: <span>{sharedvalue.ticketsdata[ticket].ctktemployee!==''?sharedvalue.workersdata[sharedvalue.ticketsdata[ticket].ctktemployee].name:'-'}</span></p>
                                    </div>
                                    <div className="searchbar-each-div-inner-second">
                                        <EditIcon fontSize="small" sx={{color:'#344767',cursor:'pointer'}} onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)}/>
                                        <p onClick={()=>navigate(`/manageticket/viewticket/${ticket}`)} > View Ticket</p>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    }
                    {/* tickets data ends here */}

                    {/* quotation data starts here */}
                    { sharedvalue.quoteskeys.length>0 &&  sharedvalue.quoteskeys
                            .filter((item)=>JSON.stringify(item).includes(searchltq)||sharedvalue.quotesdata[item].quotcustname.includes(searchltq)).length>0 && 
                    <div className='create-lead-con'>
                        <div className="search-bar-each-lead-view">
                            <h1 className="search-bar-each-lead-view-head">Quotation Results</h1>
                        {
                            sharedvalue.quoteskeys.length>0 && sharedvalue.workerskeys.length>0 &&
                            sharedvalue.quoteskeys
                            .filter((item)=>JSON.stringify(item).includes(searchltq)||sharedvalue.quotesdata[item].quotcustname.includes(searchltq)).map((quote,idx)=>(
                                <div key={idx} className="searchbar-each-div">
                                    <div className="searchbar-each-div-inner">
                                        <h1>{sharedvalue.quotesdata[quote].quotcustname}</h1>
                                        <p>Quotation Code: <span>{quote}</span></p>
                                        
                                        <p>Assigned Employee: <span>-</span></p>
                                    </div>
                                    <div className="searchbar-each-div-inner-second">
                                        <EditIcon fontSize="small" sx={{color:'#344767',cursor:'pointer'}} onClick={()=>navigate(`/managequotation/verifyquotation/${quote}`)}/>
                                        <p onClick={()=>navigate(`/managequotation/verifyquotation/${quote}`)}>Edit</p>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    }
                    {/* quotation data ends here */}
                    {(sharedvalue.quoteskeys
                            .filter((item)=>JSON.stringify(item).includes(searchltq)||sharedvalue.quotesdata[item].quotcustname.includes(searchltq)).length===0) &&
                    ( sharedvalue.ticketskeys
                        .filter(item=>(JSON.stringify(item).includes(searchltq)||sharedvalue.ticketsdata[item].ctktcustname.includes(searchltq))).length===0) &&
                    (sharedvalue.leadskeys.filter(item=>(JSON.stringify(item).includes(searchltq)||sharedvalue.leadsdata[item].contperson.includes(searchltq))).length===0) &&
                    <div className="search-no-results">
                        <p>No Results</p>
                    </div>
                    }
                    {/* your search bar ends here */}
                </div>
            </div>
        </>
    );
}

export default Search;