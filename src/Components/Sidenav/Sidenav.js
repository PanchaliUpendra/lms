import React, { useContext, useState } from 'react';
import './Sidenav.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PersonIcon from '@mui/icons-material/Person';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import CloseIcon from '@mui/icons-material/Close';

import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import { NavLink ,useLocation, useNavigate} from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../../Firebase';
import MyContext from '../../MyContext';

//importing the gif
import comaasicon from '../../Assets/comaas.gif'

function Sidenav({menutoggle,handlemenutoggle}){

    const sharedvalue = useContext(MyContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [rotationStates, setRotationStates] = useState({});

    const handleImageClick = (divId) => {
        setRotationStates((prevStates) => ({
        ...prevStates,
        [divId]: !prevStates[divId],
        }));
    };

    //function for signout
    async function handlesignout(){
        try{
            await signOut(auth).then(() => {
                alert('successfully signed out');
              }).catch((error) => {
                console.error(error);
              });
              navigate('/');
              window.location.reload();
        }
        catch(e){
            console.log('you got an error when sign out',e);
        }
    }

    return(
        <>
            <div className={`sidenav-con ${menutoggle===true?'tactive':''}`}>
                <div className='snav-inner'>
                    <div className='snav-cross-syb'>
                        <CloseIcon onClick={()=>handlemenutoggle()}/>
                    </div>
                    <div className='snav-inner-head'>
                        {/* <h1>COMAAS Dashboard</h1> */}
                        <img src={comaasicon} alt='icon' className='snav-inner-head-icon'/>
                        {/* <h1>Dashboard</h1> */}
                        {/* <div>
                            <img src={comaasicon} alt='icon' className='snav-inner-head-icon'/>
                            <h1>Dashboard</h1>
                        </div> */}
                    </div>
                    <NavLink to='/'>
                        <div className='snav-inner-each-diff'>
                            <div className='snav-mle-names'>
                                <DashboardIcon/>
                                <h2>Dashboard</h2>
                            </div>
                        </div>
                    </NavLink>

                    {/* snav each div --> MANAGE LEAD */}
                    {(sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee' || sharedvalue.role==='customer') && 
                    <div className='snav-inner-each'>
                        <div
                        className={`snav-mle-inner-div ${location.pathname==='/managelead/leadcreate'||location.pathname==='/managelead/viewlead'?'snav-mle-inner-div-active':''}`}
                        onClick={() => handleImageClick('uniqueDiv1')}
                        >
                            <div className='snav-mle-names'>
                                <LeaderboardIcon/>
                                <h2>Manage Lead</h2>
                            </div>
                            <div className={`iconrotatecon ${rotationStates['uniqueDiv1'] ? 'rotated': '' }`}>
                                <KeyboardArrowDownIcon/>
                            </div>
                            
                        </div>
                        <div className={`snav-each-dropdown ${rotationStates['uniqueDiv1'] ? 'extendmenu':''}`}>
                            
                            {(sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee' || sharedvalue.role==='customer') && <div onClick={()=>navigate('/managelead/leadcreate')}>
                                <AddIcon/>
                                <h2>Create Lead</h2>
                            </div>}
                            <div onClick={()=>navigate('/managelead/viewlead')}>
                                <FilterListIcon/>
                                <h2>View All Leads</h2>
                            </div>
                        </div>
                    </div>
                    }
                    {/* MANAGE LEAD END */}

                    
                    {/* snav each div  */}
                    {(sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee') && 
                    <div className='snav-inner-each'>
                        <div 
                        className={`snav-mle-inner-div ${location.pathname==='/managequotation/createquotation'||location.pathname==='/managequotation/viewquotation'?'snav-mle-inner-div-active':''}`}
                        onClick={() => handleImageClick('uniqueDiv6')}
                        >
                            <div className='snav-mle-names'>
                                <FormatQuoteIcon/>
                                <h2>Manage Quotation</h2>
                            </div>
                            <div className={`iconrotatecon ${rotationStates['uniqueDiv6'] ? 'rotated': ''}`}>
                            <KeyboardArrowDownIcon />
                            </div>
                        </div>
                        <div className={`snav-each-dropdown ${rotationStates['uniqueDiv6'] ? 'extendmenu':''}`}>
                            <div onClick={()=>navigate('/managequotation/createquotation')}>
                                <AddIcon/>
                                <h2>Create Quotation</h2>
                            </div>
                            <div onClick={()=>navigate('/managequotation/viewquotation')}>
                                <FilterListIcon/>
                                <h2>View Quotation</h2>
                            </div>
                        </div>
                    </div>
                    }
                    {/* snav each div  */}
                    {(sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee' || sharedvalue.role==='customer') && 
                    <div className='snav-inner-each'>
                        <div 
                        className={`snav-mle-inner-div ${location.pathname==='/manageticket/createticket'||location.pathname==='/manageticket/viewticket'?'snav-mle-inner-div-active':''}`}
                        onClick={() => handleImageClick('uniqueDiv8')}
                        >
                            <div className='snav-mle-names'>
                                <ReceiptIcon/>
                                <h2>Manage Ticket</h2>
                            </div>
                            <div className={`iconrotatecon ${rotationStates['uniqueDiv8'] ? 'rotated': ''}`}>
                                <KeyboardArrowDownIcon/>
                            </div>
                        </div>
                        <div className={`snav-each-dropdown ${rotationStates['uniqueDiv8'] ? 'extendmenu':''}`}>
                            <div onClick={()=>navigate('/manageticket/createticket')}>
                                <AddIcon/>
                                <h2>Create Ticket</h2>
                            </div>
                            <div onClick={()=>navigate('/manageticket/viewticket')}>
                                <FilterListIcon/>
                                <h2>View Ticket</h2>
                            </div>
                        </div>
                    </div>
                    }
                    {/* snav each div  */}
                    {(sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee' ||sharedvalue.role==='finance') &&
                    <div className='snav-inner-each'>
                        <div
                        className={`snav-mle-inner-div ${location.pathname==='/manageexpense/createexpense'||location.pathname==='/manageexpense/viewexpense'?'snav-mle-inner-div-active':''}`}
                        onClick={() => handleImageClick('uniqueDiv7')}
                        >
                            <div className='snav-mle-names' >
                                <ReceiptLongIcon/>
                                <h2>Manage Expense</h2>
                            </div>
                            <div className={`iconrotatecon ${rotationStates['uniqueDiv7'] ? 'rotated': ''}`}>
                                <KeyboardArrowDownIcon/>
                            </div>
                        </div>
                        <div className={`snav-each-dropdown ${rotationStates['uniqueDiv7'] ? 'extendmenu':''}`}>
                            <div onClick={()=>navigate('/manageexpense/createexpense')}>
                                <AddIcon/>
                                <h2>Create Expense</h2>
                            </div>
                            <div onClick={()=>navigate('/manageexpense/viewexpense')}>
                                <FilterListIcon/>
                                <h2>View Expense</h2>
                            </div>
                        </div>
                    </div>
                    }

                    {/* snav each div  */}
                    {sharedvalue.role==='admin' && 
                    <div className='snav-inner-each'>
                        <div 
                        className={`snav-mle-inner-div ${location.pathname==='/managemanger/createmanger'||location.pathname==='/managemanger/viewmanger'?'snav-mle-inner-div-active':''}`}
                        onClick={() => handleImageClick('uniqueDiv2')}
                        >
                            <div className='snav-mle-names'>
                                <PersonIcon/>
                                <h2>Manage Manager</h2>
                            </div>
                            <div className={`iconrotatecon ${rotationStates['uniqueDiv2'] ? 'rotated': ''}`}>
                            <KeyboardArrowDownIcon/>
                            </div>
                            
                        </div>
                        <div className={`snav-each-dropdown ${rotationStates['uniqueDiv2'] ? 'extendmenu':''}`}>
                            <div onClick={()=>navigate('/managemanger/createmanger')}>
                                <AddIcon/>
                                <h2>Create Project Manager</h2>
                            </div>
                            <div onClick={()=>navigate('/managemanger/viewmanger')}>
                                <FilterListIcon/>
                                <h2>View Project Manager</h2>
                            </div>
                        </div>
                    </div>
                    }
                    {/* snav each div  */}
                    {(sharedvalue.role==='admin' || sharedvalue.role==='manager' )&& 
                    <div className='snav-inner-each'>
                        <div 
                        className={`snav-mle-inner-div ${location.pathname==='/manageemployee/createemployee'||location.pathname==='/manageemployee/viewemployee'?'snav-mle-inner-div-active':''}`}
                        onClick={() => handleImageClick('uniqueDiv3')}
                        >
                            <div className='snav-mle-names'>
                                <PersonIcon/>
                                <h2>Manage Employee</h2>
                            </div>
                            <div className={`iconrotatecon ${rotationStates['uniqueDiv3'] ? 'rotated': ''}`}>
                                <KeyboardArrowDownIcon/>
                            </div>
                        </div>
                        <div className={`snav-each-dropdown ${rotationStates['uniqueDiv3'] ? 'extendmenu':''}`}>
                            <div onClick={()=>navigate('/manageemployee/createemployee')}>
                                <AddIcon/>
                                <h2>Create Employee</h2>
                            </div>
                            <div onClick={()=>navigate('/manageemployee/viewemployee')}>
                                <FilterListIcon/>
                                <h2>View Employee</h2>
                            </div>
                        </div>
                    </div>
                    }
                    {/* snav each div  */}
                    {sharedvalue.role==='admin' && 
                    <div className='snav-inner-each'>
                        <div 
                        className={`snav-mle-inner-div ${location.pathname==='/managefinance/createfinance'||location.pathname==='/managefinance/viewfinance'?'snav-mle-inner-div-active':''}`}
                        onClick={() => handleImageClick('uniqueDiv4')}
                        >
                            <div className='snav-mle-names'>
                                <PersonIcon/>
                                <h2>Manage Finance</h2>
                            </div>
                            <div className={`iconrotatecon ${rotationStates['uniqueDiv4'] ? 'rotated': ''}`}>
                            <KeyboardArrowDownIcon/>
                            </div>
                        </div>
                        <div className={`snav-each-dropdown ${rotationStates['uniqueDiv4'] ? 'extendmenu':''}`}>
                            <div onClick={()=>navigate('/managefinance/createfinance')}>
                                <AddIcon/>
                                <h2>Create Finance Manager</h2>
                            </div>
                            <div onClick={()=>navigate('/managefinance/viewfinance')}>
                                <FilterListIcon/>
                                <h2>View Finance Manager</h2>
                            </div>
                        </div>
                    </div>
                    }
                    {/* snav each div  */}
                    {(sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee') && 
                    <div className='snav-inner-each'>
                        <div 
                        className={`snav-mle-inner-div ${location.pathname==='/managecustomer/viewcustomer'||location.pathname==='/managecustomer/createcustomer'?'snav-mle-inner-div-active':''}`}
                        onClick={() => handleImageClick('uniqueDiv5')}
                        >
                            <div className='snav-mle-names'>
                                <PersonIcon/>
                                <h2>Company Profiles</h2>
                            </div>
                            <div  className={`iconrotatecon ${rotationStates['uniqueDiv5'] ? 'rotated': ''}`}>
                                <KeyboardArrowDownIcon/>
                            </div>
                        </div>
                        <div className={`snav-each-dropdown ${rotationStates['uniqueDiv5'] ? 'extendmenu':''}`}>
                            <div onClick={()=>navigate('/managecustomer/createcustomer')}>
                                <AddIcon/>
                                <h2>Create Profile</h2>
                            </div>
                            <div onClick={()=>navigate('/managecustomer/viewcustomer')}>
                                <FilterListIcon/>
                                <h2>View Profile</h2>
                            </div>
                        </div>
                    </div>
                    }
                    
                    {/* snav each div  */}
                    {sharedvalue.role==='admin' &&
                    <NavLink to='/search'>
                        <div className='snav-inner-each-diff'>
                            <div className='snav-mle-names'>
                                <FindInPageIcon/>
                                <h2>Search</h2>
                            </div>
                        </div>
                    </NavLink>
                    }
                    {/* snav each div  */}
                    <div className='snav-inner-act-page-head'>
                        <div>
                            <h2>Account Pages</h2>
                        </div>
                    </div>
                    {/* snav each div  */}
                    <NavLink to='/profile'>
                    <div className='snav-inner-each-diff'>
                        <div className='snav-mle-names'>
                            <SwitchAccountIcon/>
                            <h2>Profile</h2>
                        </div>
                    </div>
                    </NavLink>
                    {/* snav each div  */}
                    <button className='snav-inner-logout' onClick={()=>handlesignout()}>
                        LOGOUT
                    </button>
                </div>
            </div>
        </>
    );
}

export default Sidenav;